import React, { useState } from "react";
import {
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Select, Tag } from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import Graph from "./Graph";
import PieGraph from "./PieGraph";

const { Option } = Select;
const degreeTypes = ["ALL", "MAC", "AIML", "MCSS", "MCS"];

const CreateGraph = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [graphType, setGraphType] = useState("");
  const [form] = Form.useForm();
  const [stacked, setStacked] = useState(true);
  const [visualType, setVisualType] = useState("");
  const [programType, setProgramType] = useState("");


  const createBarChart = () => {
    //TODO
    props.setGraphs([...props.graphs, <Graph programType={programType} graphType={visualType} stack={stacked} />]);
  };

  const createPieChart = () => {
    props.setGraphs([...props.graphs, <PieGraph programType={programType} graphType={visualType}/>]);
  }

  const handleOk = () => {
    form.submit();
    if (!Object.values(form.getFieldsValue()).includes(undefined)) {
      setModalOpen(false);
      var type = form.getFieldValue("Visulisation");
      switch (type) {
        case "BAR":
          createBarChart();
          break;
        case "PIE":
          createPieChart();
          break;
        default:
      }
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setGraphType("");
  };

  return (
    <>
      <Modal
        title="Create a new visulisation"
        open={isModalOpen}
        onOk={handleOk}
        okText="Submit"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="Visulisation" rules={[{ required: true }]}>
            <Select
              placeholder="Select visulisation type"
              style={{ width: 240 }}
              onChange={(value) => setGraphType(value)}
            >
              <Option value="BAR">
                <BarChartOutlined /> Bar Chart
              </Option>
              <Option value="PIE">
                <PieChartOutlined /> Pie Chart
              </Option>
              <Option value="TABLE">
                <TableOutlined /> Table{" "}
              </Option>
            </Select>
          </Form.Item>

          {graphType === "BAR" ? (
            <>
              {/* ---------------------------------------- */}

              <Form.Item
                name="Degree"
                rules={[{ required: true }]}
                extra="This is the degree from which to access the data"
            >
              <Select
                  placeholder="Select Degree"
                  style={{ width: 240 }}
                  onChange={(value) => setProgramType(value)}
              >
                {degreeTypes.map(type => <Option value={type}>{type}</Option>)}
              </Select>
            </Form.Item>

              <Form.Item
                name="Columns"
                rules={[{ required: true }]}
                extra="E.g. 'Gender' will create columns for 'Male' and 'Female' respectfully"
              >
                <Select
                  placeholder="Select columns"
                  style={{ width: 240 }}
                  onChange={(value) => setVisualType(value)}
                >
                  <Option value="gender">Gender</Option>
                  <Option value="application_folder_fee_status">Fee Status</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Checkbox onChange={e => setStacked(e.target.checked)} checked={stacked}>
                  Show Combined?
                </Checkbox>
              </Form.Item>

              {/* ---------------------------------------- */}

              {/* <Form.Item
                name="Grouping"
                rules={[{ required: false }]}
                extra="E.g. 'Gender' will display the difference between 'Male' and 'Female' within a single column"
              >
                <Select
                  placeholder="Select grouping (optional)"
                  style={{ width: 240 }}
                  // onChange={(value: string) => setGraphType(value)}
                >
                  <Option value="GENDER">Gender</Option>
                  <Option value="COURSE">Course</Option>
                  <Option value="FEE_STATUS">Fee Status</Option>
                </Select>
              </Form.Item> */}

              {/* ---------------------------------------- */}
            </>
          ) : (
            <></>
          )}

          {graphType === "PIE" ?
          <>
            <Form.Item
                name="Degree"
                rules={[{ required: true }]}
                extra="This is the degree from which to access the data"
            >
              <Select
                  placeholder="Select Degree"
                  style={{ width: 240 }}
                  onChange={(value) => setProgramType(value)}
              >
                {degreeTypes.map(type => <Option value={type}>{type}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item
                name="Filter type"
                rules={[{ required: true }]}
            >
              <Select
                  placeholder="Select Filter"
                  style={{ width: 240 }}
                  onChange={(value) => setVisualType(value)}
              >
                <Option value="ETHNICITY">Ethnicity</Option>
                <Option value="NATIONALITY">Nationality</Option>
              </Select>
            </Form.Item>
          </> :
          <></>}
        </Form>
      </Modal>
      <Button type="dashed" onClick={() => setModalOpen(true)}>
        <PlusOutlined />
      </Button>
    </>
  );
};

export default CreateGraph;
