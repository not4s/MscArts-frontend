import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";

export const ApplicantTable = () => {
  const [tableData, setTableData] = useState([]);
  const [nationalities, setNationalities] = useState([]);

  const api = new APIService();

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

  useEffect(() => {
    api.getAllAttributes().then((res) => {
      console.log(res.data["nationality"]);
      setNationalities(res.data["nationality"]);
    });
  }, []);

  interface DataType {
    key: React.Key;
    name: string;
    date: string;
    nationality: string;
    program_code: string;
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
      filters: nationalities.map((nationality) => {
        return { text: nationality, value: nationality };
      }),
      onFilter: (value, record) => record.nationality === value,
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

  return <Table columns={columns} dataSource={tableData} onChange={onChange} />;
};

export default ApplicantTable;
