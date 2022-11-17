import React, { useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Pie, PieConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { Menu, Dropdown } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const DEFAULT_CONFIG: PieConfig = {
  data: [],
  appendPadding: 10,
  angleField: "value",
  colorField: "type",
  radius: 0.9,
  label: {
    type: "inner",
    // labelHeight: 28,
    offset: "-20%",
    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    style: {
      fontSize: 14,
      textAlign: "center",
    },
  },
  interactions: [
    {
      type: "element-active",
    },
  ],
};

interface PieGraphProps {
  data: any[] | undefined;
  title: string;
  setTitle: (newTitle: string) => void;
}

const PieGraph: React.FC<PieGraphProps> = ({ data, title, setTitle }) => {
  const [config, setConfig] = useState<PieConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({ ...DEFAULT_CONFIG, data });
    }
  }, [data]);

  const operationItems: MenuProps["items"] = [
    {
      label: "Edit",
      key: "op-1",
      icon: <EditOutlined />,
      onClick: (e) => console.log("Okay"),
    },
    {
      label: "Delete",
      key: "op-2",
      icon: <DeleteOutlined />,
      onClick: (e) => console.log("Deleted"),
    },
  ];

  return (
    <>
      <DraggableHandle className="myDragHandleClassName">
        <table>
          <tr>
            <td className="a" style={{ width: "calc(100%)" }}>
              <EditText
                name="textbox3"
                defaultValue={title}
                inputClassName="bg-success"
                onSave={(e) => setTitle(e.value)}
              />
            </td>
            <td>
              <Dropdown menu={{ items: operationItems }}></Dropdown>
            </td>
          </tr>
        </table>
      </DraggableHandle>

      <Pie className="our-chart" {...config} />
    </>
  );
};

export default PieGraph;
