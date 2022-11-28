import React, { useState } from "react";
import GraphGrid from "./GraphGrid";
import { useNavigate, useParams } from "react-router-dom";
import { Graph } from "../constants/graphs";
import { message, Spin } from "antd";
import { APIService } from "../services/API";

const ParamGraphGrid = () => {
  const params: any = useParams();
  const navigate = useNavigate();
  const api = new APIService();

  const [graph, setGraph] = useState<Graph[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const graphIndex = 0; // Not used

  React.useEffect(() => {
    let b64string: string = params["graphs"];
    api
      .importTab(b64string)
      .then((res) => {
        if (res.success) {
          const decoded = JSON.parse(atob(res.data["base64JSON"]));

          if (graph.length === 0) {
            // for (let i = 0 ; i < decoded.length; i++) {
            //   decoded[i].layout.static = true;
            // }

            setGraph(decoded);
          }
          setLoading(false);
        } else {
          message.error("Unable to find unique link");
          navigate("/visuals");
        }
      })
      .catch((res) => {
        message.error("Unable to find unique link");
        navigate("/visuals");
      });
  }, []);

  const setGraphContent = (e: number, newGraphs: Graph[]) => {
    setGraph(newGraphs);
  };

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <GraphGrid
          graphContent={graph}
          graphIndex={graphIndex}
          mock={false}
          setGraphContent={(e, v) => setGraphContent(0, v)}
        />
      )}
    </>
  );
};

export default ParamGraphGrid;
