import { Line, LineConfig } from '@ant-design/charts';
import React from 'react'

interface LineGraphProps {
  data: any
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {

  const config: LineConfig = {
    data,
    xField: 'period',
    yField: 'count',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };
  return (
    <>
      {data===undefined ? <></> : <Line {...config} />}      
    </>);
}

export default LineGraph