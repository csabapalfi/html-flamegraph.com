import prettyBytes from "pretty-bytes";
import { parse } from "@babel/parser";
import { Text } from "domhandler";
import { RawData } from "react-flame-graph";

// See https://github.com/babel/babel/issues/13855
import _generate, { Node } from "@babel/generator";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
const generate = _generate.default;

function getSize(node: Node) {
  return node.end - node.start || 0;
}

function getKey(node: Node) {
  if (node.type === "ObjectExpression") {
    return "{...}";
  }
  if (node.type === "ArrayExpression") {
    return "[...]";
  }
  if (node.type === "ObjectProperty" && node.key) {
    const { code } = generate(node.key);
    return `.${code.replace(/"/g, "")}`;
  }
  if (node.type === "AssignmentExpression") {
    const { code } = generate(node.left);
    return `${code}=`;
  }
  if (node.type === "VariableDeclaration") {
    const { code } = generate(node.declarations[0].id);
    return `${node.kind} ${code}=`;
  }
  return node.type;
}

function getName(node: Node) {
  return `${getKey(node)} (${prettyBytes(getSize(node))})`;
}

function getFlameGraphEntry(node: Node, children = []) {
  return { name: getName(node), value: getSize(node), children };
}

export function parseScript(scriptChild: Text): RawData {
  try {
    const ast = parse(scriptChild.nodeValue);
    const nodes = new Map();
    traverse(ast, {
      enter(path) {
        const { node, parent } = path;
        const flameGraphEntry = getFlameGraphEntry(node);
        nodes.set(node, flameGraphEntry);
        if (nodes.has(parent)) {
          nodes.get(parent).children.push(flameGraphEntry);
        } else {
          nodes.set(parent, getFlameGraphEntry(parent, [flameGraphEntry]));
        }
      },
    });
    return Array.from(nodes.values())[0];
  } catch (e) {
    console.log(scriptChild.data, e);
    return {
      name: "failed to parse script",
      value: scriptChild.endIndex - scriptChild.startIndex,
      tooltip: e.message,
      children: [],
    };
  }
}
