import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { message, Spin, Upload } from "antd";
import axios from "axios";
import { Modal, Input } from "antd";
import {
  ExclamationCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ApplicantTable } from "./ApplicantTable";
import { RollbackTable } from "./RollbackTable";
import { APIService } from "../services/API";
import type { UploadProps } from "antd";

const FILE_TYPES = ["CSV", "XLS", "XML", "XLSX"];
const { Dragger } = Upload;

const SpreadsheetUpload = () => {
  // const [file, setFile] = useState("");
  const { confirm } = Modal;
  const [showSpin, setShowSpin] = useState(false);
  const [reload, setReload] = useState(false);
  const api = new APIService();

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
    console.log("POSTING");
    setShowSpin(true);
    api
      .postSpreadsheet(formData)
      .then(() => {
        console.log("success");
        message.success("Upload successful");
        setReload(true);
        setShowSpin(false);
      })
      .catch(() => console.log("failure"));
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <div>
      <Spin
        spinning={showSpin}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Dragger
          showUploadList={false}
          {...props}
          disabled={showSpin}
          beforeUpload={(file: File) => {
            console.log(file.type);
            const correctFileType =
              file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              file.type === "application/vnd.ms-excel";
            if (!correctFileType) {
              message.error("You can only upload XLS or XLSX files!");
              return false;
            } else {
              handleChange(file);
              return false;
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
        <RollbackTable reload={reload} />
      </Spin>
    </div>
  );
};

export default SpreadsheetUpload;
