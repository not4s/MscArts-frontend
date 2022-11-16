import React, { useState } from "react";
import GraphGrid from "./GraphGrid";
import { useNavigate, useParams } from "react-router-dom";
import { Graph } from "../constants/graphs";
import { message } from "antd";

const ParamGraphGrid = () => {
  const params: any = useParams();
  const navigate = useNavigate();

  const [graph, setGraph] = useState<Graph[]>([]);
  const [graphIndex, setGraphIndex] = useState<number>(0);

  React.useEffect(() => {
    let b64string: string = params["graphs"];
    try {
      var decoded = JSON.parse(atob(b64string));
      console.log(decoded);
      if (graph.length === 0) {
        setGraph(decoded);
      }
    } catch {
      message.error("Unable to find Unique Link");
      navigate("/visuals");
    }
  }, []);

  return (
    <>
      <GraphGrid
        graphContent={graph}
        graphIndex={graphIndex}
        setGraphContent={(e, v) => {
          return;
        }}
      />
    </>
  );
};

export default ParamGraphGrid;
