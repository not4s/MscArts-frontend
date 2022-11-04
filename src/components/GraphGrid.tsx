import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ETHNICITY_MAPPING } from "../constants/ethnicity";
import { APIService } from "../services/API";
import CreateGraph from "./CreateGraph";
import BarGraph from "./Graphs/BarGraph";
import PieGraph from "./Graphs/PieGraph";

interface GraphInterface {
  type: string;
  programType: string;
  graphType: string;
  data?: any[];
  stack?: boolean;
}

const GraphGrid = () => {
  const [graphs, setGraphs] = useState<GraphInterface[]>([
    { type: "PIE", programType: "ALL", graphType: "NATIONALITY" },
    { type: "BAR", programType: "ALL", graphType: "gender", stack: false },
  ]);

  const [reload, setReload] = useState<boolean>(false);

  const api = new APIService();

  React.useEffect(() => {
    const newGraphs = [...graphs];

    const init = async (newGraphs: GraphInterface[]) => {
      for (let i = 0; i < newGraphs.length; i++) {
        if (newGraphs[i]["data"] === undefined) {
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
              data = data.filter((a: any) => a["graphType"] !== "Combined");
            }
            console.log(data);
            newGraphs[i]["data"] = data;
          }
        }
      }
      setGraphs(newGraphs);
    };

    init(newGraphs);
  }, [reload]);

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);
  console.log(rows);
  const nodes = rows.map((row, index: number) => {
    return (
      <>
        <Row key={index}>
          {row.map((graph: any, key: number) => {
            return (
              <Col key={key} span={24 / row.length}>
                {" "}
                {graphToComponent(graph)}{" "}
              </Col>
            );
          })}
          <CreateGraph
            graphs={graphs}
            setGraphs={setGraphs}
            setReload={setReload}
            reload={reload}
          />
        </Row>
      </>
    );
  });

  return <>{nodes}</>;
};

export default GraphGrid;

function graphToComponent(graphData: GraphInterface) {
  if (graphData.type === "PIE") {
    return (
      <PieGraph
        programType={graphData.programType}
        graphType={graphData.graphType}
        data={graphData.data}
      />
    );
  } else if (graphData.type === "BAR") {
    return (
      <BarGraph
        programType={graphData.programType}
        graphType={graphData.graphType}
        data={graphData.data}
      />
    );
  }
}

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
  console.log(arr);

  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
