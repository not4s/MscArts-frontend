import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import { Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const FILE_TYPES = ["CSV", "XLS", "XML", "XLSX"];

const SpreadsheetUpload = () => {
  // const [file, setFile] = useState("");
  const { confirm } = Modal;

  const showConfirm = (file: File) => {
    confirm({
      title: "Are you sure you want to upload this spreadsheet?",
      icon: <ExclamationCircleOutlined />,
      okText: "Upload",
      onOk() {
        handleOk(file);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const handleChange = (file: File) => {
    // setFile(file);
    showConfirm(file);
  };

  const handleOk = (file: File) => {
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
