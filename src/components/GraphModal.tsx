import React, { useState } from "react";
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
  BaseGraphInterface,
  DecisionStatus,
  Graph,
  LineGraphInterface,
  PieGraphInterface,
} from "../constants/graphs";
import { Layout } from "react-grid-layout";

const { Option } = Select;
const degreeTypes = ["ALL", "MAC", "AIML", "MCSS", "MCS"];

interface GraphModalProps {
  submitAction: (newGraph: Graph) => void;
  editInput?: Graph | undefined;
  isEdit: boolean;
}

const makeTitle = (graph: Graph) => {
  if (graph.type == "BAR") {
  }
};

const GraphModal: React.FC<GraphModalProps> = ({
  submitAction,
  editInput = undefined,
  isEdit,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  /* Base Graph Values */
  const [title, setTitle] = useState("");
  const [layout, setLayout] = useState<Layout>({
    i: `layout-`,
    w: 10,
    h: 6,
    x: 0,
    y: 0,
  });
  const [type, setType] = useState("");
  const [programType, setProgramType] = useState("");
  const [year, setYear] = useState<number>(2022);
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>("all");
  const [customDecision, setCustomDecision] = useState<string[]>([]);
  const [primary, setPrimary] = useState("");

  /* Bar Graph Values */
  const [stacked, setStacked] = useState(true);
  const [secondary, setSecondary] = useState("");
  const [plotTarget, setPlotTarget] = useState(false);

  /* Pie Graph Values */
  const [top, setTop] = useState(0);

  /* Line Graph Values */
  const [breakdown, setBreakdown] = useState("Year");
  const [frequency, setFrequency] = useState(3);

  React.useEffect(() => {
    if (editInput !== undefined) {
      /* Set the Shared Inputs */
      setType(editInput.type);
      setTitle(editInput.title);
      setProgramType(editInput.programType);
      setPrimary(editInput.primary);
      setLayout(editInput.layout);
      setCustomDecision(
        editInput.customDecision ? editInput.customDecision : []
      );

      /* Set the Specialized Case */
      if (editInput.type === "PIE") {
        const pieInput: PieGraphInterface = editInput;
        setTop(pieInput.top ? pieInput.top : 0);
      } else if (editInput.type === "BAR") {
        const barInput: BarGraphInterface = editInput;
        setStacked(barInput.combined ? barInput.combined : false);
        setSecondary(barInput.secondary ? barInput.secondary : "");
        setPlotTarget(barInput.target !== undefined ? true : false);
      } else if (editInput.type === "LINE") {
        const lineInput: LineGraphInterface = editInput;
        setBreakdown(lineInput.breakdown ? lineInput.breakdown : "Year");
        setFrequency(lineInput.frequency ? lineInput.frequency : 3);
      }
      /* Open the Modal */
      setModalOpen(true);
    }
  }, [editInput]);

  const handleOk = () => {
    form.submit();
    if (!Object.values(form.getFieldsValue()).includes(undefined)) {
      setModalOpen(false);

      let baseGraph: BaseGraphInterface = {
        type: "BAR",
        title: title === "" ? "Graph" : title,
        primary: primary,
        data: undefined,
        year: year,
        layout: layout,
        programType: programType,
        decisionStatus: decisionStatus,
        customDecision: decisionStatus === "custom" ? customDecision : [],
      };

      let finalGraph: Graph = { ...baseGraph };

      switch (type) {
        case "BAR":
          finalGraph = {
            ...finalGraph,
            type,
            secondary: secondary === "" ? undefined : secondary,
            combined: stacked,
            target: plotTarget ? [] : undefined,
          };
          break;
        case "PIE":
          finalGraph = {
            ...finalGraph,
            type,
            top: top,
          };
          break;
        case "LINE":
          finalGraph = {
            ...finalGraph,
            type,
            breakdown,
            frequency,
          };
        default:
      }
      submitAction(finalGraph);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setSecondary("");
    setDecisionStatus("all");
    setType("");
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
          <Form.Item
            name="Visualisation"
            rules={[{ required: true }]}
            initialValue={type}
          >
            <Select
              placeholder="Select visualisation type"
              style={{ width: 240 }}
              onChange={(value) => {
                console.log(value);
                setType(value);
              }}
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
              <Option value="TABLE" disabled>
                <TableOutlined /> Table
              </Option>
            </Select>
          </Form.Item>

          {type !== "" ? (
            <>
              <Form.Item initialValue={title}>
                <Input
                  placeholder="Chart Title (Optional)"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </Form.Item>

              <Form.Item initialValue={2022}>
                <Select
                  defaultValue={2022}
                  value={year}
                  onChange={(e) => setYear(e)}
                  options={[2022, 2021, 2020].map((v) => ({
                    value: v,
                    label: `Admissions Cycle ${v}`,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                label="Decision Status"
                name="decisionStatus"
                initialValue={decisionStatus}
              >
                <Radio.Group
                  onChange={(e) => setDecisionStatus(e.target.value)}
                >
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="live">Live</Radio.Button>
                  <Radio.Button value="not_live">Not Live</Radio.Button>
                  <Radio.Button value="custom">Custom</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {decisionStatus === "custom" ? (
                <Form.Item
                  name="customDecisions"
                  rules={[{ required: true }]}
                  initialValue={customDecision}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Decision Status to filter"
                    onChange={(e) => setCustomDecision(e)}
                    options={DECISION_STATUS_OPTIONS.map((v) => ({
                      label: v,
                      value: v,
                    }))}
                  ></Select>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item
                name="Degree"
                rules={[{ required: true }]}
                extra="This is the degree from which to access the data"
                initialValue={programType}
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
                initialValue={primary}
              >
                <Select
                  placeholder="Select columns"
                  style={{ width: 240 }}
                  onChange={(value) => {
                    if (value !== "combined_fee_status") {
                      setPlotTarget(false);
                    }
                    setPrimary(value);
                  }}
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
            </>
          ) : (
            <></>
          )}

          {type === "BAR" ? (
            <>
              {primary === "combined_fee_status" ? (
                <Form.Item initialValue={plotTarget}>
                  <Checkbox
                    onChange={(e) => setPlotTarget(e.target.checked)}
                    checked={plotTarget}
                  >
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
                  secondary !== "" && secondary === primary ? "error" : ""
                }
                initialValue={secondary}
                help={
                  secondary !== "" && secondary === primary
                    ? "Columns and Stack Type cannot be the same!"
                    : "E.g. 'Fee Status' will breakdown the Genders into their fee statuses"
                }
              >
                <Select
                  placeholder="Select Stack Type"
                  style={{ width: 240 }}
                  onChange={(value) => setSecondary(value)}
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

              <Form.Item initialValue={stacked}>
                <Checkbox
                  onChange={(e) => setStacked(e.target.checked)}
                  checked={stacked}
                >
                  Show Combined?
                </Checkbox>
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {type === "PIE" ? (
            <>
              <Form.Item
                name="Display Top X"
                label="Display Top"
                initialValue={top}
              >
                <InputNumber
                  min={0}
                  value={top}
                  onChange={(e: any) => {
                    setTop(e);
                  }}
                />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
          {type === "LINE" ? (
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
            </>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
      {!isEdit ? (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setModalOpen(true)}
          style={{ marginRight: "5px" }}
        >
          Add Graph
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default GraphModal;
