import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";

export const ApplicantTable = () => {
  const [tableData, setTableData] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [program_codes, setProgramCodes] = useState([]);
  const [genders, setGenders] = useState([]);

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

  useEffect(() => {
    api.getAllAttributes().then((res) => {
      console.log(res.data["program_code"]);
      setProgramCodes(res.data["program_code"]);
    });
  }, []);

  useEffect(() => {
    api.getAllAttributes().then((res) => {
      console.log(res.data["gender"]);
      setGenders(res.data["gender"]);
    });
  }, []);

  interface DataType {
    key: React.Key;
    name: string;
    date: string;
    gender: string;
    prefix: string;
    fee_status: string;
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
      filters: genders.map((code) => {
        return { text: code, value: code };
      }),
      filterSearch: true,
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Prefix",
      dataIndex: "prefix",
    },
    {
      title: "Program",
      dataIndex: "program_code",
      filters: program_codes.map((code) => {
        return { text: code, value: code };
      }),
      filterSearch: true,
      onFilter: (value, record) => record.program_code === value,
    },
    {
      title: "Fee Status",
      dataIndex: "combined_fee_status",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      filters: nationalities.map((nationality) => {
        return { text: nationality, value: nationality };
      }),
      filterSearch: true,
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

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      onChange={onChange}
      scroll={{ y: "calc(90vh - 4em)" }}
    />
  );
};

export default ApplicantTable;
