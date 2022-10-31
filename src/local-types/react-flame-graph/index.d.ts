declare module "react-flame-graph" {
  import { PureComponent } from "react";
  type RawData = {
    backgroundColor?: string;
    color?: string;
    children?: Array<RawData>;
    id?: string;
    name: string;
    tooltip?: string;
    uid?: any;
    value: number;
  };

  type ChartNode = {
    backgroundColor: string;
    color: string;
    depth: number;
    left: number;
    name: string;
    source: RawData;
    tooltip?: string;
    width: number;
  };

  type Props = {
    data: RawData;
    height: number;
    width: number;
    onChange?: (chartNode: ChartNode, uid: any) => void;
  };

  class FlameGraph extends PureComponent<Props> {}
}
