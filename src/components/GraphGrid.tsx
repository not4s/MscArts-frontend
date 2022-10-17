import { Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState, ReactNode } from "react";
import CreateGraph from "./CreateGraph";
import Graph from "./Graph";

const GraphGrid = () => {
  const [graphs, setGraphs] = useState([<Graph />]);

  const rows: JSX.Element[][] = sliceIntoChunks(graphs, 3);
  console.log(rows);
  const nodes = rows.map((row) => {
    return (
      <>
        <Row>
          {" "}
          {row.map((graph) => {
            return <Col span={24 / row.length}> {graph} </Col>;
          })}{" "}
        </Row>
        <CreateGraph graphs={graphs} setGraphs={setGraphs} />
      </>
    );
  });
  console.log(nodes);

  return <>{nodes}</>;
};

export default GraphGrid;

function sliceIntoChunks(arr: any[], len: number) {
  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}
