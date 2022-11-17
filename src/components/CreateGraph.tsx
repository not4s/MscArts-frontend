import React, { useEffect, useState } from "react";
import {
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  PlusOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Modal,
  Select,
  Input,
  InputNumber,
  Radio,
} from "antd";
import {
  APPLICANT_COLUMN_MAPPING,
  DECISION_STATUS_OPTIONS,
} from "../constants/applicant";
import {
  BarGraphInterface,
  Graph,
  LineGraphInterface,
  PieGraphInterface,
} from "../constants/graphs";

const { Option } = Select;
const degreeTypes = ["ALL", "MAC", "AIML", "MCSS", "MCS"];

interface CreateGraphProps {
  addGraph: (newGraph: Graph) => void;
  editInput?: Graph | undefined;
}

const CreateGraph: React.FC<CreateGraphProps> = ({
  addGraph,
  editInput = undefined,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [graphType, setGraphType] = useState("");
  const [form] = Form.useForm();
  const [stacked, setStacked] = useState(true);
  const [visualType, setVisualType] = useState("");
  const [programType, setProgramType] = useState("");
  const [stackType, setStackType] = useState("");
  const [decisionStatus, setDecisionStatus] = useState("ALL");
  const [plotTarget, setPlotTarget] = useState(false);
  const [title, setTitle] = useState("");
  const [top, setTop] = useState(0);
  const [breakdown, setBreakdown] = useState("Year");
  const [frequency, setFrequency] = useState(3);
  const [series, setSeries] = useState("all");

  useEffect(() => {
    if (editInput !== undefined) {
      /* Set the Shared Inputs */
      setGraphType(editInput.type);
      setTitle(editInput.title);
      setProgramType(editInput.programType);
      setVisualType(editInput.graphType);

      /* Set the Specialized Case */
      if (editInput.type === "PIE") {
        const pieInput: PieGraphInterface = editInput;
        setTop(pieInput.top ? pieInput.top : 0);
      } else if (editInput.type === "BAR") {
        const barInput: BarGraphInterface = editInput;
        setStacked(barInput.combined ? barInput.combined : false);
        setStackType(barInput.stack ? barInput.stack : "");
        setPlotTarget(barInput.target ? true : false);
      } else if (editInput.type === "LINE") {
        const lineInput: LineGraphInterface = editInput;
        setBreakdown(lineInput.breakdown ? lineInput.breakdown : "Year");
        setFrequency(lineInput.frequency ? lineInput.frequency : 3);
      }
    }
  }, []);

  const createBarChart = () => {
    addGraph({
      title: title === "" ? "Graph" : title,
      layout: {
        i: `layout-`,
        w: 10,
        h: 6,
        x: 0,
        y: 0,
      },
      type: "BAR",
      decisionStatus: decisionStatus,
      programType: programType,
      graphType: visualType,
      data: undefined,
      stack: stackType === "" ? undefined : stackType,
      combined: stacked,
      target: plotTarget ? [] : undefined,
    });
  };

  const createPieChart = () => {
    addGraph({
      title: title === "" ? "Graph" : title,
      layout: {
        i: `layout-`,
        w: 10,
        h: 6,
        x: 0,
        y: 0,
      },
      decisionStatus: decisionStatus,
      data: undefined,
      type: "PIE",
      programType: programType,
      graphType: visualType,
      top: top,
    });
  };

  const createLineChart = () => {
    addGraph({
      title: title,
      layout: {
        i: `layout-`,
        w: 10,
        h: 6,
        x: 0,
        y: 0,
      },
      type: "LINE",
      breakdown,
      frequency,
      data: undefined,
      programType: "",
      decisionStatus: "",
      graphType: "",
      series: series,
    });
  };

  const handleOk = () => {
    form.submit();
    if (!Object.values(form.getFieldsValue()).includes(undefined)) {
      setModalOpen(false);
      var type = form.getFieldValue("Visualisation");
      switch (type) {
        case "BAR":
          createBarChart();
          break;
        case "PIE":
          createPieChart();
          break;
        case "LINE":
          createLineChart();
          break;
        default:
      }
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setStackType("");
    setDecisionStatus("ALL");
    setGraphType("");
  };

  return (
    <>
      <Modal
        title="Create a new visualisation"
        open={isModalOpen}
        onOk={handleOk}
        okText="Submit"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="Visualisation" rules={[{ required: true }]}>
            <Select
              placeholder="Select visualisation type"
              style={{ width: 240 }}
              onChange={(value) => setGraphType(value)}
            >
              <Option value="BAR">
                <BarChartOutlined /> Bar Chart
              </Option>
              <Option value="PIE">
                <PieChartOutlined /> Pie Chart
              </Option>
              <Option value="LINE">
                <LineChartOutlined /> Line Trend
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
                  {degreeTypes.map((type, index) => (
                    <Option key={`degree-${index}`} value={type}>
                      {type}
                    </Option>
                  ))}
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
                  {Object.keys(APPLICANT_COLUMN_MAPPING).map((k, index) => {
                    return (
                      <Option key={index} value={APPLICANT_COLUMN_MAPPING[k]}>
                        {k}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              {visualType === "combined_fee_status" ? (
                <Form.Item>
                  <Checkbox onChange={(e) => setPlotTarget(e.target.checked)}>
                    Plot Targets
                  </Checkbox>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item
                name="Stack Type"
                hasFeedback
                validateStatus={
                  stackType !== "" && stackType === visualType ? "error" : ""
                }
                initialValue=""
                help={
                  stackType !== "" && stackType === visualType
                    ? "Columns and Stack Type cannot be the same!"
                    : "E.g. 'Fee Status' will breakdown the Genders into their fee statuses"
                }
              >
                <Select
                  placeholder="Select Stack Type"
                  style={{ width: 240 }}
                  defaultValue={""}
                  onChange={(value) => setStackType(value)}
                >
                  <Option value={""}>None</Option>
                  {Object.keys(APPLICANT_COLUMN_MAPPING).map((k, index) => {
                    return (
                      <Option key={index} value={APPLICANT_COLUMN_MAPPING[k]}>
                        {k}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <br></br>

              <Form.Item
                label="Decision Status"
                name="decisionStatus"
                initialValue={"ALL"}
              >
                <Radio.Group
                  defaultValue="ALL"
                  onChange={(e) => setDecisionStatus(e.target.value)}
                >
                  <Radio.Button value="ALL">All</Radio.Button>
                  <Radio.Button value="live">Live</Radio.Button>
                  <Radio.Button value="not_live">Not Live</Radio.Button>
                  <Radio.Button value="custom">Custom</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {decisionStatus === "custom" ? (
                <Form.Item name="customDecisions">
                  <Select
                    mode="multiple"
                    placeholder="Select Decision Status to filter"
                    onChange={(e) => console.log(e)}
                    options={DECISION_STATUS_OPTIONS.map((v) => ({
                      label: v,
                      value: v,
                    }))}
                  ></Select>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item>
                <Input
                  placeholder="Chart Title (Optional)"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Checkbox
                  onChange={(e) => setStacked(e.target.checked)}
                  checked={stacked}
                >
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

          {graphType === "PIE" ? (
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
                  {degreeTypes.map((type, index) => (
                    <Option key={`degree-${index}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="Filter type" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Filter"
                  style={{ width: 240 }}
                  onChange={(value) => setVisualType(value)}
                >
                  {Object.keys(APPLICANT_COLUMN_MAPPING).map((k, index) => {
                    return (
                      <Option key={index} value={APPLICANT_COLUMN_MAPPING[k]}>
                        {k}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name="Display Top X"
                label="Display Top"
                initialValue={0}
              >
                <InputNumber
                  min={0}
                  value={top}
                  onChange={(e: any) => {
                    setTop(e);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Decision Status"
                name="decisionStatus"
                initialValue={"ALL"}
              >
                <Radio.Group
                  defaultValue="ALL"
                  onChange={(e) => setDecisionStatus(e.target.value)}
                >
                  <Radio.Button value="ALL">All</Radio.Button>
                  <Radio.Button value="live">Live</Radio.Button>
                  <Radio.Button value="not_live">Not Live</Radio.Button>
                  <Radio.Button value="custom">Custom</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {decisionStatus === "custom" ? (
                <Form.Item name="customDecisions">
                  <Select
                    mode="multiple"
                    placeholder="Select Decision Status to filter"
                    onChange={(e) => console.log(e)}
                    options={DECISION_STATUS_OPTIONS.map((v) => ({
                      label: v,
                      value: v,
                    }))}
                  ></Select>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item>
                <Input
                  placeholder="Chart Title (Optional)"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
          {graphType === "LINE" ? (
            <>
              <Form.Item name="Time Period" rules={[{ required: true }]}>
                <Select
                  placeholder="Time Period"
                  style={{ width: 240 }}
                  onChange={(value) => setBreakdown(value)}
                >
                  {["Day", "Week", "Month", "Year"].map((type) => (
                    <Option key={`${type}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="Time Frame" rules={[{ required: true }]}>
                <Select
                  placeholder="Time Frame"
                  style={{ width: 240 }}
                  onChange={(value) => setFrequency(value)}
                  // extra="Return the trend for the previous (frame) number of (period)s i.e. 3 weeks"
                >
                  {[...Array(24).keys()].map((type) => (
                    <Option key={`${type}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="series" rules={[{ required: false }]}>
                <Select
                  placeholder="Compare"
                  style={{ width: 240 }}
                  onChange={(value: string) => setSeries(value.toLowerCase())}
                  // extra="Return the trend for the previous (frame) number of (period)s i.e. 3 weeks"
                >
                  {["All", "Gender", "Nationality"].map((type) => (
                    <Option key={`${type}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
      <Button
        icon={<PlusOutlined />}
        type="dashed"
        onClick={() => setModalOpen(true)}
        style={{ marginRight: "5px" }}
      >
        Add Graph
      </Button>
    </>
  );
};

export default CreateGraph;
