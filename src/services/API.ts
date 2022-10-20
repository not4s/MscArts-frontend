import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "";

export interface APIResponse {
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

    return res;
  }

  async buildAuthRequest(method: string, endpoint: string) {}

  getApplicantData(): Promise<APIResponse> {
    return this.buildRequest("GET", "/api/applicant?count=gender/");
  }

  postSpreadsheet(data: FormData): Promise<APIResponse> {
    return this.buildRequest("POST", "/api/upload/", data);
  }
}
