import { Spin } from "antd";
import React, { useState } from "react";
import {
  BarGraphInterface,
  Graph,
  LineGraphInterface,
  TargetInterface,
} from "../constants/graphs";
import { APIService } from "../services/API";
import BarGraph from "./Graphs/BarGraph";
import LineGraph from "./Graphs/LineGraph";
import PieGraph from "./Graphs/PieGraph";
import RGL, { WidthProvider } from "react-grid-layout";
import { GraphSize } from "./Graphs/styles";

const ReactGridLayout = WidthProvider(RGL);

interface Props {
  graphIndex: number;
  graphContent: Graph[];
  setGraphContent: (key: number, graph: Graph[]) => void;
  mock: boolean;
}

const GraphGrid: React.FC<Props> = ({
  graphIndex,
  graphContent,
  setGraphContent,
  mock = false,
}) => {
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const api = new APIService();

  React.useEffect(() => {
    const newGraphs = [...graphContent];

    const init = async (newGraphs: Graph[]) => {
      if (!loaded) setLoading(true);
      let change = false;
      for (let i = 0; i < newGraphs.length; i++) {
        if (newGraphs[i]["data"] === undefined) {
          change = true;

          let fetchParams = {};

          if (newGraphs[i].type === "PIE" || newGraphs[i].type === "BAR") {
            const res = await api.getGraph(newGraphs[i], mock);
            newGraphs[i].data = res.data;

            if (newGraphs[i].type === "BAR") {
              let barGraph: BarGraphInterface = newGraphs[i];
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
          } else {
            let lineGraph: LineGraphInterface = newGraphs[i];
            fetchParams = {
              ...fetchParams,
              breakdown: lineGraph.breakdown,
              frequency: lineGraph.frequency,
              series: lineGraph.series,
            };
            let res = await api.getTrends(fetchParams);
            let data = res.data.reverse();
            console.log(data);
            newGraphs[i]["data"] = data;
          }
        }
      }

      if (change) {
        setGraphContent(graphIndex, newGraphs);
      }

      setGraphs(newGraphs);
      setLoading(false);
      setLoaded(true);
    };

    init(newGraphs);
  }, [graphContent]);

  const graphToComponent = (graphData: Graph, index: number) => {
    if (graphData.type === "PIE") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <PieGraph
            {...graphData}
            setTitle={(e) => setTitle(index, e)}
            deleteGraph={() => deleteGraph(index)}
            editGraph={(e) => editGraph(index, e)}
          />
        </GraphSize>
      );
    } else if (graphData.type === "BAR") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <BarGraph
            {...graphData}
            setTitle={(e) => setTitle(index, e)}
            deleteGraph={() => deleteGraph(index)}
            editGraph={(e) => editGraph(index, e)}
          />
        </GraphSize>
      );
    } else if (graphData.type === "LINE") {
      return (
        <GraphSize key={graphData.layout.i} data-grid={graphData.layout}>
          <LineGraph data={graphData.data} />
        </GraphSize>
      );
    }
  };

  const setLayout = (layouts: RGL.Layout[]) => {
    const newGraphs = [...graphContent];

    for (let i = 0; i < newGraphs.length; i++) {
      newGraphs[i].layout = layouts[i];
    }
    setGraphContent(graphIndex, newGraphs);
  };

  const setTitle = (i: number, title: string) => {
    const newGraphs = [...graphContent];

    newGraphs[i].title = title;

    console.log(newGraphs);
    setGraphContent(graphIndex, newGraphs);
  };

  const deleteGraph = (i: number) => {
    const newGraphs = [...graphContent];
    console.log(newGraphs);

    newGraphs.splice(i, 1);
    setGraphContent(graphIndex, newGraphs);
  };

  const editGraph = (i: number, newGraph: Graph) => {
    const newGraphs = [...graphContent];

    newGraphs[i] = newGraph;

    setGraphContent(graphIndex, newGraphs);
  };

  return !loading ? (
    <>
      <ReactGridLayout
        className="layout"
        style={{ marginRight: "10px" }}
        cols={24}
        rowHeight={50}
        isBounded={true}
        onLayoutChange={setLayout}
      >
        {graphs.map((k, index) => graphToComponent(k, index))}
      </ReactGridLayout>
    </>
  ) : (
    <>
      <Spin size="large" tip="Loading..." />
    </>
  );
};

export default GraphGrid;
