import {
  Radio,
  Input,
  Table,
  RadioChangeEvent,
  Button,
  Cascader,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";
import userEvent from "@testing-library/user-event";

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

const UserAccessSettings = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  const api = new APIService();
  const columns = [
    {
      title: "ShortCode",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Access Level",
      dataIndex: "radio-field",
      key: "access",
    },
  ];

  const options: Option[] = [
    {
      value: 0,
      label: "No Access",
    },
    {
      value: 1,
      label: "Read Access",
    },
    {
      value: 2,
      label: "Write Access",
    },
    {
      value: 3,
      label: "Admin",
    },
  ];

  useEffect(() => {
    api.getUserAccess().then((result) => {
      console.log(result.data);
      setData(result.data);

      result.data.map((user: any, index: number) => {
        user["radio-field"] = (
          <Select
            options={options}
            defaultValue={user["access"]}
            onSelect={(value: number) => {
              api
                .updateAccessLevel(user["username"], value)
                .then(() => {
                  updateAccess(value, index);
                  return true;
                })
                .catch(() => false);
            }}
          />
        );
      });
    });
  }, []);

  const updateAccess = (value: number, index: number) => {
    const temp = [...data];
    console.log(temp);
    temp[index]["access"] = value;
    setData(temp);
  };

  return (
    <>
      <Table dataSource={data} columns={columns} />
    </>
  );
};

export default UserAccessSettings;
