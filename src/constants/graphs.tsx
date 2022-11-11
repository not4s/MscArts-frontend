import RGL from "react-grid-layout";

type GraphType = "BAR" | "PIE";

export interface GraphInterface {
  title: string;
  layout: RGL.Layout;
  type: GraphType;
  programType: string;
  graphType: string;
  data: any[] | undefined;
  stack?: boolean;
  top?: number;
}
