import { Button, Form, Input, Modal } from "antd";
import { APIService } from "../services/API";

export default function ProgramEditModal(props: any) {
  const api = new APIService();
  const onFinish = (values: any) => {
    props.add
      ? api
          .programAdd(values.Code, values.Name, values.Level, props.active)
          .then(props.setOpen(false))
      : api
          .programChange(values.Code, values.Name, values.Level, props.active)
          .then(props.setOpen(false));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      title="Basic Modal"
      open={props.open}
      onCancel={() => props.setOpen(false)}
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
          label="Name"
          name="Name"
          initialValue={props.name}
          rules={[{ required: true, message: "Please input a course name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Code"
          name="Code"
          initialValue={props.code}
          rules={[{ required: true, message: "Please input a code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Level"
          name="Level"
          initialValue={props.level}
          rules={[{ required: true, message: "Please input a level" }]}
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
}
