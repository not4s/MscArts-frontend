import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputRef,
  Layout,
  List,
  message,
  Row,
  Space,
  Table,
} from "antd";
import { ColumnsType, ColumnType, TableProps } from "antd/lib/table";
import { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { APIService } from "../../services/API";

const { Panel } = Collapse;

interface DataType {
  key: React.Key;
  erpid: number;
  first_name: string;
  last_name: string;
  date: string;
  gender: string;
  prefix: string;
  combined_fee_status: string;
  admissions_cycle: number;
  nationality: string;
  program_code: string;
}

type DataIndex = keyof DataType;

const { Content } = Layout;

export const ApplicantTable = () => {
  const api = new APIService();

  /* Table Control */
  const [reload, setReload] = useState<boolean>(true);
  const [tableData, setTableData] = useState([]);

  /* Table Filters */
  const [nationalities, setNationalities] = useState([]);
  const [program_codes, setProgramCodes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [fee_status, setFeeStatus] = useState([]);
  const [admissions_cycle, setAdmissionsCycle] = useState([]);

  /* Table Search Filters */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = React.useRef<InputRef>(null);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [activeCandidate, setActiveCandidate] = useState<any>();

  /* Drawer Control */
  const [comments, setComments] = useState<any>();

  /* Comment Control */
  const [form] = Form.useForm();
  const [reloadComment, setReloadComment] = useState<boolean>();

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
    if (activeCandidate !== undefined || reloadComment) {
      api
        .getComments(activeCandidate?.erpid)
        .then((res) => {
          console.log(res.data);
          setComments(res.data);
          setReloadComment(false);
        })
        .catch((err) => console.error(err));
    }
  }, [activeCandidate, reloadComment]);

  useEffect(() => {
    if (reload) {
      api
        .getAllApplicants()
        .then((res) => {
          setTableData(res.data);

          const nationalities: any = [
            ...new Set(res.data.map((v: any) => v["nationality"])),
          ];
          setNationalities(nationalities);

          const gender: any = [
            ...new Set(res.data.map((v: any) => v["gender"])),
          ];
          setGenders(gender);

          const program_code: any = [
            ...new Set(res.data.map((v: any) => v["program_code"])),
          ];
          setProgramCodes(program_code);

          const fee_status: any = [
            ...new Set(res.data.map((v: any) => v["combined_fee_status"])),
          ];
          setFeeStatus(fee_status);

          const admissions_cycle: any = [
            ...new Set(res.data.map((v: any) => v["admissions_cycle"])),
          ];

          setAdmissionsCycle(admissions_cycle);

          setReload(false);
        })
        .catch((err) => console.log(err));
    }
  }, [reload]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Erp ID",
      dataIndex: "erpid",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.erpid - b.erpid,
      ...getColumnSearchProps("erpid"),
    },
    {
      title: "Admission Cycle",
      dataIndex: "admissions_cycle",
      filters: admissions_cycle.map((code) => ({ text: code, value: code })),
      filterSearch: true,
      onFilter: (value, record) => record.admissions_cycle === value,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      ...getColumnSearchProps("first_name"),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      ...getColumnSearchProps("last_name"),
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
      filters: fee_status.map((code) => {
        return { text: code, value: code };
      }),
      onFilter: (value, record) => record.combined_fee_status === value,
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

  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  const onFormFinish = (values: any) => {
    if (values["comment"].length <= 0) {
      return;
    }
    console.log(values);
    form.resetFields();
    api
      .postComment(activeCandidate?.erpid, values["comment"])
      .then((res) => {
        setReloadComment(true);
        message.success("Added Comments");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Layout>
        <Content
          className="site-layout-content"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Table
            columns={columns}
            dataSource={tableData}
            onChange={onChange}
            loading={reload}
            onRow={(record: DataType, index) => {
              return {
                onClick: (e) => {
                  setActiveCandidate(record as any);
                  setDrawerOpen(true);
                },
              };
            }}
            scroll={{ y: "calc(90vh - 4em)" }}
          />
        </Content>
      </Layout>
      <Drawer
        width={640}
        open={drawerOpen}
        closable={false}
        onClose={onDrawerClose}
      >
        <Descriptions size="small" title="Status" bordered>
          <Descriptions.Item label="Proposed Decision" span={3}>
            {activeCandidate?.proposed_decision}
          </Descriptions.Item>
          <Descriptions.Item label="Decision" span={3}>
            {activeCandidate?.decision_status}
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        <Descriptions size="small" title="Personal Details" bordered>
          <Descriptions.Item label="Erp ID" span={3}>
            {activeCandidate?.erpid}
          </Descriptions.Item>
          <Descriptions.Item label="First Name" span={3}>
            {activeCandidate?.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name" span={3}>
            {activeCandidate?.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {activeCandidate?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Nationality" span={3}>
            {activeCandidate?.nationality}
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        <Collapse>
          <Panel key="1" header="Comments">
            <List
              bordered
              loading={reloadComment}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item: any) => (
                <List.Item>
                  Comment: {item["comment"]}
                  <br></br>
                  TS: {item["timestamp"]}
                  <br></br>
                  User: {item["username"]}
                </List.Item>
              )}
            />
            <Divider />

            <Form onFinish={onFormFinish} form={form}>
              <Form.Item
                name="comment"
                rules={[
                  {
                    message: "Additional Comments",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Additional Comments" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </Drawer>
    </>
  );
};

export default ApplicantTable;
