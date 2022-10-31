import { Card, Col, Row, Button, Drawer, Switch } from "antd";
import React, { useState } from "react";
import TargetForm from "./TargetForm";

const TargetSettings = () => {
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState(0);

  const styles = {
    cardRows: {
      width: "100%",
      justifyContent: "center",
      marginTop: "50px",
    },
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16} className="card-rows" style={styles.cardRows}>
        <Col span={16} className="card-cols">
          <Card title="Targets" bordered={false} className="card">
            <TargetForm />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TargetSettings;
