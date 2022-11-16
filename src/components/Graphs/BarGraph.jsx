import React, { useEffect, useState } from "react";
import { EditText, EditTextArea } from 'react-edit-text';
import 'react-edit-text/dist/index.css'
import { Column } from "@ant-design/charts";
import { GraphSize, DraggableHandle } from "./styles";
import { updateLanguageServiceSourceFile } from "typescript";
import { APIService } from "../../services/API";

const DEFAULT_CONFIG = {
  data: [],
  xField: "gender",
  yField: "count",
  isStack: true,
  seriesField: 'type',
  tooltip: {
    showTitle: true
  },
  onReady: (plot) => {
    plot.on('legend-item:click', (evt) => {
      console.log(plot);
      /* Regenerate Annotations */
    });
  },
}

const BarGraph = ({ programType, graphType, data, title, ...props}) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  useEffect(() => {
    if (data) {
      let newConfig = {...DEFAULT_CONFIG, data, xField: graphType}

      if (props['target'] !== undefined && props['target'].length > 1) {
        const annotations = []
        const target = props['target']
       
        for (let i = 0; i < target.length; i++) {
          const targetAmount = target[i]['target'];
          
          annotations.push({
            type: 'line',
            start: (xScale, yScale) => {
              const pos = xScale.scale(target[i]['fee_status']);
              const offset = 100 / (xScale.values.length * 2) - 2.5;
              return [`${pos * 100 - offset}%`, `${100 - (targetAmount / yScale.count.max * 100)}%`]
            },
            end: (xScale, yScale) => {
              const pos = xScale.scale(target[i]['fee_status']);
              const offset = 100 / (xScale.values.length * 2) - 2.5;
              return [`${pos * 100 + offset}%`, `${100 - (targetAmount / yScale.count.max * 100)}%`]
            },
            text: {
              content: `Target`
            },
            style: {
              lineWidth: 2,
              stroke: 'red'
            },
          });
        }
        newConfig = {...newConfig, annotations};
      }      

      console.log(newConfig);

      setConfig(newConfig)
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
    <>
    <DraggableHandle className="myDragHandleClassName" style={{
      padding: "10px",
      margin: "10px",
      border: "solid",
      borderWidth: "1px",
      borderColor: "rgba(220,220,220,0.9)",
      }}>
      <EditText name='textbox3'
                defaultValue={ `${title} Graph` }
                inputClassName='bg-success'>
        { `${title} Graph` }
      </EditText>
    </DraggableHandle>
    <Column className="our-chart" {...config} />
    </>
  );
};

export default BarGraph;
