type GraphType = "BAR" | "PIE" | "LINE";

export interface GraphInterface {
  title: string;
  type: GraphType;
  programType: string;
  graphType: string;
  data: any[] | undefined;
  stack?: boolean;
  top?: number;
}
