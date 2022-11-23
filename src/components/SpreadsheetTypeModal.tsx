import { Button, Modal, Form, Select } from "antd";
import React, { useState } from "react";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: any;
}
const { Option } = Select;

const SpreadsheetTypeModal: React.FC<Props> = (isModalOpen, setIsModalOpen) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Choose the Spreadsheet Type"
        onOk={handleOk}
        okText="Submit"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="spreadsheet-type" rules={[{ required: true }]}>
            <Select
              placeholder="Select Spreadsheet Type"
              style={{ width: 240 }}
              // onChange={(value) => setGraphType(value)}
            >
              <Option value="APPLICANT">Applicant Spreadsheet</Option>
              <Option value="DEPOSIT">Deposit Spreadsheet</Option>
            </Select>
            Are you sure you want to upload this spreadsheet?
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SpreadsheetTypeModal;
