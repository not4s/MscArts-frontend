import RGL from "react-grid-layout";

type GraphType = "BAR" | "PIE" | "LINE";

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
}
