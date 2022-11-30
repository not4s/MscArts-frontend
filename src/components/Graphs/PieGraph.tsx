import React, { useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Pie, PieConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { Dropdown, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Graph, PieGraphInterface } from "../../constants/graphs";
import GraphModal from "../GraphModal";

const { confirm } = Modal;

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
  graph: PieGraphInterface;
  setTitle: (newTitle: string) => void;
  deleteGraph: () => void;
  editGraph: (newGraph: Graph) => void;
}

const PieGraph: React.FC<PieGraphProps> = ({
  graph,
  setTitle,
  deleteGraph,
  editGraph,
}) => {
  const [config, setConfig] = useState<PieConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (graph.data) {
      setConfig({ ...DEFAULT_CONFIG, data: graph.data });
    }
  }, [graph]);

  const operationItems: MenuProps["items"] = [
    {
      label: "Edit",
      key: `op-1`,
      icon: <EditOutlined />,
      onClick: (e) => {
        setEdit(graph);
      },
    },
    {
      label: "Delete",
      key: `op-2`,
      icon: <DeleteOutlined />,
      onClick: (e) => showDeleteConfirm(),
    },
  ];

  const [edit, setEdit] = useState<Graph | undefined>(undefined);

  const showDeleteConfirm = () => {
    confirm({
      title: "Delete this graph?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteGraph();
      },
      onCancel() {},
    });
  };

  return (
    <>
      <GraphModal editInput={edit} submitAction={editGraph} isEdit={true} resetEdit={() => setEdit(undefined)}/>
      <DraggableHandle className="myDragHandleClassName">
        <table>
          <tr>
            <td className="a" style={{ width: "calc(100%)" }}>
              <EditText
                name="textbox3"
                defaultValue={graph.title}
                inputClassName="bg-success"
                onSave={(e) => setTitle(e.value)}
              />
            </td>
            <td>
              <Dropdown menu={{ items: operationItems }}>
                <Button>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </td>
          </tr>
        </table>
      </DraggableHandle>

      <Pie className="our-chart" {...config} />
    </>
  );
};

export default PieGraph;
