import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const FILE_TYPES = ["CSV", "XLS", "XML", "XLSX"];

const SpreadsheetUpload = () => {
  const [file, setFile] = useState(null);
  const handleChange = (file: any) => {
    setFile(file);
    console.log(file);
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
