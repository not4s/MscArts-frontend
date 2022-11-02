import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "";

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

  getApplicantDataStacked(count: string, series: string): Promise<APIResponse> {
    return this.buildAuthRequest(
      "GET",
      `api/applicant/?count=${count}&series=${series}`
    );
  }

  postSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildAuthRequest("POST", "api/upload/", data);
  }

  getAllApplicants(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant");
  }

  login(username: string, password: string): Promise<APIResponse> {
    return this.buildRequest("POST", "api/user/login", { username, password });
  }

  getRole(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/user/roles");
  }

  getTargets(): Promise<APIResponse> {
    return this.buildAuthRequest("GET", "api/applicant/target");
  }

  postTarget({ course, target, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("POST", `api/applicant/target`, {
      program_type: course,
      year,
      target,
    });
  }

  putTarget({ course, target, year }: any): Promise<APIResponse> {
    return this.buildAuthRequest("PUT", `api/applicant/target`, {
      program_type: course,
      year,
      target,
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
}
