import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";
import "./components/Settings/GeneralSettings.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            sessionStorage.getItem("user") ? (
              <App />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
