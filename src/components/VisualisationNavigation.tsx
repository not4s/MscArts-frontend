import React, { useState, useRef } from "react";
import { Tabs, Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import GraphGrid from "./GraphGrid";
import { GraphInterface } from "../constants/graphs";

const VisualisationNavigation = () => {
  const [graphContent, setGraphContent] = useState<GraphInterface[][]>([
    [
      {
        type: "PIE",
        programType: "ALL",
        layout: {
          i: "layout-1",
          w: 4,
          h: 2,
          x: 0,
          y: 0,
        },
        graphType: "nationality",
        data: undefined,
        title: "Nationality Pie Chart",
        top: 10,
      },
      {
        type: "BAR",
        layout: {
          i: "layout-2",
          w: 4,
          h: 2,
          x: 4,
          y: 0,
        },
        programType: "ALL",
        graphType: "gender",
        stack: false,
        data: undefined,
        title: "Gender Bar Chart (ALL)",
      },
      {
        type: "BAR",
        layout: {
          i: "layout-3",
          w: 4,
          h: 2,
          x: 8,
          y: 2,
        },
        programType: "MAC",
        graphType: "gender",
        stack: true,
        data: undefined,
        title: "Gender Bar Chart (MAC)",
      },
    ],
    [],
    [],
  ]);

  const setGraphContentByKey = (
    key: number,
    newGraphs: GraphInterface[]
  ): void => {
    let newGraphContent = [...graphContent];
    newGraphContent[key] = newGraphs;
    setGraphContent(newGraphContent);
  };

  const makeGraphGrid = (index: number, graph: GraphInterface[][]) => {
    return (
      <GraphGrid
        graphContent={graph}
        graphIndex={index}
        setGraphContent={setGraphContentByKey}
      />
    );
  };

  const defaultItems = [
    {
      label: "Male vs Female",
      key: "0",
      children: makeGraphGrid(0, graphContent),
    },
    {
      label: "Another view",
      key: "1",
      children: makeGraphGrid(1, graphContent),
    },
    {
      label: "Pie chart",
      key: "2",
      children: makeGraphGrid(2, graphContent),
    },
  ];

  const [items, setItems] = useState(defaultItems);
  const newTabIndex = useRef(3);

  const [activeKey, setActiveKey] = useState("item-1");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  React.useEffect(() => {
    let newItems = [...items];

    for (let i = 0; i < items.length; i++) {
      newItems[i]["children"] = makeGraphGrid(i, graphContent);
    }

    setItems(newItems);
  }, [graphContent]);

  const add = () => {
    setGraphContent([...graphContent, []]);
    const newActiveKey: number = newTabIndex.current++;
    const newActiveKeyString: string = String(newActiveKey);
    setItems([
      ...items,
      {
        label: "Untitled",
        children: (
          <GraphGrid
            graphIndex={newActiveKey}
            graphContent={graphContent}
            setGraphContent={setGraphContentByKey}
          />
        ),
        key: newActiveKeyString,
      },
    ]);
    setActiveKey(newActiveKeyString);
  };

  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    let newGraphContent = [...graphContent];
    delete newGraphContent[targetIndex];

    setGraphContent(newGraphContent);

    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
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
    console.log(targetKey);
    console.log(activeKey);
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
          "Rename '" + items.find((i: any) => i.key === activeKey)?.label + "'"
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
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={(e: any) => {
          onEdit(e.toString());
        }}
        items={items}
        onTabClick={(e: any) => clicked(e.toString())}
      />
    </div>
  );
};

export default VisualisationNavigation;
