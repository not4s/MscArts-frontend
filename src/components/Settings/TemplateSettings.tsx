import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";
import { useNavigate } from "react-router-dom";

interface DataType {
  id: string;
  title: string;
}

const { confirm } = Modal;

const TemplateSettings = () => {
  const api = new APIService();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [UID, setUID] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [reload, setReload] = useState<boolean>(false);

  const [data, setData] = useState<DataType[]>([]);

  const [editInput, setEditInput] = useState<DataType>();

  useEffect(() => {
    api
      .getDefaultTabs()
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((res) => {
        console.error(res);
      });
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
            <Button onClick={(e) => setEditInput(record)}>
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

  React.useEffect(() => {
    if (editInput !== undefined) {
      setUID(editInput.id);
      setTitle(editInput.title);
      setModalOpen(true);
    } else {
      setTitle("");
      setUID("");
      setModalOpen(false);
    }
  }, [editInput]);

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
              setReload(!reload);
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

  const handleOk = () => {
    setModalOpen(false);

    if (editInput === undefined) {
      api
        .addDefaultTabs(UID, title)
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
        .editDefaultTab(UID, title)
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

  const handleCancel = () => {
    console.log("Canceling");
    form.resetFields();
    if (editInput !== undefined) {
      setEditInput(undefined);
    } else {
      setTitle("");
      setUID("");
      setModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        title={`${editInput ? "Edit" : "Add"} new Default Template`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="uid" label="Template UID" initialValue={UID}>
            <Input
              defaultValue={UID}
              value={UID}
              onChange={(e) => setUID(e.target.value)}
              disabled={editInput !== undefined}
            />
          </Form.Item>
          <Form.Item name="title" label="Template Title" initialValue={title}>
            <Input
              defaultValue={title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          total: 1,
          showTotal: (total) => {
            return (
              <Button
                icon={<PlusOutlined />}
                onClick={(e) => setModalOpen(true)}
              >
                New Default Template
              </Button>
            );
          },
        }}
      />
    </>
  );
};

export default TemplateSettings;
