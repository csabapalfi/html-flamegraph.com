import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FlameGraph as Graph } from "react-flame-graph";

export default function FlameGraph({ data }) {
  return (
    <div className="flamegraph">
      <AutoSizer>
        {({ height, width }) => (
          <Graph data={data} height={height} width={width} />
        )}
      </AutoSizer>
    </div>
  );
}
