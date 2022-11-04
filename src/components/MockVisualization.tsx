import React, { useState, useRef, useEffect } from "react";
import { Tabs, Modal, Input, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import GraphGrid from "./GraphGrid";
import Cookies from "universal-cookie";
import CreateGraph from "./CreateGraph";

interface Props {
  mockData: any[];
}

const MockVisualisation: React.FC<Props> = ({ mockData }) => {
  const items = [
    { label: "Mock Data Visuals", key: "0", children: <GraphGrid /> },
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
      />
    </div>
  );
};

export default MockVisualisation;
