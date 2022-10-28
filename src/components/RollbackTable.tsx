import React, { useEffect, useRef, useState } from "react";
import { APIService } from "../services/API";
import { ColumnsType } from "antd/lib/table";
import { Table, Button, Modal } from "antd";
import { RollbackOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface DataType {
  key: React.Key;
  name: string;
  code: string;
  academic_level: string;
  active: boolean;
}

export const RollbackTable = () => {
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
        /* 
          [TODO] Refresh the Table after rollback is complete
        */
      }
    });
  };

  useEffect(() => {
    api.getUploadedSheets().then((result) => {
      setSheets(mapToToggle(result.data));
    });
  }, []);

  const mapToToggle = (data: any) => {
    return data.map((obj: any) => {
      obj.actions = (
        <>
          <Button
            onClick={(e) => showConfirm(obj["version"])}
            icon={<RollbackOutlined />}
            style={{ marginLeft: "2vh", marginRight: "2vh" }}
          />
        </>
      );
      return obj;
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Version",
      dataIndex: "version",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Created Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Rollback",
      dataIndex: "actions",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={sheets} />
      {/* <ProgramEditModal
        name={editName}
        code={editCode}
        level={editLevel}
        open={openEditModal}
        active={editActive}
        setOpen={setOpenEditModal}
      /> */}
    </>
  );
};

export default RollbackTable;
