import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

const FILE_TYPES = ["CSV", "XLS", "XML", "XLSX"];

const SpreadsheetUpload = () => {
  const handleChange = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function () {
        console.log("success");
      })
      .catch(function () {
        console.log("failure");
      });
  };

  return (
    <div>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={FILE_TYPES}
      />
    </div>
  );
};

export default SpreadsheetUpload;
