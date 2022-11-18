import axios from "axios";
import {
  BarGraphInterface,
  Graph,
  PieGraphInterface,
} from "../constants/graphs";

const apiURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "http://localhost:3000/";

export interface APIResponse {
  success: boolean;
  data?: any;
}

export class APIService {
  async buildRequest(
    method: string,
    endpoint: string,
    data: { [key: string]: any } | FormData = {}
  ) {
    let res = await axios.request({
      url: apiURL + endpoint,
      method: method,
      data,
    });

    return { success: true, ...res };
  }

  async buildAuthRequest(
    method: string,
    endpoint: string,
    data: { [key: string]: any } | FormData = {}
  ) {
    const accessToken = sessionStorage.getItem("user");

    if (!accessToken)
      return { success: false, data: { message: "Unauthorized Request" } };

    let res = await axios
      .request({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        url: apiURL + endpoint,
        method: method,
        data,
      })
      .catch((err) => {
        return { success: false, data: { message: "Unauthorized Request" } };
      });

    return { success: true, ...res };
  }

  getApplicantData(count: string): Promise<APIResponse> {
    return this.buildAuthRequest("GET", `api/applicant/?count=${count}`);
  }

  getApplicant(config: { [k: string]: string }): Promise<APIResponse> {
    let url = "api/applicant/?";

    for (var k in config) {
      url += `${k}=${config[k]}&`;
    }

    return this.buildAuthRequest("GET", url);
  }

  getApplicantDataStacked(count: string, series: string): Promise<APIResponse> {
    return this.buildAuthRequest(
      "GET",
      `api/applicant/?count=${count}&series=${series}`
    );
  }

  postSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/upload/", data);
  }

  postMockSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/upload/mock", data);
  }

  getAllApplicants(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant");
  }

  getGraph(graph: Graph): Promise<APIResponse> {
    const { programType, decisionStatus, graphType, customDecision } = graph;

    let reqURL = `api/applicant/graph/?primary=${graphType}&program_type=${programType}&decision_status=${decisionStatus}`;

    if (decisionStatus === "custom") {
      reqURL += `&custom_decision=${customDecision?.toString()}`;
    }

    if (graph.type === "PIE") {
      let pieGraph: PieGraphInterface = graph;
      reqURL = `${reqURL}&type=PIE&top=${pieGraph.top ? pieGraph.top : 0}`;
    } else if (graph.type === "BAR") {
      let barGraph: BarGraphInterface = graph;
      reqURL = `${reqURL}&type=BAR`;

      if (barGraph.stack !== undefined) {
        reqURL += `&secondary=${barGraph.stack}`;
      }

      if (barGraph.combined) {
        reqURL += `&combined=1`;
      }
    } else {
      // Line Graph
      reqURL = `${reqURL}&type=LINE`;
    }
    return this.buildAuthRequest("GET", reqURL);
  }

  getAllAttributes(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant/attribute");
  }

  login(username: string, password: string): Promise<APIResponse> {
    return this.buildRequest("POST", "api/user/login", { username, password });
  }

  getRole(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/user/roles");
  }

  getTargets(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/target/progress");
  }

  getTarget(course: any, year: any): Promise<APIResponse> {
    return this.buildAuthRequest(
      "GET",
      `api/target?year=${year}&program_type=${course}`
    );
  }

  postTarget({ course, target, fee_status, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("POST", `api/target`, {
      program_type: course,
      year,
      fee_status,
      target,
    });
  }

  putTarget({ course, target, fee_status, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", `api/target`, {
      program_type: course,
      year,
      fee_status,
      target,
    });
  }

  deleteTarget({ course, fee_status, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", `api/target/`, {
      program_type: course,
      fee_status,
      year,
    });
  }

  getUserAccess(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/user/access");
  }

  getUploadedSheets(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/upload/");
  }

  rollbackUploadedSheet(version: Number): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", "api/upload/", { version });
  }

  getPrograms(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/program");
  }

  programChange(
    code: string,
    name: string,
    academicLevel: string,
    programType: string,
    active: boolean
  ): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", "api/program", {
      code: code,
      name: name,
      academic_level: academicLevel,
      program_type: programType,
      active: active,
    });
  }

  programAdd(
    code: string,
    name: string,
    academicLevel: string,
    programType: string,
    active: boolean
  ): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/program", {
      code: code,
      name: name,
      academic_level: academicLevel,
      program_type: programType,
      active: active,
    });
  }

  programDelete(code: string): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", "api/program", {
      code: code,
    });
  }

  updateAccessLevel(username: string, level: number): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", "api/user/roles", {
      username: username,
      access: level,
    });
  }

  getTrends({ breakdown, frequency, series }: any) {
    let endpoint = `api/trends/?unit=${frequency}&period=${breakdown}`;
    if (series != null && series != "all") {
      endpoint += `&series=${series}`;
    }
    return this.buildAuthRequest("GET", endpoint);
  }
}
