import { Card, Col, Row, Button, Modal, Switch } from "antd";
import React, { useState } from "react";

const GeneralSettings = () => {
  const state = { visible: false };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
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
                <Button type="primary" onClick={showModal}>
                  Open
                </Button>
              </div>
            </body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSettings;
