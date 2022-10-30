import { Card, Col, Row, Button, Drawer, Switch } from "antd";
import React, { useState } from "react";
import TargetForm from "./TargetForm";

const Settings = () => {
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
          <Card title="General" bordered={false} className="card">
            To create drawers here
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
