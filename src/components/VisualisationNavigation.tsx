import React, { useState } from "react";
import { Alert, Form, Menu, message, Select } from "antd";
import { Button, Dropdown, Input, Modal, Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import GraphGrid from "./GraphGrid";
import { Graph, GraphGridInterface } from "../constants/graphs";
import Cookies from "universal-cookie";
import ImportModal from "./ImportModal";
import GraphModal from "./GraphModal";
import type { MenuProps } from "antd";
import { APIService } from "../services/API";

type MenuItem = Required<MenuProps>["items"][number];

interface VisualisationNavigationProps {
  mock: boolean;
}

const VisualisationNavigation: React.FC<VisualisationNavigationProps> = ({
  mock = false,
}) => {
  const cookies = new Cookies();
  const defaultItems2: GraphGridInterface[] = [
    {
      label: "Application Targets",
      key: "item-0",
      graph: [
        {
          type: "BAR",
          layout: {
            i: "layout-0",
            w: 8,
            h: 6,
            x: 0,
            y: 0,
          },
          programType: "MAC",
          primary: "combined_fee_status",
          decisionStatus: "all",
          secondary: "decision_status",
          combined: true,
          year: 2022,
          data: undefined,
          title: "Applications Target Bar Chart (MAC)",
          target: [],
        },
        {
          type: "BAR",
          layout: {
            i: "layout-1",
            w: 8,
            h: 6,
            x: 8,
            y: 0,
          },
          programType: "AIML",
          primary: "combined_fee_status",
          decisionStatus: "all",
          secondary: "decision_status",
          year: 2022,
          target: [],
          combined: true,
          data: undefined,
          title: "Applications Target Bar Chart (AIML)",
        },
        {
          type: "BAR",
          layout: {
            i: "layout-2",
            w: 8,
            h: 6,
            x: 16,
            y: 0,
          },
          programType: "MCS",
          primary: "combined_fee_status",
          decisionStatus: "all",
          secondary: "decision_status",
          year: 2022,
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
          decisionStatus: "all",
          primary: "nationality",
          year: 2022,
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
          decisionStatus: "all",
          primary: "ethnicity",
          year: 2022,
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
          decisionStatus: "all",
          primary: "gender",
          year: 2022,
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
            i: "layout-0",
            w: 8,
            h: 6,
            x: 0,
            y: 0,
          },
          programType: "ALL",
          decisionStatus: "all",
          primary: "hi",
          data: undefined,
          title: "Line graph",
          year: 2022,
          frequency: 10,
          breakdown: "year",
          series: "gender",
          cycle: "relative",
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
        mock={mock}
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
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { confirm } = Modal;

  React.useEffect(() => {
    let newItems = makeTabItem(graphContent);
    setItems(newItems);

    if (newItems.length > keyCounter) {
      setKeyCounter(newItems.length);
    }

    if (activeKey === "" && newItems.length > 0) {
      setActiveKey(newItems[0].key);
    }
  }, [graphContent]);

  const addTab = async (newTab: string) => {
    let newGraph: Graph[] = [];
    let newLabel: string = "Untitled";
    const api = new APIService();
    if (newTab !== "") {
      const res = await api.importTab(newTab);
      newGraph = JSON.parse(atob(res.data["base64JSON"]));
      newLabel = res.data["title"] ? res.data["title"] : "Untitled";
    }
    console.log(newGraph);

    const newItemKey = `item-${keyCounter}`;
    const newGraphContent: GraphGridInterface[] = [
      ...graphContent,
      { label: newLabel, key: newItemKey, graph: newGraph },
    ];

    setGraphContentWithCookie(newGraphContent);
    setActiveKey(newItemKey);
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
      setNewTab("");
      setNewTabModalOpen(true);
      // add();
    }
  };

  React.useEffect(() => {
    // [TODO] Invalidate all Data
  }, [mock]);

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

  const exportUniqueLink = () => {
    const api = new APIService();
    const targetIndex = items.findIndex((i: any) => i.key === activeKey);

    let newGraphs: Graph[] = [...graphContent][targetIndex].graph;
    newGraphs.map((g: Graph) => {
      g.data = undefined;
      return g;
    });

    const base64 = btoa(JSON.stringify(newGraphs));

    api.exportTab(base64).then((res) => {
      if (res.success) {
        navigator.clipboard.writeText(res.data.id);
        message.success("JSON Model Copied to Clipboard", 0.5);
      } else {
        message.error("Failed to export", 0.5);
      }
    });
  };

  const importUniqueLink = (value: string) => {
    try {
      const api = new APIService();

      api.importTab(value).then((res) => {
        if (res.success) {
          const newGraph = JSON.parse(atob(res.data["base64JSON"]));
          const targetIndex = items.findIndex((i: any) => i.key === activeKey);

          let newGraphContent: GraphGridInterface[] = [...graphContent];

          newGraphContent[targetIndex].graph = newGraph;

          setGraphContentWithCookie(newGraphContent);
          message.success("Imported Successfully", 0.5);
        } else {
          message.error("Import failed", 0.5);
        }
      });
    } catch {
      message.error("Unable To Parse Input", 0.5);
    }
  };

  const addGraph = (newGraph: Graph) => {
    const targetIndex = graphContent.findIndex((i) => i.key === activeKey);
    const newGraphContent = [...graphContent];

    newGraph.layout.i = `layout-${newGraphContent[targetIndex].graph.length}`;

    newGraphContent[targetIndex].graph = [
      newGraph,
      ...newGraphContent[targetIndex].graph,
    ];
    setGraphContentWithCookie(newGraphContent);
  };

  const operationItems: MenuProps["items"] = [
    {
      label: "Export",
      key: "op-1",
      icon: <ExportOutlined />,
      onClick: exportUniqueLink,
    },
    {
      label: "Import",
      key: "op-2",
      icon: <ImportOutlined />,
      onClick: (e: any) => setImportModalOpen(true),
    },
  ];

  const operations = (
    <>
      <GraphModal submitAction={addGraph} isEdit={false} />
      <Dropdown menu={{ items: operationItems }}>
        <Button>
          More Actions
          <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );

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

  const [isNewTabModalOpen, setNewTabModalOpen] = useState<boolean>(false);

  const handleNewTabOk = () => {
    addTab(newTab);
    setNewTab("");
    setNewTabModalOpen(false);
  };

  const [defaultTabOptions, setDefaultTabOptions] = useState<any[]>([]);
  const [newTab, setNewTab] = useState("");

  React.useEffect(() => {
    if (isNewTabModalOpen) {
      const api = new APIService();

      api.getDefaultTabs().then((res) => {
        if (res.success) {
          let options: any[] = [
            {
              value: "",
              label: "Blank",
            },
          ];

          const otherOptions = res.data.map((v: any) => {
            return {
              value: v.id,
              label: v.title,
            };
          });

          options = options.concat(otherOptions);

          setDefaultTabOptions(options);
        }
      });
    }
  }, [isNewTabModalOpen]);

  const newTabModal = (
    <Modal
      title={"Create a new Tab"}
      open={isNewTabModalOpen}
      onOk={handleNewTabOk}
      onCancel={() => {
        setNewTab("");
        setNewTabModalOpen(false);
      }}
    >
      <Form name="Preset">
        <Form.Item initialValue={newTab}>
          <Select
            value={newTab}
            options={defaultTabOptions}
            onChange={(e) => setNewTab(e)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div>
      {newTabModal}
      <Modal
        title={
          "Rename '" + items.find((i: Tab) => i.key === activeKey)?.label + "'"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          placeholder="New name..."
          value={newName}
          onChange={(e: any) => setNewName(e.target.value)}
        />
      </Modal>
      <ImportModal
        open={isImportModalOpen}
        setOpen={setImportModalOpen}
        importLink={importUniqueLink}
      />
      {mock ? (
        <Alert
          description="Operating in Mock Data Mode"
          banner
          closable
          type="warning"
        />
      ) : (
        <></>
      )}
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
        tabBarExtraContent={operations}
      />
    </div>
  );
};

export default VisualisationNavigation;
