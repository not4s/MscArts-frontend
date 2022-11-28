import React, { SetStateAction, useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Column, ColumnConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { Graph, TargetInterface } from "../../constants/graphs";
import { Modal, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GraphModal from "../GraphModal";

const { confirm } = Modal;

const DEFAULT_CONFIG = {
  data: [],
  xField: "gender",
  yField: "count",
  isStack: true,
  seriesField: "type",
  tooltip: {
    showTitle: true,
  },
};

interface BarGraphProps {
  primary: string;
  data: any[] | undefined;
  title: string;
  setTitle: (newTitle: string) => void;
  deleteGraph: () => void;
  editGraph: (x: Graph) => void;
}

const BarGraph: React.FC<BarGraphProps> = ({
  primary,
  data,
  title,
  setTitle,
  deleteGraph,
  editGraph,
  ...props
}) => {
  const [config, setConfig] = useState<ColumnConfig>(DEFAULT_CONFIG);
  useEffect(() => {
    if (data) {
      let newConfig: ColumnConfig = {
        ...DEFAULT_CONFIG,
        data,
        xField: primary,
      };
      const p: any = props;
      if (p["target"] !== undefined && p["target"].length > 1) {
        const annotations: any[] = [];
        const target: TargetInterface[] = p["target"];

        for (let i = 0; i < target.length; i++) {
          const targetAmount = target[i]["target"];

          annotations.push({
            type: "line",
            start: (xScale: any, yScale: any) => {
              const pos = xScale.scale(target[i]["fee_status"]);
              const offset = 100 / (xScale.values.length * 2) - 2.5;
              return [
                `${pos * 100 - offset}%`,
                `${100 - (targetAmount / yScale.count.max) * 100}%`,
              ];
            },
            end: (xScale: any, yScale: any) => {
              const pos = xScale.scale(target[i]["fee_status"]);
              const offset = 100 / (xScale.values.length * 2) - 2.5;
              return [
                `${pos * 100 + offset}%`,
                `${100 - (targetAmount / yScale.count.max) * 100}%`,
              ];
            },
            text: {
              content: `Target`,
            },
            style: {
              lineWidth: 2,
              stroke: "red",
            },
          });
        }
        newConfig = { ...newConfig, annotations };
      }
      setConfig(newConfig);
    }
  }, [data]);

  const operationItems: MenuProps["items"] = [
    {
      label: "Edit",
      key: `op-1`,
      icon: <EditOutlined />,
      onClick: (e) => {
        // @ts-ignore
        setEdit({ ...props, data: undefined, title, primary, type: "BAR" });
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
      <GraphModal editInput={edit} submitAction={editGraph} isEdit={true} />
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
              <Dropdown menu={{ items: operationItems }}>
                <Button>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </td>
          </tr>
        </table>
      </DraggableHandle>
      <Column className="our-chart" {...config} />
    </>
  );
};

export default BarGraph;
