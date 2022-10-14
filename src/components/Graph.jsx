import React, { useState } from "react";
import { Column } from "@ant-design/charts";

const Graph = () => {
  const [graphs, setGraphs] = useState({
    tid: 1,
    graphs: [
      {
        type: "BAR",
        x_val: "status",
        y_type: "count",
        data: [
          { year: "home", value: 1, type: "cleared" },
          { year: "away", value: 1, type: "paid" },
          { year: "away", value: 1, type: "paid" },
          { year: "home", value: 1, type: "cleared" },
          { year: "away", value: 1, type: "paid" },
          { year: "away", value: 1, type: "paid" },
          { year: "home", value: 1, type: "paid" },
          { year: "home", value: 1, type: "accepted" },
          { year: "home", value: 1, type: "cleared" },
        ],
        pos: 0,
      },
      { type: "BAR", x_val: "status", y_type: "count", data: [], pos: 1 },
    ],
  });

  const config = {
    data: graphs.graphs[0].data,
    isStack: true,
    xField: "year",
    yField: "value",
    seriesField: "type",
    annotations: [
      {
        type: 'line',
        id: 'line',
        start: ['0%', '66%'], // [StartX, StartY]
        end: ['50%', '66%'], // [EndX, EndY]
        text: {
          content: 'Target',
          position: 'right',
          offsetY: 18,
          style: {
            textAlign: 'right',
          },
        },
        style: {
          lineWidth: 2,
          // lineDash: [4, 4],
          fill: '#000000'
        },
      },
      {
        type: 'line',
        id: 'line',
        start: ['50%', '20%'], // [StartX, StartY]
        end: ['100%', '20%'], // [EndX, EndY]
        text: {
          content: 'Target',
          position: 'right',
          offsetY: 18,
          style: {
            textAlign: 'right',
          },
        },
        style: {
          lineWidth: 2,
          // lineDash: [4, 4],
          fill: '#000000'
        },
      },
    ],
  };

  return <Column {...config} />;
};

export default Graph;
