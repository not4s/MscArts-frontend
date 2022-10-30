import { Card, Col, Row, Button, Modal } from "antd";
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
                <>Display</>
                <Button type="primary" onClick={showModal}>
                  Open
                </Button>
              </div>
              <p
                style={{
                  padding: "8px",
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
