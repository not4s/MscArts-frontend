import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ETHNICITY_MAPPING } from "../constants/ethnicity";
import { APIService } from "../services/API";
import CreateGraph from "./CreateGraph";
import { GraphInterface } from "../constants/graphs";
import BarGraph from "./Graphs/BarGraph";
import PieGraph from "./Graphs/PieGraph";
import RGL, { WidthProvider } from "react-grid-layout";
import { GraphSize } from "./Graphs/styles";

const ReactGridLayout = WidthProvider(RGL);

interface Props {
  graphIndex: number;
  graphContent: GraphInterface[][];
  setGraphContent: (key: number, graph: GraphInterface[]) => void;
}

const GraphGrid: React.FC<Props> = ({
  graphIndex,
  graphContent,
  setGraphContent,
}) => {
  const [graphs, setGraphs] = useState<GraphInterface[]>([]);

  const [reload, setReload] = useState<boolean>(false);
  const api = new APIService();
  // console.log(props)
  React.useEffect(() => {
    const newG = graphContent[graphIndex];

    const newGraphs = newG ? [...graphContent[graphIndex]] : [];
    console.log("Inside GraphGrid", newGraphs);

    const init = async (newGraphs: GraphInterface[]) => {
      let change = false;
      for (let i = 0; i < newGraphs.length; i++) {
        if (newGraphs[i]["data"] === undefined) {
          change = true;
          const fetchParams: any = {};

          if (newGraphs[i]["programType"] !== "ALL") {
            fetchParams["program_type"] = newGraphs[i]["programType"];
          }

          if (newGraphs[i].type === "PIE") {
            let res = await api.getApplicant(fetchParams);
            newGraphs[i]["data"] = toPieData(
              res.data,
              newGraphs[i]["graphType"],
              newGraphs[i]["top"]
            );
          } else {
            fetchParams["count"] = newGraphs[i]["graphType"];
            let res = await api.getApplicant(fetchParams);
            let data = res.data;
            if (!newGraphs[i]["stack"]) {
              data = data.filter(
                (a: any) => a[newGraphs[i]["graphType"]] !== "Combined"
              );
            }
            // console.log(data);
            newGraphs[i]["data"] = data;
          }
        }
      }

      if (change) {
        setGraphContent(graphIndex, newGraphs);
        setGraphs(newGraphs);
      }
    };

    init(newGraphs);
  }, [graphContent]);

  const graphToComponent = (graphData: GraphInterface, key: string) => {
    if (graphData.type === "PIE") {
      return (
        <GraphSize key={`layout-${key}`}>
          <PieGraph key={key} layoutKey={key} {...graphData} />
        </GraphSize>
      );
      // return <PieGraph key={`layout-${key}`} layoutKey={key} {...graphData} />;
    } else if (graphData.type === "BAR") {
      return (
        <GraphSize key={`layout-${key}`}>
          <BarGraph key={key} layoutKey={key} {...graphData} />
        </GraphSize>
      );
      // return <BarGraph key={`layout-${key}`} layoutKey={key} {...graphData} />;
    }
  };

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);

  // const nodes = rows.map((row, index: number) => {
  //   return (
  //     <>
  //       <Row key={index}>
  //         {row.map((graph: any, key: number) => {
  //           return (
  //             <Col key={key} span={24 / row.length}>
  //               {graphToComponent(graph)}
  //             </Col>
  //           );
  //         })}
  //       </Row>
  //     </>
  //   );
  // });

  const [layout, setLayout] = useState([
    { i: "layout-0", x: 0, y: 0, w: 10, h: 10 },
    { i: "layout-1", x: 2, y: 0, w: 10, h: 10 },
    { i: "layout-2", x: 4, y: 0, w: 10, h: 10 },
  ]);

  // return (
  //   <>
  //     {nodes}
  //     <CreateGraph
  //       graphs={graphs}
  //       setGraphs={setGraphContent}
  //       graphIndex={graphIndex}
  //       setReload={setReload}
  //       reload={reload}
  //     />
  //   </>
  // );

  return (
    <ReactGridLayout
      className="layout"
      layout={layout}
      cols={12}
      width={800}
      rowHeight={30}
      onLayoutChange={setLayout}
      draggableHandle=".myDragHandleClassName"
    >
      {graphs.map((k, index) => {
        console.log(`My Layout key is ${index}`);
        return graphToComponent(k, index.toString());
      })}
      {/* <div key="0">
          <span className="text">0</span>
        </div>
      <div key="1">
          <span className="text">1</span>
        </div>
      <div key="2">
          <span className="text">2</span>
        </div> */}
    </ReactGridLayout>
  );
};

export default GraphGrid;

const toPieData = (data: any, graphType: string, top: number = 0): any[] => {
  if (graphType === "ethnicity") {
    for (let i = 0; i < data.length; i++) {
      if (data[i][graphType] !== undefined) {
        // @ts-ignore
        data[i][graphType] = ETHNICITY_MAPPING[data[i][graphType]];
      }

      if (data[i][graphType] === undefined) {
        data[i][graphType] = "Other/Unknown";
      }
    }
  }

  let finalData = Object.values(
    data.reduce((a: any, d: any) => {
      if (!a[d[graphType]]) a[d[graphType]] = { type: d[graphType], value: 0 };
      a[d[graphType]]["value"] += 1;
      return a;
    }, {})
  );

  if (top > 0) {
    finalData.sort((a: any, b: any) => b.value - a.value);
    let topN = finalData.slice(0, top);
    let others: any = finalData.slice(top);

    let othersDict = Object.values(
      others.reduce((a: any, d: any) => {
        if (!a[d[graphType]]) a[d[graphType]] = { type: "Others", value: 0 };
        a[d[graphType]]["value"] += d["value"];
        return a;
      }, {})
    );

    return topN.concat(othersDict);
  }
  return finalData;
};

function sliceIntoChunks(arr: any[], len: number) {
  if (arr === undefined) {
    return [];
  }

  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
