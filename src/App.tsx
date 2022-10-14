import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import SpreadsheetUpload from "./components/SpreadsheetUpload";
import VisulisationNagivation from "./components/VisulisationNagivation";
import { Layout, MenuProps, Menu } from "antd";
import Settings from "./components/Settings";

const { Sider, Header, Footer, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function App() {
  const [tab, setTab] = useState(1);
  const items: MenuItem[] = [
    getItem("Visulisations", "1", <PieChartOutlined />),
    getItem("Spreadsheets", "2", <FileOutlined />),
    getItem("Settings", "3", <DesktopOutlined />),
  ];

  const changeTab = (key: any) => {
    setTab(Number(key));
  };

  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={(e) => changeTab(e.key)}
          />
        </Sider>
        <Layout style={{ minHeight: "100vh" }}>
          <Content>
            {tab == 1 ? <VisulisationNagivation /> : <></>}
            {tab == 2 ? <SpreadsheetUpload /> : <></>}
            {tab == 3 ? <Settings /> : <></>}
          </Content>
          {/* <Footer > */}
          {/* </Footer> */}
        </Layout>
      </Layout>
    </div>
  );
}
