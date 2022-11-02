import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../services/API";

const Graph = ({ preset=0 }) => {
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
    const api = new APIService()

    if (configs[preset].fetchParams) {
      api.getApplicant(configs[preset].fetchParams)
        .then(res => { 
          setData(res.data)
        });
    }
    
    // if (configs[preset].stackOn) {
    //   api.getApplicantDataStacked(configs[preset].xField, configs[preset].stackOn)
    //     .then(res => { console.log(res.data); setData(res.data) } )
    // } else {
    //   api.getApplicantData(configs[preset].xField)
    //     .then(res => { console.log(res.data); setData(res.data) } )
    // }


  }, [])

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  const configs = [
    {
      data,
      xField: "gender",
      yField: "count",
      isStack: true,
      seriesField: 'type',
      fetchParams: {
        count: "gender",
        program_type: "MAC"
      }, 
    },
    {
      data,
      xField: "application_folder_fee_status",
      yField: "count",
      isStack: true,
      seriesField: 'type',
      fetchParams: {
        count: "application_folder_fee_status",
      }
    }
]
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
  return <Column {...configs[preset]} />;
};

export default Graph;
