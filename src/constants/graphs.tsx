type GraphType = "BAR" | "PIE";

export interface GraphInterface {
  title: string;
  type: GraphType;
  programType: string;
  graphType: string;
  data: any[] | undefined;
  stack?: boolean;
}
