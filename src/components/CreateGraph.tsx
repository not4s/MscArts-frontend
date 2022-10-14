import React, { useState } from "react";
import {
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Select } from "antd";
import type { MenuProps } from "antd";

const { Option } = Select;

const CreateGraph = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOk = () => {
    setModalOpen(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Modal
        title="Create a new visulisation"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
      >
        <Select
          placeholder="Select visulisation type"
          style={{ width: 240 }}
          onChange={handleChange}
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
      </Modal>
      <Button type="dashed" onClick={() => setModalOpen(true)}>
        <PlusOutlined />
      </Button>
    </>
  );
};

export default CreateGraph;
