import { Card, Col, Row, Button, Collapse, Switch } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";

const GeneralSettings = () => {
  const { Panel } = Collapse;

  const text = "Testing Text";

  type ExpandIconPosition = "start" | "end";

  const [expandIconPosition, setExpandIconPosition] =
    useState<ExpandIconPosition>("end");

  const onPositionChange = (newExpandIconPosition: ExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const onSwitchChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const genExtra = () => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const styles = {
    body: {
      width: "100%",
      justifyContent: "center",
      marginTop: "50px",
    },
    settingsCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px",
      marginBottom: "10px",
      border: "solid",
      borderColor: "gray",
      borderWidth: "thin",
    },
    panel: {
      backgroundColor: "rgb(204,202,200)",
      fontWeight: "bold",
    },
    panelContent: {
      fontWeight: "lighter",
    },
    switchOption: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "lighter",
    },
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16} className="card-rows" style={styles.body}>
        <Col span={16} className="card-cols">
          <Card title="General" bordered={false}>
            <Collapse
              onChange={onChange}
              expandIconPosition={expandIconPosition}
            >
              <Panel
                header="Settings 1"
                key="1"
                extra={genExtra()}
                style={styles.panel}
              >
                <div style={styles.switchOption}>
                  <>Dark Mode</>
                  <Switch defaultChecked onChange={onSwitchChange} />
                </div>
              </Panel>
              <Panel
                header="Settings 2"
                key="2"
                extra={genExtra()}
                style={styles.panel}
              >
                <div style={styles.panelContent}>Add Settings Options Here</div>
              </Panel>
              <Panel
                header="Settings 3"
                key="3"
                extra={genExtra()}
                style={styles.panel}
              >
                <div style={styles.panelContent}>Add Settings Options Here</div>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSettings;
