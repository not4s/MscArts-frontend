import React, { useEffect, useRef, useState } from "react";
import { APIService } from "../../services/API";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { Table, Switch, Button, Input, Space, message, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import ProgramEditModal from "./ProgramEditModal";

export interface ProgramDataType {
  key: React.Key;
  name: string;
  code: string;
  academic_level: string;
  active: boolean;
  program_type: string;
}

type DataIndex = keyof ProgramDataType;

const { confirm } = Modal;

export default function ProgramPage() {
  const [programs, setPrograms] = useState(undefined);
  const api = new APIService();

  /* Set Reloads */
  const [reload, setReload] = useState(true);

  /* Control Filters */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  /* Control Edit/New Form */
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editInput, setEditInput] = useState<ProgramDataType>();

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
  ): ColumnType<ProgramDataType> => ({
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
    if (reload) {
      api.getPrograms().then((result) => {
        console.log(result.data);

        setPrograms(
          result.data.map((v: any, i: any) => ({
            key: String(i),
            ...v,
          }))
        );
        setReload(false);
      });
    }
  }, [reload]);

  const columns: ColumnsType<ProgramDataType> = [
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
      onFilter: (value: string | number | boolean, record: ProgramDataType) =>
        record.program_type === value,
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
      onFilter: (value: string | number | boolean, record: ProgramDataType) =>
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
      onFilter: (value: string | number | boolean, record: ProgramDataType) =>
        record.active === value,
      render: (_, record: ProgramDataType) => {
        return (
          <Switch
            checked={record.active}
            onChange={() => {
              api
                .programChange(
                  record.code,
                  record.name,
                  record.academic_level,
                  record.program_type,
                  !record.active
                )
                .then(() => {
                  setReload(!reload);
                });
            }}
          />
        );
      },
    },
    {
      title: "Edit/Delete",
      dataIndex: "actions",
      render: (_, record: ProgramDataType) => {
        return (
          <>
            <Space>
              <Button
                onClick={(e) => {
                  setEditInput(record);
                  setOpenEditModal(true);
                }}
              >
                <EditOutlined />
              </Button>
              <Button onClick={(e) => deleteProgram(record.code)}>
                <DeleteOutlined />
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  const onCreate = (values: ProgramDataType) => {
    console.log(values);
    setOpenEditModal(false);
    if (editInput === undefined) {
      // Adding New Program
      api
        .programAdd(
          values.code,
          values.name,
          values.academic_level,
          values.program_type,
          true
        )
        .then((res) => {
          if (res.success) {
            message.success("Added new program");
            setReload(true);
          }
        })
        .catch((err) => {
          message.error(err);
          console.error(err);
        });
    } else {
      // Editing Program
      api
        .programChange(
          values.code,
          values.name,
          values.academic_level,
          values.program_type,
          true
        )
        .then((res) => {
          if (res.success) {
            message.success("Edited program");
            setReload(true);
          }
        })
        .catch((err) => {
          message.error(err);
        });
    }
  };

  const deleteProgram = (code: string) => {
    confirm({
      title: "Are you sure you want to delete program?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        api
          .programDelete(code)
          .then((res) => {
            if (res.success) {
              message.success("Deleted Program");
              setReload(true);
            } else {
              message.error("Failed to delete Program");
            }
          })
          .catch((res) => {
            console.error(res);
            message.error("Failed to delete Program");
          });
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const addNewProgram = () => {
    setEditInput(undefined);
    setOpenEditModal(true);
  };

  return (
    <>
      <Table
        columns={columns}
        loading={reload}
        dataSource={programs}
        pagination={{
          total: 20,
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
        open={openEditModal}
        onCancel={() => {
          setEditInput(undefined);
          setOpenEditModal(false);
        }}
        onCreate={onCreate}
        editInput={editInput}
      />
    </>
  );
}
