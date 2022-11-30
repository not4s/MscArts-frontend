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
    selector: ".buttonx",
    content: "This is my first Step",
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
