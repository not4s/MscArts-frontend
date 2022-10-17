import React, { useState } from "react";
import {
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Select, Tag } from "antd";
import type { MenuProps } from "antd";
import FormItem from "antd/es/form/FormItem";

const { Option } = Select;

const CreateGraph = ({}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [graphType, setGraphType] = useState("");
  const [form] = Form.useForm();

  const createBarChart = () => {
    console.log("Creating bar chart");
  };

  const handleOk = () => {
    form.submit();
    if (!Object.values(form.getFieldsValue()).includes(undefined)) {
      setModalOpen(false);
      var type = form.getFieldValue("Visulisation");
      switch (type) {
        case "BAR":
          createBarChart();
        default:
      }
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setGraphType("");
  };

  return (
    <>
      <Modal
        title="Create a new visulisation"
        open={isModalOpen}
        onOk={handleOk}
        okText="Submit"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="Visulisation" rules={[{ required: true }]}>
            <Select
              placeholder="Select visulisation type"
              style={{ width: 240 }}
              onChange={(value: string) => setGraphType(value)}
            >
              <Option value="BAR">
                <BarChartOutlined /> Bar Chart
              </Option>
              <Option value="PIE">
                <PieChartOutlined /> Pie Chart
              </Option>
              <Option value="TABLE">
                <TableOutlined /> Table{" "}
              </Option>
            </Select>
          </Form.Item>

          {graphType === "BAR" ? (
            <>
              {/* ---------------------------------------- */}

              <Form.Item
                name="Columns"
                rules={[{ required: true }]}
                extra="E.g. 'Gender' will create columns for 'Male' and 'Female' respectfully"
              >
                <Select
                  placeholder="Select columns"
                  style={{ width: 240 }}
                  // onChange={(value: string) => setGraphType(value)}
                >
                  <Option value="GENDER">Gender</Option>
                  <Option value="COURSE">Course</Option>
                  <Option value="FEE_STATUS">Fee Status</Option>
                </Select>
              </Form.Item>

              {/* ---------------------------------------- */}

              <Form.Item
                name="Grouping"
                rules={[{ required: false }]}
                extra="E.g. 'Gender' will display the difference between 'Male' and 'Female' within a single column"
              >
                <Select
                  placeholder="Select grouping (optional)"
                  style={{ width: 240 }}
                  // onChange={(value: string) => setGraphType(value)}
                >
                  <Option value="GENDER">Gender</Option>
                  <Option value="COURSE">Course</Option>
                  <Option value="FEE_STATUS">Fee Status</Option>
                </Select>
              </Form.Item>

              {/* ---------------------------------------- */}
            </>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
      <Button type="dashed" onClick={() => setModalOpen(true)}>
        <PlusOutlined />
      </Button>
    </>
  );
};

export default CreateGraph;
