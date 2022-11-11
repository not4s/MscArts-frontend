import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import { GraphSize } from "./styles";

const DEFAULT_CONFIG = {
    data: [],
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      // labelHeight: 28,
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

const PieGraph = ({ programType, graphType, data, title }) => {

  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({...DEFAULT_CONFIG, data: data})
    }    
  }, [data])

  return (
  <>
    <h1>{ `${title} Graph` }</h1>
    <Pie {...config} />
  </>)
};

export default PieGraph;
