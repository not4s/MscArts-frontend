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
  DatePicker,
} from "antd";
import {
  APPLICANT_COLUMN_MAPPING,
  DECISION_STATUS_OPTIONS,
} from "../constants/applicant";
import {
  BarGraphInterface,
  BaseGraphInterface,
  Graph,
  PieGraphInterface,
} from "../constants/graphs";
import { Layout } from "react-grid-layout";
import { APIService } from "../services/API";

const { Option } = Select;
const degreeTypes = ["ALL", "MAC", "AIML", "MCSS", "MCS"];

interface GraphModalProps {
  submitAction: (newGraph: Graph) => void;
  editInput?: Graph | undefined;
  resetEdit?: () => void;
  isEdit?: boolean;
}

const makeTitle = (graph: Graph) => {
  if (graph.type == "BAR") {
  }
};

const GraphModal: React.FC<GraphModalProps> = ({
  submitAction,
  editInput,
  resetEdit,
  isEdit = false,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<Graph>();

  /* Base Graph Values */
  const [layout, setLayout] = useState<Layout>({
    i: `layout-`,
    w: 10,
    h: 6,
    x: 0,
    y: 0,
  });

  const type = Form.useWatch("type", form);
  const decisionStatus = Form.useWatch("decisionStatus", form);
  const primary = Form.useWatch("primary", form);
  const secondary = Form.useWatch("secondary", form);
  const cycle = Form.useWatch("cycle", form);

  /* Line Graph Values */
  const [admissionCycles, setAdmissionCycles] = useState([
    "23",
    "22",
    "21",
    "20",
  ]);

  React.useEffect(() => {
    if (editInput !== undefined) {
      console.log(editInput);
      form.setFieldsValue(editInput);
      setLayout(editInput.layout);

      /* Open the Modal */
      setModalOpen(true);
    }
  }, [editInput]);

  const api = new APIService();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    api.getAllAttributes().then((res) => {
      const cycles = res.data.admissions_cycle.map((v: any) =>
        String(v).slice(-2)
      );
      setAdmissionCycles(cycles);
    });
  }, []);

  const handleOk = (values: Graph) => {
    setModalOpen(false);
    console.log(values);
    const {
      type,
      title,
      primary,
      year,
      programType,
      decisionStatus,
      customDecision,
    } = values;

    let baseGraph: BaseGraphInterface = {
      type: type,
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
        const barValues: BarGraphInterface = values;
        finalGraph = {
          ...finalGraph,
          secondary: barValues.secondary,
          combined: barValues.combined,
          target: barValues.target,
        };
        break;
      case "PIE":
        const pieValues: PieGraphInterface = values;
        finalGraph = {
          ...finalGraph,
          top: pieValues.top,
        };
        break;
      case "LINE":
        const lineValues: any = values;

        console.log(lineValues["dateRange"]);

        const startDate = String(lineValues["dateRange"]?.[0]?.format("L"));
        const endDate = String(lineValues["dateRange"]?.[1]?.format("L"));

        finalGraph = {
          ...finalGraph,
          breakdown: lineValues.breakdown,
          frequency: lineValues.frequency,
          series: primary,
          cycleYears: lineValues.cycleYears,
          startDate,
          endDate,
          cycle: lineValues.cycle,
          cumulative: lineValues.cumulative,
        };
      default:
    }
    submitAction(finalGraph);
  };

  const handleCancel = () => {
    setModalOpen(false);
    if (editInput !== undefined && resetEdit) {
      resetEdit();
    }
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Create a new visualisation"
        open={isModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleOk(values);
            })
            .catch((info) => {
              console.log("Validation Fail: ", info);
            });
        }}
        okText="Submit"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="type" rules={[{ required: true }]}>
            <Select
              placeholder="Select visualisation type"
              style={{ width: 240 }}
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

          {type ? (
            <>
              <Form.Item name="title">
                <Input placeholder="Chart Title (Optional)" />
              </Form.Item>

              {type !== "LINE" ? (
                <Form.Item initialValue={2022}>
                  <Select
                    defaultValue={2022}
                    options={[2022, 2021, 2020].map((v) => ({
                      value: v,
                      label: `Admissions Cycle ${v}`,
                    }))}
                  ></Select>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item
                label="Decision Status"
                name="decisionStatus"
                initialValue={"all"}
              >
                <Radio.Group>
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="live">Live</Radio.Button>
                  <Radio.Button value="not_live">Not Live</Radio.Button>
                  <Radio.Button value="custom">Custom</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {decisionStatus === "custom" ? (
                <Form.Item name="customDecision" rules={[{ required: true }]}>
                  <Select
                    mode="multiple"
                    placeholder="Select Decision Status to filter"
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
                name="programType"
                rules={[{ required: true }]}
                extra="This is the degree from which to access the data"
              >
                <Select placeholder="Select Degree" style={{ width: 240 }}>
                  {degreeTypes.map((type, index) => (
                    <Option key={`degree-${index}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {cycle === "cycle" && type === "LINE" ? (
                <></>
              ) : (
                <Form.Item
                  name="primary"
                  rules={[{ required: true }]}
                  extra="E.g. 'Gender' will create columns for 'Male' and 'Female' respectfully"
                >
                  <Select placeholder="Select columns" style={{ width: 240 }}>
                    {Object.keys(APPLICANT_COLUMN_MAPPING).map((k, index) => {
                      return (
                        <Option key={index} value={APPLICANT_COLUMN_MAPPING[k]}>
                          {k}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
            </>
          ) : (
            <></>
          )}

          {type === "BAR" ? (
            <>
              {primary === "combined_fee_status" ? (
                <Form.Item name="target" valuePropName="checked">
                  <Checkbox>Plot Targets</Checkbox>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item
                name="secondary"
                hasFeedback
                validateStatus={
                  secondary !== "" && secondary === primary ? "error" : ""
                }
                help={
                  secondary !== "" && secondary === primary
                    ? "Columns and Stack Type cannot be the same!"
                    : "E.g. 'Fee Status' will breakdown the Genders into their fee statuses"
                }
              >
                <Select placeholder="Select Stack Type" style={{ width: 240 }}>
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

              <Form.Item name="combined" valuePropName="checked">
                <Checkbox>Show Combined?</Checkbox>
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {type === "PIE" ? (
            <>
              <Form.Item name="top" label="Display Top">
                <InputNumber min={0} />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
          {type === "LINE" ? (
            <>
              <Form.Item label="Cycle" name="cycle" initialValue={"cycle"}>
                <Radio.Group>
                  <Radio.Button value="cycle">Per Admission Cycle</Radio.Button>
                  <Radio.Button value="relative">
                    Relative To Today
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              {cycle === "cycle" ? (
                <>
                  <Form.Item name="cycleYears" rules={[{ required: true }]}>
                    <Select
                      mode="multiple"
                      placeholder="Select Admission Cycles to Compare"
                      options={admissionCycles.map((v) => ({
                        label: "Admission Cycle 20" + v,
                        value: v,
                      }))}
                    ></Select>
                  </Form.Item>

                  <Form.Item
                    name="dateRange"
                    extra="By default will show a whole cycle"
                    rules={[{ required: false }]}
                    initialValue=""
                  >
                    <RangePicker />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="frequency"
                    rules={[{ required: true }]}
                    extra="Return the trend for the previous (frame) number of (period)s i.e. 3 weeks"
                  >
                    <Select placeholder="Time Frame" style={{ width: 240 }}>
                      {[...Array(24).keys()].map((type) => (
                        <Option key={`${type + 1}`} value={type + 1}>
                          {type + 1}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )}
              <Form.Item
                name="breakdown"
                rules={[{ required: true }]}
                extra="How to split up the information"
                initialValue={"Month"}
              >
                <Select placeholder="Time Period" style={{ width: 240 }}>
                  {["Day", "Week", "Month", "Year"].map((type) => (
                    <Option key={`${type}`} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="cumulative" valuePropName="checked">
                <Checkbox>Cumulative</Checkbox>
              </Form.Item>
            </>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
      {!isEdit ? (
        <Button
          className="add-graph-button"
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setModalOpen(true)}
          style={{ marginRight: "5px" }}
        >
          Graph
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default GraphModal;
