import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import moment from "moment";
import React from "react";

export const SpreadsheetTable = () => {
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
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
  ];

  const data = [
    {
      key: "1",
      name: "Excel 1",
      date: "05/09/2019",
    },
    {
      key: "2",
      name: "Excel 2",
      date: "04/09/2019",
    },
    {
      key: "3",
      name: "Excel 3",
      date: "03/09/2019",
    },
    {
      key: "4",
      name: "Excel 4",
      date: "02/09/2019",
    },
    {
      key: "5",
      name: "Excel 5",
      date: "01/09/2019",
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return <Table columns={columns} dataSource={data} onChange={onChange} />;
};
