import { Card, Col, Row, Button, Modal, Switch } from "antd";
import React, { useState } from "react";

const GeneralSettings = () => {
  const state = { visible: false };
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const showModal1 = () => {
    setIsModal1Open(true);
  };

  const handleOk1 = () => {
    setIsModal1Open(false);
  };

  const handleCancel1 = () => {
    setIsModal1Open(false);
  };

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const handleOk2 = () => {
    setIsModal2Open(false);
  };

  const handleCancel2 = () => {
    setIsModal2Open(false);
  };

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
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16} className="card-rows" style={styles.body}>
        <Col span={16} className="card-cols">
          <Card title="General" bordered={false}>
            <body className="card-content">
              <div className="g-settings-card" style={styles.settingsCard}>
                <>Display</>
                <Button type="primary" onClick={showModal1}>
                  Open
                </Button>
              </div>
              <div style={styles.settingsCard}>
                <>Option 2</>
                <Button type="primary" onClick={showModal2}>
                  Open
                </Button>
              </div>
            </body>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Display"
        open={isModal1Open}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              marginBottom: "10px",
              border: "solid",
              borderColor: "gray",
              borderWidth: "thin",
            }}
          >
            <>Dark Mode</>
            <Switch defaultChecked onChange={onChange} />
          </div>
        </div>
      </Modal>
      <Modal
        title="Option 2"
        open={isModal2Open}
        onOk={handleOk2}
        onCancel={handleCancel2}
      ></Modal>
    </div>
  );
};

export default GeneralSettings;
