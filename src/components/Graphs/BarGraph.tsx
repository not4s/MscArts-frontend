import React, { SetStateAction, useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Column, ColumnConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { BarGraphInterface, Graph, TargetInterface } from "../../constants/graphs";
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
  }
};

interface BarGraphProps {
  graph: BarGraphInterface
  setTitle: (newTitle: string) => void;
  deleteGraph: () => void;
  editGraph: (x: Graph) => void;
}

const BarGraph: React.FC<BarGraphProps> = ({
  graph,
  setTitle,
  deleteGraph,
  editGraph,
}) => {
  const [config, setConfig] = useState<ColumnConfig>();
  useEffect(() => {
    if (graph.data) {
      let newConfig: any = {
        ...DEFAULT_CONFIG,
        data: graph.data,
        xField: graph.primary,
      };
      if (graph.target && graph.target.length > 1) {
        const annotations: any[] = [];
        const target: TargetInterface[] = graph.target;

        for (let i = 0; i < target.length; i++) {
          const targetAmount = target[i]["target"];

          const tooltip = {
            showTitle: true,
            customItems: (originalItems: any[]) => {
              originalItems.push({
                name: "Target",
                value: targetAmount
              })
              return originalItems;
            }
          }

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
              content: `Target ${targetAmount}`,
            },
            style: {
              lineWidth: 2,
              stroke: "red",
            },
          });
        }
        newConfig = {
          ...newConfig, annotations, onReady: (plot: any) => {
            // console.log(plot);

            // plot.on('tooltip:show', (evt: any) => {
            //   console.log(plot);
            //   console.log(evt);
            //   evt["data"]["items"]
            // })
          }
        };
      }
      setConfig(newConfig);
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
      onCancel() { },
    });
  };

  return (
    <>
      <GraphModal editInput={edit} submitAction={editGraph} isEdit={true} resetEdit={() => setEdit(undefined)} />
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
      { config ? <Column className="our-chart" {...config} /> : <></> }
    </>
  );
};

export default BarGraph;
