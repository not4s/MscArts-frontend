type GraphType = "BAR" | "PIE";

export interface GraphInterface {
  title: string;
  type: GraphType;
  programType: string;
  graphType: string;
  data: any[] | undefined;
  stack?: boolean;
  top?: number;
  position?: GraphPanelInterface;
}

export interface GraphPanelInterface {
  w: number;
  x: number;
  y: number;
}
