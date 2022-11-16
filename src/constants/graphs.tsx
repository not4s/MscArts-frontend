import RGL from "react-grid-layout";

type GraphType = "BAR" | "PIE" | "LINE";

type FeeStatus = "Combined" | "Overseas" | "Home";

export interface TargetInterface {
  fee_status: FeeStatus;
  target: number;
}

export interface GraphInterface {
  title: string;
  layout: RGL.Layout;
  type: GraphType;
  programType: string;
  decisionStatus: string;
  stack?: string;
  graphType: string;
  data: any[] | undefined;
  combined?: boolean;
  top?: number;
  frequency?: number;
  breakdown?: string;
  target?: TargetInterface[];
}
