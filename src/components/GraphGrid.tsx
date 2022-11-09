import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ETHNICITY_MAPPING } from "../constants/ethnicity";
import { APIService } from "../services/API";
import CreateGraph from "./CreateGraph";
import { GraphInterface } from "../constants/graphs";
import BarGraph from "./Graphs/BarGraph";
import PieGraph from "./Graphs/PieGraph";

const GraphGrid = (props: any) => {
  // const [graphs, setGraphs] = useState<GraphInterface[]>(props.graphContent[props.key]);

  const [reload, setReload] = useState<boolean>(false);
  const api = new APIService();
  // console.log(props)
  React.useEffect(() => {
    const newGraphContent = props.graphContent;
    const newGraphs = [...props.graphContent[props.graphKey]];

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
              data = data.filter(
                (a: any) => a[newGraphs[i]["graphType"]] !== "Combined"
              );
            }
            // console.log(data);
            newGraphs[i]["data"] = data;
          }
        }
      }
      // console.log(newGraphs)
      newGraphContent[props.graphKey] = newGraphs;
      props.setGraphContent(newGraphContent);
    };

    init(newGraphs);
  }, [reload]);

  const graphToComponent = (graphData: GraphInterface) => {
    console.log(graphData);
    if (graphData.type === "PIE") {
      return <PieGraph {...graphData} />;
    } else if (graphData.type === "BAR") {
      return <BarGraph {...graphData} />;
    }
  };
  // console.log(props.key);
  // console.log(props.graphContent);
  // console.log(props.graphContent[props.key]);
  const rows: JSX.Element[][] = sliceIntoChunks(
    props.graphContent[props.graphKey],
    3
  );

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
        graphs={props.graphContent}
        setGraphs={props.setGraphContent}
        graphKey={props.graphKey}
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

  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
