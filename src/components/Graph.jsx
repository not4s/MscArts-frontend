import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../services/API";

const DEFAULT_CONFIG = {
  data: [],
  xField: "gender",
  yField: "count",
  isStack: true,
  seriesField: 'type'
}

const Graph = ({ preset=0, programType, graphType }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  // const [data, setData] = useState([])

  useEffect(() => {
    const api = new APIService()

    const fetchParams = {}

    
    if (programType !== "ALL") {
      fetchParams["program_type"] = programType;
    }

    fetchParams["count"] = graphType;

    api.getApplicant(fetchParams)
      .then((res) => setConfig({...DEFAULT_CONFIG, data:res.data, xField: graphType}));
  }, [])

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

//   const configs = [
//     {
//       data,
//       xField: "gender",
//       yField: "count",
//       isStack: true,
//       seriesField: 'type',
//       fetchParams: {
//         count: "gender",
//         program_type: "MAC"
//       }, 
//     },
//     {
//       data,
//       xField: "application_folder_fee_status",
//       yField: "count",
//       isStack: true,
//       seriesField: 'type',
//       fetchParams: {
//         count: "application_folder_fee_status",
//       }
//     }
// ]
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
    <>
    <h1>{ `${programType} - ${graphType} graph` }</h1>
    <Column {...config} />
    </>
  );
};

export default Graph;
