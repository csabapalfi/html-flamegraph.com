import { ElementType, Parser } from "htmlparser2";
import {
  Document,
  DomHandler,
  ChildNode,
  Element,
  NodeWithChildren,
  Node,
  Text,
} from "domhandler";
import prettyBytes from "pretty-bytes";
import { parseScript } from "./script";
import { RawData } from "react-flame-graph";

const isNodeWithChildren = (node: Node): node is NodeWithChildren =>
  "children" in node;

const isElement = (node: Node): node is Element =>
  [ElementType.Tag, ElementType.Script, ElementType.Style].includes(node.type);

const isText = (node: Node): node is Text => node.type === ElementType.Text;

const isTruthy = (x: any) => Boolean(x);

const isJavaScript = (node: Node): node is Element => {
  return (
    isElement(node) &&
    node.type === ElementType.Script &&
    (!node.attribs.type || node.attribs.type.includes("javascript"))
  );
};

function getName(node: Node) {
  if (!isElement(node)) {
    return node.type;
  }

  const { type, name, attribs = {} } = node;

  if (attribs.id) {
    return `${name}[id=${attribs.id}]`;
  }

  const firstClass = (attribs.class || "").split(" ")[0];
  if (firstClass) {
    return `${name}.${firstClass}`;
  }

  if (type === ElementType.Script && attribs.type) {
    return `${name}[type=${attribs.type}]`;
  }

  if (name === "meta" && attribs.name) {
    return `${name}[name=${attribs.name}]`;
  }

  if (name === "meta" && attribs["http-equiv"]) {
    return `${name}[http-equiv=${attribs["http-equiv"]}]`;
  }

  return name;
}

const processChildren = (node: Node): RawData[] => {
  if (!isNodeWithChildren(node)) {
    return [];
  }

  if (isJavaScript(node)) {
    return node.children.filter(isText).map(parseScript).filter(isTruthy);
  }

  return node.children.map(toFlameGraphData).filter(isTruthy);
};

function toFlameGraphData(node: Node): RawData {
  const { type, startIndex, endIndex } = node;
  if (type === ElementType.Text) {
    return null;
  }

  const size = endIndex - startIndex;
  const name = `${getName(node)} (${prettyBytes(size)})`;

  return {
    name,
    value: size,
    children: processChildren(node),
  };
}

const handleDomReady =
  (callback: (error: Error | null, data?: RawData) => void) =>
  (error: Error | null, dom: ChildNode[]): void => {
    if (error) {
      return callback(error);
    } else {
      const root = new Document(dom);
      root.startIndex = 0;
      root.endIndex = dom[dom.length - 1].endIndex;
      callback(null, toFlameGraphData(root));
    }
  };

export const parseHtml = (rawHtml: string): Promise<RawData> =>
  new Promise((resolve, reject) => {
    const handler = new DomHandler(
      handleDomReady((error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      }),
      {
        withStartIndices: true,
        withEndIndices: true,
      }
    );
    const parser = new Parser(handler);
    parser.write(rawHtml);
    parser.end();
  });
