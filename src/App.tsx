import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["CSV", "XLS", "XML"];

export default function App() {
  const [file, setFile] = useState(null);
  const handleChange = (file: any) => {
    setFile(file);
    console.log(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
    </div>
  );
}
