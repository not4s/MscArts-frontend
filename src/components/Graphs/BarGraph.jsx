import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../../services/API";
import { GraphInterface } from "../../constants/graphs";

const DEFAULT_CONFIG = {
  data: [],
  xField: "gender",
  yField: "count",
  isStack: true,
  seriesField: 'type'
}

const BarGraph = ({ programType, graphType, data, title }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({...DEFAULT_CONFIG, data, xField: graphType})
    }
  }, [data])

    // annotations: [
    //   {
    //     type: 'line',
    //     id: 'line',
    //     start: ['0%', '50%'], // [StartX, StartY]
    //     end: ['33%', '50%'], // [EndX, EndY]
    //     text: {
    //       content: 'Target',
    //       position: 'right',
    //       offsetY: 18,
    //       style: {
    //         textAlign: 'right',
    //       },
    //     },
    //     style: {
    //       lineWidth: 2,
    //       // lineDash: [4, 4],
    //       fill: '#000000'
    //     },
    //   },
    //   {
    //     type: 'line',
    //     id: 'line',
    //     start: ['33%', '40%'], // [StartX, StartY]
    //     end: ['66%', '40%'], // [EndX, EndY]
    //     text: {
    //       content: 'Target',
    //       position: 'right',
    //       offsetY: 18,
    //       style: {
    //         textAlign: 'right',
    //       },
    //     },
    //     style: {
    //       lineWidth: 2,
    //       // lineDash: [4, 4],
    //       fill: '#000000'
    //     },
    //   },
    //   {
    //     type: 'line',
    //     id: 'line',
    //     start: ['66%', '20%'], // [StartX, StartY]
    //     end: ['100%', '20%'], // [EndX, EndY]
    //     text: {
    //       content: 'Target',
    //       position: 'right',
    //       offsetY: 18,
    //       style: {
    //         textAlign: 'right',
    //       },
    //     },
    //     style: {
    //       lineWidth: 2,
    //       // lineDash: [4, 4],
    //       fill: '#000000'
    //     },
    //   },
    // ],
    //  configs[preset ? preset : 0]

  return (
    <div style={{
      padding: "10px",
      margin: "10px",
      border: "solid",
      borderWidth: "1px",
      borderColor: "rgba(220,220,220,0.9)",
      }}>
      <h1>{ `${title} Graph` }</h1>
      <Column {...config} />
    </div>
  );
};

export default BarGraph;
