import { Button, Form, Input, Modal, Select } from "antd";
import { Option } from "antd/lib/mentions";

interface ImportModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
  importLink: (x: string) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  open,
  setOpen,
  importLink,
}) => {
  const onFinish = (values: any) => {
    importLink(values["inputModel"]);
    setOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    setOpen(false);
  };

  return (
    <Modal
      title={"Import Panel"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Graph JSON Model"
          name="inputModel"
          rules={[{ required: true, message: "Please input a course name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportModal;
