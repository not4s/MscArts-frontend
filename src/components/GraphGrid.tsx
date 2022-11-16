import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ETHNICITY_MAPPING } from "../constants/ethnicity";
import {
  BarGraphInterface,
  Graph,
  LineGraphInterface,
  PieGraphInterface,
  TargetInterface,
} from "../constants/graphs";
import { APIService } from "../services/API";
import CreateGraph from "./CreateGraph";
import BarGraph from "./Graphs/BarGraph";
import LineGraph from "./Graphs/LineGraph";
import PieGraph from "./Graphs/PieGraph";
import RGL, { WidthProvider } from "react-grid-layout";
import { GraphSize } from "./Graphs/styles";

const ReactGridLayout = WidthProvider(RGL);

interface Props {
  graphIndex: number;
  graphContent: Graph[][];
  setGraphContent: (key: number, graph: Graph[]) => void;
}

const GraphGrid: React.FC<Props> = ({
  graphIndex,
  graphContent,
  setGraphContent,
}) => {
  const [graphs, setGraphs] = useState<Graph[]>([]);

  const [reload, setReload] = useState<boolean>(false);

  const api = new APIService();
  // console.log(props)
  React.useEffect(() => {
    const newG = graphContent[graphIndex];

    const newGraphs = newG ? [...graphContent[graphIndex]] : [];
    // console.log("Inside GraphGrid", newGraphs);

    const init = async (newGraphs: Graph[]) => {
      let change = false;
      for (let i = 0; i < newGraphs.length; i++) {
        if (newGraphs[i]["data"] === undefined) {
          change = true;
          let fetchParams: any = {};

          if (newGraphs[i]["programType"] !== "ALL") {
            fetchParams["program_type"] = newGraphs[i]["programType"];
          }

          if (newGraphs[i]["decisionStatus"] !== "ALL") {
            fetchParams["decision_status"] = newGraphs[i]["decisionStatus"];
          }

          if (newGraphs[i].type === "PIE") {
            let pieGraph: PieGraphInterface = newGraphs[i];
            let res = await api.getApplicant(fetchParams);
            pieGraph["data"] = toPieData(
              res.data,
              pieGraph.graphType,
              pieGraph.top
            );
          } else if (newGraphs[i].type === "LINE") {
            let lineGraph: LineGraphInterface = newGraphs[i];
            fetchParams = {
              ...fetchParams,
              breakdown: lineGraph.breakdown,
              frequency: lineGraph.frequency,
            };
            let res = await api.getTrends(fetchParams);
            let data = res.data.reverse();
            console.log(data);
            newGraphs[i]["data"] = data;
          } else {
            let barGraph: BarGraphInterface = newGraphs[i];
            fetchParams["count"] = newGraphs[i]["graphType"];
            if (barGraph.stack !== undefined) {
              fetchParams["series"] = barGraph.stack;
            }

            let res = await api.getApplicant(fetchParams);
            let data = res.data;
            if (!barGraph.combined) {
              data = data.filter(
                (a: any) => a[barGraph.graphType] !== "Combined"
              );
            }
            barGraph.data = data;

            if (barGraph.target !== undefined) {
              let res = await api.getTarget(barGraph.programType, 2022);

              const combinedTarget = res.data.reduce(
                (a: TargetInterface, b: TargetInterface) => {
                  a["target"] += b["target"];
                  return a;
                },
                { fee_status: "Combined", target: 0 }
              );

              const allTargets = [...res.data, combinedTarget].sort(
                (a, b) => b["target"] - a["target"]
              );

              barGraph.target = allTargets;
            }
          }
        }
      }

      if (change) {
        setGraphContent(graphIndex, newGraphs);
        setGraphs(newGraphs);
        setLayoutCounter(newGraphs.length);
      }
    };

    init(newGraphs);
  }, [graphContent]);

  const graphToComponent = (graphData: Graph, index: number) => {
    if (graphData.type === "PIE") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <PieGraph {...graphData} setTitle={(e) => setTitle(index, e)} />
        </GraphSize>
      );
      // return <PieGraph key={`layout-${key}`} layoutKey={key} {...graphData} />;
    } else if (graphData.type === "BAR") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <BarGraph {...graphData} setTitle={(e) => setTitle(index, e)} />
        </GraphSize>
      );
      // return <BarGraph key={`layout-${key}`} layoutKey={key} {...graphData} />;
    } else if (graphData.type === "LINE") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <LineGraph data={graphData.data} />
        </GraphSize>
      );
    }
  };

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);

  const setLayout = (layouts: RGL.Layout[]) => {
    const newG = graphContent[graphIndex];
    const newGraphs = newG ? [...graphContent[graphIndex]] : [];

    for (let i = 0; i < newGraphs.length; i++) {
      newGraphs[i].layout = layouts[i];
    }
    setGraphContent(graphIndex, newGraphs);
  };

  const setTitle = (i: number, title: string) => {
    const newG = graphContent[graphIndex];
    const newGraphs = newG ? [...graphContent[graphIndex]] : [];

    newGraphs[i].title = title;

    console.log(newGraphs);
    setGraphContent(graphIndex, newGraphs);
  };

  const [layoutCounter, setLayoutCounter] = useState(0);

  return (
    <>
      <CreateGraph
        graphs={graphs}
        setGraphs={setGraphContent}
        layoutCounter={layoutCounter}
        setLayoutCounter={setLayoutCounter}
        graphIndex={graphIndex}
        setReload={setReload}
        reload={reload}
      />
      <ReactGridLayout
        className="layout"
        style={{ marginRight: "10px" }}
        cols={24}
        rowHeight={50}
        isBounded={true}
        onLayoutChange={setLayout}
      >
        {graphs.map((k, index) => {
          return graphToComponent(k, index);
        })}
      </ReactGridLayout>
    </>
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
    finalData = finalData.sort((a: any, b: any) => b.value - a.value);
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
