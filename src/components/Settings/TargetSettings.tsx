import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  PlusOutlined,
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

  /* Year Attributes */
  const [year, setYear] = useState<number[]>();

  const api = new APIService();

  useEffect(() => {
    api.getAllAttributes().then((res) => setYear(res.data["admissions_cycle"]));
  }, []);

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
              {year?.map((year, index) => (
                <Select.Option key={`${year}-${index}`} value={year}>
                  {year}
                </Select.Option>
              ))}
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
        <Content
          className="site-layout-content"
          style={{
            padding: 24,
            marginTop: 10,
            margin: 24,
            minHeight: 100,
            background: "#fff",
          }}
        >
          <List
            header={
              <>
                <Row>
                  <Col span={4}>
                    <Select
                      style={{ width: "100%" }}
                      defaultValue={0}
                      value={activeYear}
                      onChange={(e) => setActiveYear(e)}
                    >
                      <Select.Option value={0}>All</Select.Option>
                      {year?.map((year, index) => (
                        <Select.Option key={`${year}-${index}`} value={year}>
                          {year}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    xl={{ span: 1, offset: 18 }}
                    lg={{ span: 1, offset: 17 }}
                    md={{ span: 1, offset: 16 }}
                  >
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={(e) => setModalOpen(true)}
                    >
                      Target
                    </Button>
                  </Col>
                </Row>
              </>
            }
            dataSource={targets.filter((target: DataType) => {
              return activeYear === 0 || Number(target.year) === activeYear;
            })}
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
                <List.Item.Meta
                  title={
                    <p>
                      {target.program_type} ({target.year})
                    </p>
                  }
                  description={target.fee_status}
                />
                <div style={{ width: "70%" }}>
                  {target.progress ? (
                    <div style={{ width: "100%" }}>
                      <span>
                        {target.progress} / {target.target}
                      </span>
                      <Progress
                        percent={Math.round(
                          (100 * target.progress) / target.target
                        )}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </>
  );
};

export default TargetSettings;
