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
        localStorage.setItem("user", JSON.stringify(response.data));
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

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  login,
  logout,
  role,
  getCurrentUser,
};
export default authService;
