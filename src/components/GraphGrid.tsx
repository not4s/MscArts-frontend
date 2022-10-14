import { Col, Row } from "antd";
import React from "react";
import Graph from "./Graph";

const GraphGrid = () => {
  return (
    <>
      <Row>
        <Col span={12}>
          {" "}
          <Graph />{" "}
        </Col>
        {/* <Col span={6}>col-6</Col> */}
        {/* <Col span={6}>col-6</Col> */}
        <Col span={12}>col-6</Col>
      </Row>
    </>
  );
};

export default GraphGrid;
