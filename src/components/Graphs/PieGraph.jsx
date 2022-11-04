import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import axios from "axios";
import { APIService } from "../../services/API";

import { ETHNICITY_MAPPING } from "../../constants/ethnicity";

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

const PieGraph = ({ programType, graphType, data }) => {

  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({...DEFAULT_CONFIG, data: data})
    }    
  }, [data])

  return (
  <>
    <h1>{ `${programType} - ${graphType} graph` }</h1>
    <Pie {...config} />
  </>)
};

export default PieGraph;
