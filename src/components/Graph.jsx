import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/charts";
import axios from "axios";

const Graph = () => {
  const [graph, setGraph] = useState({
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

  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get('/api/applicant')
      .then(res => {console.log(res); setData(res.data.map(x => ({...x, value: 1})  ))})
      .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  const config = {
    data: data,
    xField: "gender",
    yField: "value",
    isStack: "true",
    seriesField: "nationality",
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
