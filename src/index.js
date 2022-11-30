import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";
import "./index.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./components/Settings/GeneralSettings.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { TourProvider } from "@reactour/tour";

const tutorialSteps = [
  {
    selector: ".ant-tabs-nav-list",
    content: "These are the different tabs where you can add graphs to",
  },
  {
    selector: ".ant-tabs-nav-add",
    content: "Press this to add a new tab",
  },
  {
    selector: ".ant-tabs-content-holder",
    content: "This is where your graphs will be displayed",
  },
  {
    selector: ".add-graph-button",
    content: "You can add a new graph using this button",
  },
  {
    selector: ".more-actions-button",
    content: "Import and export tabs using this option",
  },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={sessionStorage.getItem("user")}>
              <TourProvider steps={tutorialSteps}>
                <App />
              </TourProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
