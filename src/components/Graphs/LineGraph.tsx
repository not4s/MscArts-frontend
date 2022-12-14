import { Line, LineConfig } from "@ant-design/charts";
import React, { SetStateAction, useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Column, ColumnConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { Graph, LineGraphInterface, TargetInterface } from "../../constants/graphs";
import { Modal, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GraphModal from "../GraphModal";

interface LineGraphProps {
  graph: LineGraphInterface;
  deleteGraph: () => void;
  setTitle: (newTitle: string) => void;
  editGraph: (x: Graph) => void;
}

const LineGraph: React.FC<LineGraphProps> = ({
  graph,
  deleteGraph,
  setTitle,
  editGraph,
}) => {
  const { confirm } = Modal;

  const config: LineConfig = {
    data: (graph.data as any), 
    xField: "period",
    yField: "count",
    seriesField: "series",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },

    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };

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
      {graph.data === undefined ? <></> : <Line {...config} />}
    </>
  );
};

export default LineGraph;
