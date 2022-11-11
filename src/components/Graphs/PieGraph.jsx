import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import { DraggableHandle, GraphSize } from "./styles";

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

const PieGraph = ({ programType, graphType, data, title, layoutKey }) => {

  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({...DEFAULT_CONFIG, data: data})
    }    
  }, [data])

  return (
  <div>
    <DraggableHandle className="myDragHandleClassName">{ `${title} Graph` }</DraggableHandle>
    <Pie {...config} />
  </div>)
};

export default PieGraph;
