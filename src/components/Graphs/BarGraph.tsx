import React, { SetStateAction, useEffect, useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { Column, ColumnConfig } from "@ant-design/charts";
import { DraggableHandle } from "./styles";
import { TargetInterface } from "../../constants/graphs";

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
  graphType: string;
  data: any[] | undefined;
  title: string;
  setTitle: (newTitle: string) => void;
}

const BarGraph: React.FC<BarGraphProps> = ({
  graphType,
  data,
  title,
  setTitle,
  ...props
}) => {
  const [config, setConfig] = useState<ColumnConfig>(DEFAULT_CONFIG);
  useEffect(() => {
    if (data) {
      let newConfig: ColumnConfig = {
        ...DEFAULT_CONFIG,
        data,
        xField: graphType,
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

  return (
    <>
      <DraggableHandle className="myDragHandleClassName">
        <EditText
          name="textbox3"
          defaultValue={title}
          inputClassName="bg-success"
          onSave={(e) => setTitle(e.value)}
        />
      </DraggableHandle>
      <Column className="our-chart" {...config} />
    </>
  );
};

export default BarGraph;
