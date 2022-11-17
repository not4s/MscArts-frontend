import RGL from "react-grid-layout";

type GraphType = "BAR" | "PIE" | "LINE";

type FeeStatus = "Combined" | "Overseas" | "Home";

export interface TargetInterface {
  fee_status: FeeStatus;
  target: number;
}

export type Graph = BarGraphInterface | PieGraphInterface | LineGraphInterface;

export interface GraphGridInterface {
  label: string;
  key: string;
  graph: Graph[];
}

export interface BaseGraphInterface {
  title: string;
  layout: RGL.Layout;
  type: GraphType;
  programType: string;
  decisionStatus: string;
  graphType: string;
  data: any[] | undefined;
}

export interface BarGraphInterface extends BaseGraphInterface {
  stack?: string;
  combined?: boolean;
  target?: TargetInterface[];
}

export interface PieGraphInterface extends BaseGraphInterface {
  top?: number;
}

export interface LineGraphInterface extends BaseGraphInterface {
  frequency?: number;
  breakdown?: string;
  series?: string;
}
