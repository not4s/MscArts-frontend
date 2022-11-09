import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Alert, message, Spin, Upload } from "antd";
import axios from "axios";
import { Modal, Input } from "antd";
import { ApplicantTable } from "./Applicants/ApplicantTable";
import {
  ExclamationCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { RollbackTable } from "./RollbackTable";
import { APIService } from "../services/API";
import type { UploadProps } from "antd";

const FILE_TYPES = ["CSV", "XLS", "XML", "XLSX"];
const { Dragger } = Upload;

interface Props {
  mock: boolean;
  setMock: React.Dispatch<React.SetStateAction<boolean>>;
  setMockData: React.Dispatch<React.SetStateAction<any[]>>;
}

const SpreadsheetUpload: React.FC<Props> = ({ mock, setMock, setMockData }) => {
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
    if (mock) {
      api
        .postMockSpreadsheet(formData)
        .then((res) => {
          console.log(res);
          if (res.success) {
            message.success("Uploaded Mock Data Successfully");
          } else {
            message.error("Failed to upload Mock Data");
          }
          setReload(true);
          setShowSpin(false);
          setMock(res.success);
          setMockData(res.data);
        })
        .catch(() => console.log("failure"));
    } else {
      api
        .postSpreadsheet(formData)
        .then((res) => {
          console.log("success");
          if (res.success) {
            message.success("Upload Successful");
          } else {
            message.error("Upload Failed");
          }
          setReload(true);
          setShowSpin(false);
        })
        .catch(() => console.log("failure"));
    }
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
        {mock ? (
          <Alert
            description="Any files uploaded will result in visualizing mock data"
            banner
            type="warning"
          />
        ) : (
          <></>
        )}
        <Dragger
          showUploadList={false}
          {...props}
          disabled={showSpin}
          beforeUpload={(file: File) => {
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
        {!mock ? <RollbackTable reload={reload} /> : <></>}
      </Spin>
    </div>
  );
};

export default SpreadsheetUpload;
