import RGL from "react-grid-layout";

type GraphType = "BAR" | "PIE" | "LINE";

type FeeStatus = "Combined" | "Overseas" | "Home";

export interface TargetInterface {
  fee_status: FeeStatus;
  target: number;
}

export type Graph = BarGraphInterface | PieGraphInterface | LineGraphInterface;

export type DecisionStatus = "all" | "live" | "not_live" | "custom";

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
  decisionStatus: DecisionStatus;
  customDecision?: string[]; // Required if decisionStatus is custom
  primary: string;
  year: number;
  data: any[] | undefined;
}

export interface BarGraphInterface extends BaseGraphInterface {
  secondary?: string;
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
  cycle?: string;
  startDate?: string;
  endDate?: string;
  cycleYears?: string[];
  cumulative?: boolean;
}
