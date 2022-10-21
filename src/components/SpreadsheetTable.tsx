import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { APIService } from "../services/API";

export const SpreadsheetTable = () => {
  const [tableData, setTableData] = useState([]);

  const api = new APIService();

  useEffect(() => {}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      api
        .getAllApplicants()
        .then((res) => {
          console.log(res.data);
          setTableData(res.data);
        })
        .catch((err) => console.log(err));
      console.log("poll");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  interface DataType {
    key: React.Key;
    name: string;
    date: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "first_name",
    },
    {
      title: "Surname",
      dataIndex: "last_name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Prefix",
      dataIndex: "prefix",
    },
    {
      title: "Program",
      dataIndex: "program_code",
    },
    {
      title: "Fee Status",
      dataIndex: "fee_status",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
    },

    // {
    // title: "Date",
    // dataIndex: "date",
    // sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    // },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", filters, sorter, extra);
  };

  return <Table columns={columns} dataSource={tableData} onChange={onChange} />;
};

export default SpreadsheetTable;
