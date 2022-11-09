import React, { useState, useRef, useEffect } from "react";
import { Tabs, Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import GraphGrid from "./GraphGrid";
import Cookies from "universal-cookie";
import CreateGraph from "./CreateGraph";

interface Props {
  mock: boolean;
}

const VisualisationNavigation = () => {
  const [graphContent, setGraphContent] = useState<any>({
    "0": [
      {
        type: "PIE",
        programType: "ALL",
        graphType: "NATIONALITY",
        data: undefined,
      },
      {
        type: "BAR",
        programType: "ALL",
        graphType: "gender",
        stack: false,
        data: undefined,
      },
      {
        type: "BAR",
        programType: "MAC",
        graphType: "gender",
        stack: true,
        data: undefined,
      },
    ],
  });
  const defaultItems = [
    {
      label: "Male vs Female",
      key: "0",
      children: (
        <GraphGrid
          graphKey={"0"}
          graphContent={graphContent}
          setGraphContent={setGraphContent}
        />
      ),
    },
    {
      label: "Another view",
      key: "1",
      children: (
        <GraphGrid
          graphKey={"1"}
          graphContent={graphContent}
          setGraphContent={setGraphContent}
        />
      ),
    },
    {
      label: "Pie chart",
      key: "2",
      children: (
        <GraphGrid
          graphKey={"2"}
          graphContent={graphContent}
          setGraphContent={setGraphContent}
        />
      ),
    },
  ];
  const cookies = new Cookies();
  const [items, setItems] = useState(defaultItems);
  const newTabIndex = useRef(3);

  const [activeKey, setActiveKey] = useState("item-1");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  const setCookie = () => {
    // cookies.set("items", items, { path: "/" });
  };

  useEffect(() => {
    let cookieItems = cookies.get("items");
    if (cookieItems) {
      console.log(items);
      console.log("Getting cookie");
      console.log(cookieItems);
      setItems(cookieItems);
      newTabIndex.current += Number(cookieItems[cookieItems.length - 1].key);
    }
  }, []);

  // useEffect(() => {
  //   if (firstUpdate.current) {
  //     firstUpdate.current = false;
  //     return;
  //   }
  //   console.log("Updating cookie");
  //   console.log(items);
  //   setCookie();
  // }, [items]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: "Untitled",
        children: <GraphGrid key={newActiveKey} graphContent={graphContent} />,
        key: newActiveKey,
      },
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
    setGraphContent([...graphContent, delete graphContent[targetIndex]]);
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
        items.find((i) => i.key == targetKey)?.label +
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
    let item = items.find((i: any) => i.key == activeKey);
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
          "Rename '" + items.find((i: any) => i.key == activeKey)?.label + "'"
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
