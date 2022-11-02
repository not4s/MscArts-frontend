import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../services/API";

import { ETHNICITY_MAPPING } from "../constants/ethnicity";

const DEFAULT_CONFIG = {
    data: [],
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
    ]
}

const PieGraph = ({ programType, graphType }) => {

  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    const api = new APIService()

    const fetchParams = {}

    if (programType !== "ALL") {
        fetchParams["program_type"] = programType;
    }

    api.getApplicant(fetchParams)
        .then(res => {
            let d = res.data;

            console.log(`Forming ${graphType}`);

            if (graphType === "ETHNICITY") { // Ethnicity
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

                setConfig({...DEFAULT_CONFIG, data: finalData});
            } else if (graphType === "NATIONALITY") {
                let nationalityCount = Object.values(d.reduce((a, { nationality }) => {
                    if (!a[nationality]) a[nationality] = { 'type': nationality, 'value': 0};
                    a[nationality]['value'] += 1;
                    return a;
                }, {}))


                nationalityCount.sort((a, b) => b.value - a.value);
                let finalData = nationalityCount.slice(0, 9);
                let others = nationalityCount.slice(9);

                let othersDict = Object.values(others.reduce((a, { nationality, value }) => {
                    if (!a[nationality]) a[nationality] = { 'type': 'Others', 'value': 0};
                    a[nationality]['value'] += value;
                    return a;
                }, {}));
                
                finalData = finalData.concat(othersDict);
                

                setConfig({...DEFAULT_CONFIG, data: finalData});


            }
        })    
  }, [])

  return (
  <>
    <h1>{ `${programType} - ${graphType} graph` }</h1>
    <Pie {...config} />;
  </>)
};

export default PieGraph;
