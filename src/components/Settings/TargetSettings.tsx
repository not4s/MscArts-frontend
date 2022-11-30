import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  List,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Progress,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";

interface DataType {
  program_type: string;
  fee_status: string;
  year: number;
  target: number;
  progress?: number;
}

const { Content } = Layout;
const { confirm } = Modal;

const PROGRAMS = ["AIML", "MAI", "MAC", "MCS", "MCSS"];

const TargetSettings = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<DataType>();

  const [reload, setReload] = useState<boolean>(true);
  const [targets, setTargets] = useState<DataType[]>([]);
  const [editInput, setEditInput] = useState<DataType>();
  const [activeYear, setActiveYear] = useState<number>(0);

  const api = new APIService();

  useEffect(() => {
    if (reload) {
      api.getTargets().then((res) => {
        console.log(res.data);
        setTargets(res.data);
        setReload(false);
      });
    }
  }, [reload]);

  const handleCancel = () => {
    form.resetFields();
    setEditInput(undefined);
    setModalOpen(false);
  };

  const handleOk = (values: DataType) => {
    setModalOpen(false);

    const { program_type, fee_status, target, year } = values;

    if (editInput === undefined) {
      api
        .postTarget(program_type, year, fee_status, target)
        .then((res) => {
          if (res.success) {
            message.success("Added new target");
            setReload(true);
          }
        })
        .catch((err) => {
          message.error(err);
        });
    } else {
      api
        .putTarget(program_type, year, fee_status, target)
        .then((res) => {
          console.log(res);
          if (res.success) {
            message.success("Successfully edited target");
            setReload(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteTarget = (target: DataType) => {
    confirm({
      title: "Are you sure you want to delete this target?",
      icon: <ExclamationOutlined />,
      content: "This cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const { program_type, year, fee_status } = target;
        api
          .deleteTarget(program_type, fee_status, year)
          .then((res) => {
            if (res.success) {
              message.success("Deleted Target");
              setReload(true);
            } else {
              message.error("Failed to delete target");
            }
          })
          .catch((res) => {
            console.error(res);
            message.error("Failed to delete target");
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (editInput !== undefined) {
      form.setFieldsValue(editInput);
      setModalOpen(true);
    }
  }, [editInput]);

  return (
    <>
      <Modal
        title={`${editInput ? "Edit" : "Add"} Target`}
        open={isModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              console.log(values);
              handleOk(values);
            })
            .catch((info) => {
              console.log("Validation Fail:", info);
            });
        }}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item
            name="program_type"
            label="Course"
            rules={[{ required: true }]}
          >
            <Select placeholder="Course" disabled={editInput !== undefined}>
              {PROGRAMS.map((program) => {
                return <Select.Option value={program}>{program}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="year"
            label="Admission Cycle"
            rules={[{ required: true }]}
          >
            <Select placeholder="Year" disabled={editInput !== undefined}>
              <Select.Option value={2023}>2023</Select.Option>
              <Select.Option value={2022}>21/22</Select.Option>
              <Select.Option value={2021}>20/21</Select.Option>
              <Select.Option value={2020}>19/20</Select.Option>
              <Select.Option value={2019}>18/19</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fee_status"
            label="Fee Status"
            rules={[{ required: true }]}
          >
            <Select placeholder="Fee Status" disabled={editInput !== undefined}>
              <Select.Option value="Overseas">Overseas</Select.Option>
              <Select.Option value="Home">Home</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="target" label="Target" rules={[{ required: true }]}>
            <Input placeholder="Target" />
          </Form.Item>
        </Form>
      </Modal>
      <Layout>
        <Layout>
          <Content
            className="site-layout-content"
            style={{
              padding: 24,
              margin: 24,
              minHeight: 100,
              background: "#fff",
            }}
          >
            Main Statistics
          </Content>
        </Layout>
        <Layout>
          <Content
            className="site-layout-content"
            style={{
              padding: 24,
              marginTop: 10,
              margin: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <List
              header={
                <>
                  <Space>
                    <Button onClick={(e) => setModalOpen(true)}>
                      New Target
                    </Button>
                    <Select
                      style={{ width: 120 }}
                      defaultValue={0}
                      value={activeYear}
                      onChange={(e) => setActiveYear(e)}
                    >
                      <Select.Option value={0}>All</Select.Option>
                      <Select.Option value={2023}>2023</Select.Option>
                      <Select.Option value={2022}>2022</Select.Option>
                      <Select.Option value={2021}>2021</Select.Option>
                      <Select.Option value={2020}>2020</Select.Option>
                      <Select.Option value={2019}>2019</Select.Option>
                    </Select>
                  </Space>
                </>
              }
              dataSource={targets.filter(
                (target: DataType) =>
                  activeYear === 0 || target.year === activeYear
              )}
              renderItem={(target: DataType) => (
                <List.Item
                  actions={[
                    <Button onClick={(e) => setEditInput(target)}>
                      <EditOutlined />
                    </Button>,
                    <Button onClick={(e) => deleteTarget(target)}>
                      <DeleteOutlined />
                    </Button>,
                  ]}
                >
                  <Col>
                    <List.Item.Meta
                      title={<p>{target.program_type}</p>}
                      description={target.fee_status}
                    />
                  </Col>
                  <Col span={12}>
                    <Progress percent={50} showInfo={true} />
                  </Col>
                </List.Item>
              )}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default TargetSettings;
