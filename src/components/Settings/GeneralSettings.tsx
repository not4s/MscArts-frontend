import { Card, Col, Row, Button, Drawer, Switch } from "antd";
import React, { useState } from "react";

const GeneralSettings = () => {
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState(0);

  return (
    <div className="site-card-wrapper">
      <Row
        gutter={16}
        className="card-rows"
        style={{ width: "100%", justifyContent: "center", marginTop: "50px" }}
      >
        <Col span={16} className="card-cols">
          <Card title="General" bordered={false}>
            <body
              className="card-content"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  padding: "5px",
                  border: "solid",
                  borderColor: "gray",
                  borderWidth: "thin",
                }}
              >
                Option 1
              </p>
              <p
                style={{
                  padding: "5px",
                  border: "solid",
                  borderColor: "gray",
                  borderWidth: "thin",
                }}
              >
                Option 2
              </p>
            </body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSettings;
