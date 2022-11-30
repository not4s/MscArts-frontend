import React, { useState } from "react";
import { Alert, Button, Form, message, Select, Spin, Upload } from "antd";
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
const { Option } = Select;

interface Props {
  mock: boolean;
  setMock: React.Dispatch<React.SetStateAction<boolean>>;
  setMockData: React.Dispatch<React.SetStateAction<any[]>>;
}

const SpreadsheetUpload: React.FC<Props> = ({ mock, setMock, setMockData }) => {
  // const [file, setFile] = useState("");
  const { confirm } = Modal;
  const [showSpin, setShowSpin] = useState(false);
  const [reload, setReload] = useState(true);
  const api = new APIService();
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [form] = Form.useForm();

  const handleChange = (file: File) => {
    setFile(file);
    setOpenModal(true);
  };
  const handleOk = (values: any) => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("type", values["spreadsheet-type"]);
    console.log("POSTING");
    setOpenModal(false);
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
          setOpenModal(false);
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
      <Modal
        title="Choose the Spreadsheet Type"
        okText="Submit"
        onCancel={() => setOpenModal(false)}
        open={openModal}
        footer={null}
      >
        <Form onFinish={handleOk} form={form}>
          <Form.Item name="spreadsheet-type">
            <p>Are you sure you want to upload this spreadsheet?</p>
            <Select
              placeholder="Select Spreadsheet Type"
              style={{ width: 240 }}
              onChange={(value) => {
                switch (value) {
                  case "APPLICANT":
                    form.setFieldsValue({ "spreadsheet-type": "APPLICANT" });
                    return;
                  case "DEPOSIT":
                    form.setFieldsValue({ "spreadsheet-type": "DEPOSIT" });
                    return;
                  default:
                }
              }}
            >
              <Option value="APPLICANT">Applicant Spreadsheet</Option>
              <Option value="DEPOSIT">Deposit Spreadsheet</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
        {!mock ? (
          <RollbackTable reload={reload} setReload={setReload} />
        ) : (
          <></>
        )}
      </Spin>
    </div>
  );
};

export default SpreadsheetUpload;
