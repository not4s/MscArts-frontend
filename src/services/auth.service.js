import axios from "axios";
import authHeader from "./auth-header";

const login = (username, password) => {
  const json = JSON.stringify({ username: username, password: password });
  return axios
    .post("/api/user/login", json, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      console.log(error);
    })
    .then((response) => {
      if (response.data.accessToken) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const role = (username) => {
  const json = JSON.stringify({ username: username });
  const headers = authHeader();
  headers.assign("Content-Type", "application/json");
  return axios
    .post("/api/user/roles", json, {
      headers: headers,
    })
    .catch((error) => {
      console.log(error);
    })
    .then((response) => {
      return response.data;
    });
};

const getCurrentRole = (accessToken) => {
  axios
    .get("/api/user/roles", {
      Authorization: `Bearer ${accessToken}`,
    })
    .catch((error) => {
      console.log(error);
    })
    .then((response) => {
      return response.data;
    });
};

const logout = () => {
  sessionStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem("user"));
};

const authService = {
  login,
  logout,
  role,
  getCurrentUser,
  getCurrentRole,
};
export default authService;
