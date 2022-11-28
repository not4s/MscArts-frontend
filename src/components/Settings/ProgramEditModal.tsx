import React from "react";
import { Form, Input, Modal, Select } from "antd";
import { Option } from "antd/lib/mentions";
import { ProgramDataType } from "./ProgramSettings";

interface ProgramModalProps {
  open: boolean;
  onCreate: (values: ProgramDataType) => void;
  onCancel: () => void;
  editInput: ProgramDataType | undefined;
}

const ProgramEditModal: React.FC<ProgramModalProps> = ({
  open,
  onCreate,
  onCancel,
  editInput,
}) => {
  const PROGRAM_TYPES = ["AIML", "MAI", "MAC", "MCS", "MCSS"];
  const [form] = Form.useForm<ProgramDataType>();

  React.useEffect(() => {
    if (editInput !== undefined) {
      form.setFieldsValue(editInput);
    } else {
      form.resetFields();
    }
  }, [editInput]);

  return (
    <Modal
      title={editInput === undefined ? "Add New Program" : "Edit Program"}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validation failed: ", info);
          });
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="ProgramType"
          name="program_type"
          rules={[{ required: true }]}
        >
          <Select>
            {PROGRAM_TYPES.map((value: string, index: number) => {
              return <Option key={`${index}`} value={value}></Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input a course name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input a code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Level"
          name="academic_level"
          rules={[{ required: true, message: "Please input a level" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProgramEditModal;
