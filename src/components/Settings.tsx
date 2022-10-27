import { Card, Col, Row, Button, Drawer, Switch } from "antd";
import React, { useState } from "react";
import TargetForm from "./Settings/TargetForm";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState(0);

  const displayDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const onSwitchChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const renderTargets = () => {
    return <TargetForm />;
  };

  const renderSettingTab = (i: Number) => {
    switch (i) {
      case 1:
        return renderTargets();
      default:
        return (
          <pre>
            Dark Mode: <Switch defaultChecked onChange={onSwitchChange} />{" "}
          </pre>
        );
    }
  };

  return (
    <div className="site-card-wrapper">
      <Drawer
        title="General Settings"
        placement="right"
        onClose={closeDrawer}
        open={open}
      >
        {renderSettingTab(setting)}
      </Drawer>
      <Row>
        <Col span={6}>
          <Card title="General Settings" bordered={true}>
            <Button
              type="primary"
              onClick={() => {
                displayDrawer();
                setSetting(0);
              }}
            >
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Set Course Targets" bordered={true}>
            <Button
              type="primary"
              onClick={() => {
                displayDrawer();
                setSetting(1);
              }}
            >
              Open
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Settings 3" bordered={true}>
            <Button
              type="primary"
              onClick={() => {
                displayDrawer();
                setSetting(2);
              }}
            >
              Open
            </Button>
          </Card>
        </Col>
      </Row>
      <Row>
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
