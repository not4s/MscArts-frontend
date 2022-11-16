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
      label: "Male vs Female",
      key: "item-0",
      graph: [
        {
          type: "PIE",
          programType: "ALL",
          layout: {
            i: "layout-0",
            w: 8,
            h: 6,
            x: 18,
            y: 0,
          },
          decisionStatus: "ALL",
          graphType: "nationality",
          data: undefined,
          title: "Nationality Pie Chart",
          top: 10,
        },
        {
          type: "BAR",
          layout: {
            i: "layout-1",
            w: 16,
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
          title: "Decision Status w/ Fee Status Bar Chart (MAC)",
        },
        {
          type: "BAR",
          layout: {
            i: "layout-2",
            w: 16,
            h: 6,
            x: 0,
            y: 6,
          },
          programType: "ALL",
          graphType: "gender",
          decisionStatus: "ALL",
          combined: true,
          data: undefined,
          title: "Gender Bar Chart (ALL)",
        },
        {
          type: "LINE",
          layout: {
            i: "layout-3",
            w: 4,
            h: 2,
            x: 4,
            y: 2,
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
    {
      label: "Hello",
      key: "item-1",
      graph: [],
    },
    {
      label: "Pie Chart",
      key: "item-2",
      graph: [],
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
  const [activeKey, setActiveKey] = useState("tab-0");
  const [keyCounter, setKeyCounter] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  React.useEffect(() => {
    let newItems = makeTabItem([...graphContent]);
    setItems(newItems);

    if (newItems.length > keyCounter) {
      setKeyCounter(newItems.length);
    }

    if (newItems.length > 0) {
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
    let item = items.find((i: any) => i.key === activeKey);
    if (item != null) {
      item.label = newName;
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
