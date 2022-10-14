import React, { useState, useRef } from "react";
import { Tabs, Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const VisulisationNagivation = () => {
  const [items, setItems] = useState([
    { label: "Male vs Female", key: "item-1", children: "content-1" },
    { label: "Another view", key: "item-2", children: "content-2" },
    { label: "Pie chart", key: "item-3", children: "content-3" },
  ]);
  const newTabIndex = useRef(0);
  const [activeKey, setActiveKey] = useState("item-1");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: "Untitled",
        children: "Enter a new visulisation here!",
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
      content: "Some descriptions",
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
    let item = items.find((i) => i.key == activeKey);
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
        title={"Rename '" + items.find((i) => i.key == activeKey)?.label + "'"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="New name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={(e) => {
          onEdit(e.toString());
        }}
        items={items}
        onTabClick={(e) => clicked(e.toString())}
      />
    </div>
  );
};

export default VisulisationNagivation;
