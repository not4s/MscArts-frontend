import { Col, Row } from "antd";
import React, { ReactNode } from "react";
import Graph from "./Graph";

const GraphGrid = () => {
  const list = [
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
    <Graph />,
  ];
  const rows: JSX.Element[][] = sliceIntoChunks(list, 3);
  console.log(rows);
  const nodes = rows.map((row) => {
    return (
      <Row>
        {" "}
        {row.map((graph) => {
          return <Col span={24 / row.length}> {graph} </Col>;
        })}{" "}
      </Row>
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
