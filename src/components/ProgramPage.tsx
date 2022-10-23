import React, { useEffect, useState } from "react";
import { APIService } from "../services/API";
import { ColumnsType, TableProps } from "antd/lib/table";
import { Table, Switch } from "antd";

export default function ProgramPage() {
  const [programs, setPrograms] = useState(undefined);
  const api = new APIService();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    api.getPrograms().then((result) => {
      setPrograms(mapToToggle(result.data));
    });
  }, [flag]);

  const mapToToggle = (data: any) => {
    return data.map((obj: any) => {
      obj.switch = (
        <Switch
          checked={obj.active}
          onChange={() => {
            api
              .programChange(
                obj.code,
                obj.name,
                obj.academic_level,
                !obj.active
              )
              .then(() => {
                // @ts-ignore
                setFlag(!flag);
              });
          }}
        />
      );
      return obj;
    });
  };

  interface DataType {
    key: React.Key;
    name: string;
    date: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Academic Level",
      dataIndex: "academic_level",
    },
    {
      title: "Tracking Status",
      dataIndex: "switch",
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", filters, sorter, extra);
  };

  return <Table columns={columns} dataSource={programs} onChange={onChange} />;
}
