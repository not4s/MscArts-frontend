import React, { useRef, useState } from "react";
import { Input, Modal, Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import GraphGrid from "./GraphGrid";
import { Graph, GraphGridInterface } from "../constants/graphs";
import Cookies from "universal-cookie";

const VisualisationNavigation = () => {
  const cookies = new Cookies();
  const defaultItems2: GraphGridInterface[] = [
    {
      label: "Application Targets",
      key: "item-0",
      graph: [
        {
          type: "BAR",
          layout: {
            i: "layout-1",
            w: 8,
            h: 6,
            x: 0,
            y: 0,
          },
          programType: "MAC",
          graphType: "combined_fee_status",
          decisionStatus: "ALL",
          stack: "decision_status",
          combined: true,
          data: undefined,
          title: "Applications Target Bar Chart (MAC)",
          target: [],
        },
        {
          type: "BAR",
          layout: {
            i: "layout-2",
            w: 8,
            h: 6,
            x: 8,
            y: 0,
          },
          programType: "AIML",
          graphType: "combined_fee_status",
          decisionStatus: "ALL",
          stack: "decision_status",
          target: [],
          combined: true,
          data: undefined,
          title: "Applications Target Bar Chart (AIML)",
        },
        {
          type: "BAR",
          layout: {
            i: "layout-3",
            w: 8,
            h: 6,
            x: 16,
            y: 0,
          },
          programType: "MCS",
          graphType: "combined_fee_status",
          decisionStatus: "ALL",
          stack: "decision_status",
          target: [],
          combined: true,
          data: undefined,
          title: "Applications Target Bar Chart (MCS)",
        },
      ],
    },
    {
      label: "Pie Charts",
      key: "item-1",
      graph: [
        {
          type: "PIE",
          programType: "ALL",
          layout: {
            i: "layout-0",
            w: 8,
            h: 6,
            x: 0,
            y: 0,
          },
          decisionStatus: "ALL",
          graphType: "nationality",
          data: undefined,
          title: "Nationality Pie Chart (ALL)",
          top: 10,
        },
        {
          type: "PIE",
          programType: "ALL",
          layout: {
            i: "layout-1",
            w: 8,
            h: 6,
            x: 8,
            y: 0,
          },
          decisionStatus: "ALL",
          graphType: "ethnicity",
          data: undefined,
          title: "Ethnicity Pie Chart (ALL)",
          top: 10,
        },
        {
          type: "PIE",
          programType: "ALL",
          layout: {
            i: "layout-2",
            w: 8,
            h: 6,
            x: 16,
            y: 0,
          },
          decisionStatus: "ALL",
          graphType: "gender",
          data: undefined,
          title: "Gender Pie Chart (ALL)",
        },
      ],
    },
    {
      label: "Trends",
      key: "item-2",
      graph: [
        {
          type: "LINE",
          layout: {
            i: "layout-3",
            w: 8,
            h: 6,
            x: 0,
            y: 0,
          },
          programType: "ALL",
          decisionStatus: "all",
          graphType: "hi",
          data: undefined,
          title: "Line graph",
          frequency: 10,
          breakdown: "year",
        },
      ],
    },
  ];

  const [graphContent, setGraphContent] = useState<GraphGridInterface[]>(
    cookies.get("visualisations") || defaultItems2
  );

  const setGraphContentWithCookie = (content: GraphGridInterface[]) => {
    cookies.set(
      "visualisations",
      [...content].map(({ label, key, graph }: GraphGridInterface) => ({
        label,
        key,
        graph: [...graph].map((graph: Graph) => {
          let newG = { ...graph };
          newG["data"] = undefined;
          return newG;
        }),
      }))
    );

    setGraphContent(content);
  };

  const setGraphContentByKey = (key: number, newGraphs: Graph[]): void => {
    let newGraphContent = [...graphContent];
    newGraphContent[key].graph = newGraphs;
    setGraphContentWithCookie(newGraphContent);
  };

  const makeGraphGrid = (index: number, graph: Graph[]) => {
    return (
      <GraphGrid
        graphContent={graph}
        graphIndex={index}
        setGraphContent={setGraphContentByKey}
      />
    );
  };

  const makeTabItem = (graphs: GraphGridInterface[]): Tab[] => {
    let newItems: Tab[] = [...graphs].map(
      ({ label, key, graph }: GraphGridInterface, index: number) => ({
        label,
        key,
        children: makeGraphGrid(index, graph),
      })
    );

    return newItems;
  };

  const [items, setItems] = useState<Tab[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [keyCounter, setKeyCounter] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  React.useEffect(() => {
    console.log(graphContent);
    let newItems = makeTabItem([...graphContent]);
    setItems(newItems);

    if (newItems.length > keyCounter) {
      setKeyCounter(newItems.length);
    }

    if (activeKey === "" && newItems.length > 0) {
      setActiveKey(newItems[0].key);
    }
  }, [graphContent]);

  const add = () => {
    const newGraphContent: GraphGridInterface[] = [
      ...graphContent,
      { label: "Untitled", key: `item-${keyCounter}`, graph: [] },
    ];
    setGraphContentWithCookie(newGraphContent);
    setItems(makeTabItem(newGraphContent));
    setKeyCounter((old) => old + 1);
  };

  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    let newGraphContent = [...graphContent];
    newGraphContent.splice(targetIndex, 1);

    setGraphContentWithCookie(newGraphContent);

    console.log(newGraphContent);

    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(makeTabItem(newGraphContent));
  };

  const onEdit = (targetKey: string) => {
    if (items.map((i) => i.key).includes(targetKey)) {
      showDeleteConfirm(targetKey);
    } else {
      add();
    }
  };

  const showDeleteConfirm = (targetKey: string) => {
    confirm({
      title:
        "Are you sure delete '" +
        items.find((i) => i.key === targetKey)?.label +
        "'?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        remove(targetKey);
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  const clicked = (targetKey: string) => {
    if (targetKey === activeKey) {
      setModalOpen(true);
    }
  };

  const handleOk = () => {
    let targetIndex = items.findIndex((i: any) => i.key === activeKey);

    let newGraphContent = [...graphContent];

    if (targetIndex != -1) {
      newGraphContent[targetIndex].label = newName;
      setGraphContentWithCookie(newGraphContent);
      setItems(makeTabItem(newGraphContent));
    }

    setNewName("");
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Modal
        title={
          "Rename '" + items.find((i: Tab) => i.key === activeKey)?.label + "'"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="New name..."
          value={newName}
          onChange={(e: any) => setNewName(e.target.value)}
        />
      </Modal>
      <Tabs
        onChange={setActiveKey}
        activeKey={activeKey}
        type="editable-card"
        onEdit={(e: any) => {
          onEdit(e.toString());
        }}
        items={items}
        onTabClick={(e: any) => {
          console.log(e);
          clicked(e.toString());
        }}
      />
    </div>
  );
};

export default VisualisationNavigation;
