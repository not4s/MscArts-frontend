import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../services/API";

import { ETHNICITY_MAPPING } from "../constants/ethnicity";

const PieGraph = ({ preset=0 }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const api = new APIService()

    api.getApplicant(configs[preset].fetchParams)
        .then(res => {
            let d = res.data;
            for (let i = 0; i < d.length; i++) {
                if (d[i]['ethnicity'] !== undefined) {
                    d[i]['ethnicity'] = ETHNICITY_MAPPING[d[i]['ethnicity']]; 
                } 
                
                if (d[i]['ethnicity'] === undefined) {
                    d[i]['ethnicity'] = 'Other/Unknown';
                }
            }
            let finalData = Object.values(d.reduce((a, { ethnicity }) => {
                if (!a[ethnicity]) a[ethnicity] = { 'type': ethnicity, 'value': 0};
                a[ethnicity]['value'] += 1;
                return a;
            }, {}))
            setData(finalData);
        })    
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  const configs = [
    {
        data,
        appendPadding: 10,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
          type: 'inner',
          offset: '-20%',
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
        fetchParams: {
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
  return (
  <>
    <h1>{configs[preset].fetchParams.program_type === undefined ? "All Programs" : configs[preset].fetchParams.program_type }</h1>
    <Pie {...configs[preset]} />;
  </>)
};

export default PieGraph;
