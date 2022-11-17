import { Col, Row } from "antd";
import React, { useState } from "react";
import { ETHNICITY_MAPPING } from "../../constants/ethnicity";
import { APIService } from "../../services/API";
import CreateGraph from "../CreateGraph";
import {
  BarGraphInterface,
  Graph,
  PieGraphInterface,
} from "../../constants/graphs";
import BarGraph from "../Graphs/BarGraph";
import PieGraph from "../Graphs/PieGraph";

interface Props {
  mockData: any[];
}

const MockGraphGrid: React.FC<Props> = ({ mockData }) => {
  const [graphs, setGraphs] = useState<Graph[]>([
    {
      type: "PIE",
      layout: {
        i: "layout-1",
        w: 4,
        h: 2,
        x: 0,
        y: 0,
      },
      programType: "ALL",
      decisionStatus: "ALL",
      graphType: "nationality",
      data: undefined,
      top: 5,
      title: "Nationality Pie Chart",
    },
    {
      type: "BAR",
      layout: {
        i: "layout-1",
        w: 4,
        h: 2,
        x: 0,
        y: 0,
      },
      programType: "MAC",
      decisionStatus: "ALL",
      graphType: "gender",
      data: undefined,
      combined: true,
      title: "Gender Bar Chart (MAC)",
    },
  ]);

  const [reload, setReload] = useState<boolean>(false);
  const api = new APIService();

  React.useEffect(() => {
    const newGraphs = [...graphs];

    const init = async (newGraphs: Graph[]) => {
      for (let i = 0; i < newGraphs.length; i++) {
        if (newGraphs[i]["data"] === undefined) {
          if (newGraphs[i].type === "PIE") {
            let pieGraph: PieGraphInterface = newGraphs[i];
            let top = pieGraph.top || 0;
            pieGraph.data = toPieData(mockData, pieGraph.graphType, top);
          } else {
            let barGraph: BarGraphInterface = newGraphs[i];
            let data: any[] = toBarData(
              mockData,
              barGraph.graphType,
              barGraph.programType,
              barGraph.combined
            );
            barGraph.data = data;
          }
        }
      }
      setGraphs(newGraphs);
    };

    init(newGraphs);
  }, [mockData, reload]);

  const graphToComponent = (graphData: Graph) => {
    if (graphData.type === "PIE") {
      return (
        <PieGraph
          {...graphData}
          setTitle={(e) => console.log("saving")}
          deleteGraph={() => console.log("deleted")}
          editGraph={(e) => console.log("saving")}
        />
      );
    } else if (graphData.type === "BAR") {
      return (
        <BarGraph
          {...graphData}
          setTitle={(e) => console.log("saving")}
          deleteGraph={() => console.log("deleted")}
          editGraph={(e) => console.log("saving")}
        />
      );
    }
  };

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);

  const setGraphsByIndex = (key: number, newGraph: Graph[]) =>
    setGraphs(newGraph);

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
      {/* <CreateGraph
        setLayoutCounter={[]}
        graphs={graphs}
        graphIndex={-1}
        setGraphs={setGraphsByIndex}
        setReload={setReload}
        reload={reload}
      /> */}
    </>
  );
};

export default MockGraphGrid;

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
    let topN = finalData.slice(0, top - 1);
    let others: any = finalData.slice(top - 1);

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

const toBarData = (
  data: any,
  graphType: string,
  programType: string,
  stack?: boolean
): any[] => {
  if (programType !== "ALL") {
    data = data.filter((a: any) => a["program_type"] === programType);
  }
  console.log(data);

  let finalData: any[] = Object.values(
    data.reduce((a: any, d: any) => {
      if (!a[d[graphType]])
        a[d[graphType]] = {
          [graphType]: d[graphType],
          count: 0,
          type: d[graphType],
        };
      a[d[graphType]]["count"] += 1;
      return a;
    }, {})
  );

  finalData = finalData.sort((a, b) => b["count"] - a["count"]);

  if (stack) {
    let newData: any[] = [];
    for (let i = 0; i < finalData.length; i++) {
      let stacked = { ...finalData[i] };
      stacked[graphType] = "Combined";
      newData.push(stacked);
    }
    newData.sort((a, b) => a["count"] - b["count"]);
    finalData = newData.concat(finalData);
  }
  console.log(finalData);

  return finalData;
};

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
