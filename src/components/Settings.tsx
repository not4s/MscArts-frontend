import { BoldOutlined } from "@ant-design/icons";
import { Card, Col, Row, Button, Drawer, Switch } from "antd";
import React, { useState } from "react";

const Settings = () => {
  const [open, setOpen] = useState(false);

  const displayDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const onSwitchChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <div className="site-card-wrapper">
      <Drawer
        title="General Settings"
        placement="right"
        onClose={closeDrawer}
        open={open}
      >
        <pre>
          Dark Mode: <Switch defaultChecked onChange={onSwitchChange} />{" "}
        </pre>
      </Drawer>
      <Row gutter={22}>
        <Col span={6}>
          <Card title="General Settings" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Settings 2" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Settings 3" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
      </Row>
      <Row gutter={22}>
        <Col span={6}>
          <Card title="Settings 4" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Settings 5" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Settings 6" bordered={true}>
            <Button type="primary" onClick={displayDrawer}>
              Open
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
