import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ETHNICITY_MAPPING } from "../constants/ethnicity";
import { APIService } from "../services/API";
import CreateGraph from "./CreateGraph";
import { GraphInterface } from "../constants/graphs";
import BarGraph from "./Graphs/BarGraph";
import PieGraph from "./Graphs/PieGraph";

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
              newGraphs[i]["graphType"]
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

  const graphToComponent = (graphData: GraphInterface) => {
    if (graphData.type === "PIE") {
      return <PieGraph {...graphData} />;
    } else if (graphData.type === "BAR") {
      return <BarGraph {...graphData} />;
    }
  };

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);

  const nodes = rows.map((row, index: number) => {
    return (
      <>
        <Row key={index}>
          {row.map((graph: any, key: number) => {
            return (
              <Col key={key} span={24 / row.length}>
                {graphToComponent(graph)}
              </Col>
            );
          })}
        </Row>
      </>
    );
  });

  return (
    <>
      {nodes}
      <CreateGraph
        graphs={graphs}
        setGraphs={setGraphContent}
        graphIndex={graphIndex}
        setReload={setReload}
        reload={reload}
      />
    </>
  );
};

export default GraphGrid;

function toPieData(response: any, graphType: string) {
  let d: any[] = response;
  if (graphType === "ETHNICITY") {
    // Ethnicity
    for (let i = 0; i < d.length; i++) {
      if (d[i]["ethnicity"] !== undefined) {
        // @ts-ignore
        d[i]["ethnicity"] = ETHNICITY_MAPPING[d[i]["ethnicity"]];
      }

      if (d[i]["ethnicity"] === undefined) {
        d[i]["ethnicity"] = "Other/Unknown";
      }
    }
    let finalData = Object.values(
      d.reduce((a, { ethnicity }) => {
        if (!a[ethnicity]) a[ethnicity] = { type: ethnicity, value: 0 };
        a[ethnicity]["value"] += 1;
        return a;
      }, {})
    );
    return finalData;
  } else if (graphType === "NATIONALITY") {
    let nationalityCount = Object.values(
      d.reduce((a, { nationality }) => {
        if (!a[nationality]) a[nationality] = { type: nationality, value: 0 };
        a[nationality]["value"] += 1;
        return a;
      }, {})
    );

    nationalityCount.sort((a: any, b: any) => b.value - a.value);
    let finalData = nationalityCount.slice(0, 9);
    let others: any = nationalityCount.slice(9);

    let othersDict = Object.values(
      others.reduce((a: any, { nationality, value }: any) => {
        if (!a[nationality]) a[nationality] = { type: "Others", value: 0 };
        a[nationality]["value"] += value;
        return a;
      }, {})
    );

    finalData = finalData.concat(othersDict);

    return finalData;
  }
}

function sliceIntoChunks(arr: any[], len: number) {
  // console.log(arr);
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
