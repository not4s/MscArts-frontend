import React from "react";
import SpreadsheetUpload from "./components/SpreadsheetUpload";
import VisulisationNagivation from "./components/VisulisationNagivation";

export default function App() {
  return (
    <div className="App">
      <VisulisationNagivation />
      <SpreadsheetUpload />
    </div>
  );
}
