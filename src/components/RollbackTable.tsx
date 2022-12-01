import React, { useEffect, useRef, useState } from "react";
import { APIService } from "../services/API";
import { ColumnsType } from "antd/lib/table";
import { Table, Button, Modal, message } from "antd";
import {
  RollbackOutlined,
  ExclamationCircleOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import type { InputRef } from "antd";

interface DataType {
  key: React.Key;
  filetype: string;
  file_name: string;
  version: number;
  timestamp: string;
}

export const RollbackTable = (props: any) => {
  const [sheets, setSheets] = useState(undefined);
  const api = new APIService();

  const { confirm } = Modal;
  const showConfirm = (version: Number) => {
    confirm({
      title: "Are you sure you want to rollback this spreadsheet?",
      icon: <ExclamationCircleOutlined />,
      okText: "Rollback",
      onOk() {
        handleOk(version);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const handleOk = (version: Number) => {
    api.rollbackUploadedSheet(version).then((res) => {
      if (res.data.message === "Rolled Back File") {
        message.success("Successfully rolled back");
        props.setReload(true);
      } else {
        message.error("Failed to rollback File");
      }
    });
  };

  useEffect(() => {
    if (props.reload) {
      api.getUploadedSheets().then((result) => {
        setSheets(result.data);
        props.setReload(false);
      });
    }
  }, [props.reload]);

  const columns: ColumnsType<DataType> = [
    {
      title: "File Type",
      dataIndex: "filetype",
      width: 150,
    },
    {
      title: "File Name",
      dataIndex: "name",
    },
    {
      title: "Created Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Rollback",
      dataIndex: "actions",
      render: (_, record: DataType) => {
        return record["filetype"] === "Applicant" || "Deposit" ? (
          <>
            <Button
              onClick={(e) => showConfirm(record.version)}
              icon={<RollbackOutlined />}
              style={{ marginLeft: "2vh", marginRight: "2vh" }}
            />
          </>
        ) : (
          <></>
        );
      },
    },
  ];

  return (
    <>
      <Table loading={props.reload} columns={columns} dataSource={sheets} />
    </>
  );
};

export default RollbackTable;
