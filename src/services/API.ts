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

  postSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/upload/", data);
  }

  postMockSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/upload/mock/", data);
  }

  getAllApplicants(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant/");
  }

  getAllAttributes(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant/attribute");
  }

  getGraph(graph: Graph, mock: boolean = false): Promise<APIResponse> {
    const { programType, decisionStatus, primary, customDecision, year } =
      graph;

    let reqURL = `api/applicant/graph/?primary=${primary}&program_type=${programType}&decision_status=${decisionStatus}&year=${year}`;

    if (mock) {
      reqURL += "&mock=1";
    }

    if (decisionStatus === "custom") {
      reqURL += `&custom_decision=${customDecision?.toString()}`;
    }

    if (graph.type === "PIE") {
      let pieGraph: PieGraphInterface = graph;
      reqURL = `${reqURL}&type=PIE&top=${pieGraph.top ? pieGraph.top : 0}`;
    } else if (graph.type === "BAR") {
      let barGraph: BarGraphInterface = graph;
      reqURL = `${reqURL}&type=BAR`;

      if (barGraph.secondary !== undefined) {
        reqURL += `&secondary=${barGraph.secondary}`;
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

  login(username: string, password: string): Promise<APIResponse> {
    return this.buildRequest("POST", "api/user/login/", { username, password });
  }

  getRole(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/user/roles/");
  }

  getTargets(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/target/progress/");
  }

  getTarget(course: any, year: any): Promise<APIResponse> {
    return this.buildAuthRequest(
      "GET",
      `api/target/?year=${year}&program_type=${course}`
    );
  }

  postTarget({ course, target, fee_status, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("POST", `api/target/`, {
      program_type: course,
      year,
      fee_status,
      target,
    });
  }

  putTarget({ course, target, fee_status, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", `api/target/`, {
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

  getComments(erpid: number): Promise<APIResponse> {
    return this.buildAuthRequest(
      "GET",
      `api/applicant/comment/?erpid=${erpid}`
    );
  }

  postComment(erpid: number, comment: string): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/applicant/comment/", {
      erpid,
      comment,
    });
  }

  getUserAccess(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/user/access/");
  }

  getUploadedSheets(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/upload/");
  }

  rollbackUploadedSheet(version: Number): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", "api/upload/", { version });
  }

  getPrograms(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/program/");
  }

  programChange(
    code: string,
    name: string,
    academicLevel: string,
    programType: string,
    active: boolean
  ): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", "api/program/", {
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
    return this.buildAuthRequest("POST", "api/program/", {
      code: code,
      name: name,
      academic_level: academicLevel,
      program_type: programType,
      active: active,
    });
  }

  programDelete(code: string): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", "api/program/", {
      code: code,
    });
  }

  updateAccessLevel(username: string, level: number): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", "api/user/roles/", {
      username: username,
      access: level,
    });
  }

  getTrends({ breakdown, frequency, series, code, decisionStatus }: any) {
    let endpoint = `api/trends/?unit=${frequency}&period=${breakdown}`;
    if (series !== null && series !== "all") {
      endpoint += `&series=${series}`;
    }
    if (code != null) {
      endpoint += `&code=${code}`;
    }
    if (decisionStatus != null) {
      endpoint += `&decision_status=${decisionStatus}`;
    }
    return this.buildAuthRequest("GET", endpoint);
  }

  getCycles({
    breakdown,
    frequency,
    series,
    code,
    cycleYears,
    startDate,
    endDate,
  }: any) {
    let cycles = cycleYears.join(",");
    let endpoint = `api/trends/cycle?period=${breakdown}`;
    if (cycleYears.length > 0) {
      endpoint += `&cycle=${cycles}`;
    }
    if (startDate !== "" && endDate !== "") {
      endpoint += `&start=${startDate.slice(0, 5)}`;
      endpoint += `&end=${endDate.slice(0, 5)}`;
    }

    return this.buildAuthRequest("GET", endpoint);
  }

  exportTab(base64JSON: string): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/template/", {
      base64JSON,
    });
  }

  importTab(template_id: string): Promise<APIResponse> {
    return this.buildAuthRequest("GET", `api/template/?id=${template_id}`);
  }

  addDefaultTabs(uid: string, title: string): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/template/default/", {
      uid,
      title,
    });
  }

  getDefaultTabs(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/template/default/");
  }

  deleteDefaultTab(uid: string): Promise<APIResponse> {
    return this.buildAuthRequest("DELETE", "api/template/default/", {
      uid,
    });
  }

  editDefaultTab(uid: string, title: string): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", "api/template/default/", {
      uid,
      title,
    });
  }
}
