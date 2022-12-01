import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";
import { useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  id: string;
  title: string;
}

const { Content } = Layout;
const { confirm } = Modal;

const TemplateSettings = () => {
  const api = new APIService();
  const navigate = useNavigate();
  const [form] = Form.useForm<{ uid: string; title: string }>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(true);

  const [data, setData] = useState<DataType[]>([]);
  const [editInput, setEditInput] = useState<DataType>();

  useEffect(() => {
    if (reload) {
      api
        .getDefaultTabs()
        .then((res) => {
          setData(
            res.data.map((v: any, index: any) => {
              return {
                key: String(index),
                ...v,
              };
            })
          );
          setReload(false);
        })
        .catch((res) => {
          console.error(res);
          setReload(false);
        });
    }
  }, [reload]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Template UID",
      dataIndex: "id",
      key: "id",
      width: "30%",
    },
    {
      title: "Template Title",
      dataIndex: "title",
      key: "title",
      width: "50%",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record: DataType) => {
        return (
          <Space size="small">
            <Button
              onClick={(e) => {
                setEditInput(record);
                setModalOpen(true);
              }}
            >
              <EditOutlined />
            </Button>
            <Button onClick={(e) => deleteTemplate(record.id)}>
              <DeleteOutlined />
            </Button>
            <Tooltip title="View Template">
              <Button onClick={(e) => navigate(`/visuals/${record.id}`)}>
                <LinkOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const deleteTemplate = (uid: string) => {
    confirm({
      title: "Are you sure you want to delete default template?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        api
          .deleteDefaultTab(uid)
          .then((res) => {
            if (res.success) {
              message.success("Deleted Default Template");
              setReload(true);
            } else {
              message.error("Failed to delete default template");
            }
          })
          .catch((res) => {
            console.error(res);
            message.error("Failed to delete default template");
          });
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const createDefault = (values: any) => {
    setModalOpen(false);

    if (editInput === undefined) {
      api
        .addDefaultTabs(values.uid, values.title)
        .then((res) => {
          if (res.success) {
            message.success("Added new default template");
            setReload(!reload);
          } else {
            message.error("Failed to add new default template");
          }
        })
        .catch((res) => {
          console.error(res);
          message.error("Failed to add new default template");
        });
    } else {
      api
        .editDefaultTab(values.uid, values.title)
        .then((res) => {
          if (res.success) {
            message.success("Edited default template");
            setReload(!reload);
          } else {
            message.error("Failed to edit template");
          }
        })
        .catch((res) => {
          console.error(res);
          message.error("Failed to edit template");
        });
      setEditInput(undefined);
    }
  };

  React.useEffect(() => {
    if (editInput !== undefined) {
      form.setFieldsValue({ uid: editInput.id, title: editInput.title });
    }
  }, [editInput]);

  const handleCancel = () => {
    form.resetFields();
    setEditInput(undefined);
    setModalOpen(false);
  };

  return (
    <>
      <Modal
        title={`${editInput ? "Edit" : "Add"} new Default Template`}
        open={isModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              console.log(values);
              createDefault(values);
            })
            .catch((info) => {
              console.log("Validation Fail:", info);
            });
        }}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="uid" label="Template UID">
            <Input disabled={editInput !== undefined} />
          </Form.Item>
          <Form.Item name="title" label="Template Title">
            <Input />
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
          <Row>
            <Col span={4}>
              <Typography.Title level={3}>Template Settings</Typography.Title>
            </Col>
            <Col
              xl={{ span: 1, offset: 17 }}
              lg={{ span: 1, offset: 16 }}
              md={{ span: 1, offset: 15 }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  setEditInput(undefined);
                  setModalOpen(true);
                }}
              >
                Default Template
              </Button>
            </Col>
          </Row>
          <Table columns={columns} dataSource={data} loading={reload} />
        </Content>
      </Layout>
    </>
  );
};

export default TemplateSettings;
