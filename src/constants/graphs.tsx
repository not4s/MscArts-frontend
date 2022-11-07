type GraphType = "BAR" | "PIE";

export interface GraphInterface {
  type: GraphType;
  programType: string;
  graphType: string;
  data: any[] | undefined;
  stack?: boolean;
}
