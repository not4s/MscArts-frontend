import React, { useState } from "react";
import { Tabs, Alert } from "antd";
import MockGraphGrid from "./MockGraphGrid";

interface Props {
  mockData: any[];
}

const MockVisualisation: React.FC<Props> = ({ mockData }) => {
  const items = [
    {
      label: "Mock Data Visuals",
      key: "0",
      children: <MockGraphGrid mockData={mockData} />,
      closable: false,
    },
  ];

  const [activeKey, setActiveKey] = useState("item-1");

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div>
      <Alert
        description="Operating in Mock Data Mode"
        banner
        closable
        type="warning"
      />
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        items={items}
        hideAdd
      />
    </div>
  );
};

export default MockVisualisation;
