import React, { useEffect, useState } from "react";
import { EditText, EditTextArea } from 'react-edit-text';
import 'react-edit-text/dist/index.css'
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

const PieGraph = ({ programType, graphType, data, title }) => {

  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (data) {
      setConfig({...DEFAULT_CONFIG, data: data})
    }    
  }, [data])

  return (
  <>
    <DraggableHandle className="myDragHandleClassName">
      <EditText name='textbox3'
                defaultValue={ `${title} Graph` }
                inputClassName='bg-success'>
        { `${title} Graph` }
      </EditText></DraggableHandle>
    <Pie className="our-chart" {...config} />
  </>)
};

export default PieGraph;
