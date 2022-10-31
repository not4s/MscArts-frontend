import React, { useEffect, useRef, useState } from "react";
import { APIService } from "../services/API";
import { ColumnsType, TableProps, ColumnType } from "antd/lib/table";
import { Table, Switch, Button, Input, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import type { FilterConfirmProps, FilterValue } from "antd/lib/table/interface";
import ProgramEditModal from "./ProgramEditModal";
import ProgramDeleteModal from "./ProgramDeleteModal";

interface DataType {
  key: React.Key;
  name: string;
  code: string;
  academic_level: string;
  active: boolean;
  program_type: string;
}

type DataIndex = keyof DataType;

export default function ProgramPage() {
  const [programs, setPrograms] = useState(undefined);
  const api = new APIService();
  const [flag, setFlag] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [editProgramType, setEditProgramType] = useState("");
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editActive, setEditActive] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [addFlag, setAddFlag] = useState(false);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    api.getPrograms().then((result) => {
      console.log(result.data);

      setPrograms(mapToToggle(result.data));
    });
  }, [flag]);

  const mapToToggle = (data: any) => {
    return data.map((obj: any) => {
      const onClick = () => {
        setEditProgramType(obj.program_type);
        setEditName(obj.name);
        setEditCode(obj.code);
        setEditLevel(obj.academic_level);
        setEditActive(obj.active);
        setAddFlag(false);
        setOpenEditModal(true);
      };

      const onDelete = () => {
        setEditCode(obj.code);
        setOpenDeleteModal(true);
      };

      obj.switch = (
        <Switch
          checked={obj.active}
          onChange={() => {
            api
              .programChange(
                obj.code,
                obj.name,
                obj.academic_level,
                obj.program_type,
                !obj.active
              )
              .then(() => {
                // @ts-ignore
                setFlag(!flag);
              });
          }}
        />
      );
      obj.actions = (
        <>
          <Button
            onClick={onClick}
            icon={<EditOutlined />}
            style={{ marginLeft: "2vh", marginRight: "2vh" }}
          />
          <Button
            onClick={onDelete}
            icon={<DeleteOutlined />}
            style={{ marginLeft: "2vh", marginRight: "2vh" }}
          />
        </>
      );
      return obj;
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Program Type",
      dataIndex: "program_type",
      filters: [
        {
          text: "AIML",
          value: "AIML",
        },
        {
          text: "MAI",
          value: "MAI",
        },
        {
          text: "MAC",
          value: "MAC",
        },
        {
          text: "MCS",
          value: "MCS",
        },
        {
          text: "MCSS",
          value: "MCSS",
        },
      ],
      filterMode: "tree",
      // @ts-ignore
      onFilter: (value: string, record: DataType) =>
        record.program_type === value,
    },
    {
      title: "Code",
      dataIndex: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Academic Level",
      dataIndex: "academic_level",
      filters: [
        {
          text: "PGR",
          value: "IC Application - PGR",
        },
        {
          text: "PGT",
          value: "IC Application - PGT",
        },
        {
          text: "Short Course",
          value: "IC Application - Short Course",
        },
      ],
      filterMode: "tree",
      // @ts-ignore
      onFilter: (value: string, record: DataType) =>
        record.academic_level === value,
    },
    {
      title: "Tracking Status",
      dataIndex: "switch",
      filters: [
        {
          text: "active",
          value: true,
        },
        {
          text: "inactive",
          value: false,
        },
      ],
      filterMode: "tree",
      // @ts-ignore
      onFilter: (value: boolean, record: DataType) => record.active === value,
    },
    {
      title: "Edit/Delete",
      dataIndex: "actions",
    },
  ];

  const addNewProgram = () => {
    setEditActive(true);
    setEditProgramType("");
    setEditName("");
    setEditLevel("");
    setEditCode("");
    setAddFlag(true);
    setOpenEditModal(true);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={programs}
        pagination={{
          total: 25,
          showTotal: (total) => {
            return (
              <Button icon={<PlusOutlined />} onClick={addNewProgram}>
                New Program
              </Button>
            );
          },
        }}
      />
      <ProgramEditModal
        programType={editProgramType}
        name={editName}
        code={editCode}
        level={editLevel}
        open={openEditModal}
        active={editActive}
        add={addFlag}
        setOpen={setOpenEditModal}
      />
      <ProgramDeleteModal
        code={editCode}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
}
