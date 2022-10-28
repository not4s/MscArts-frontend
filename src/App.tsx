import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import SpreadsheetUpload from "./components/SpreadsheetUpload";
import VisulisationNagivation from "./components/VisulisationNagivation";
import { Layout, MenuProps, Menu } from "antd";
import Settings from "./components/Settings";
import Login from "./components/Login";
import ProgramPage from "./components/ProgramPage";
import authService from "./services/auth.service";
import { APIService } from "./services/API";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import ApplicantTable from "./components/ApplicantTable";

const { Sider, Header, Footer, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  condition: boolean,
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  if (condition) {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  return { key: -1 } as MenuItem;
}

export default function App() {
  const LOGOUT_KEY = "5";

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(0);

  const [tab, setTab] = useState(1);
  const items: ItemType[] = [
    getItem(currentUserRole >= 1, "Visulisations", "1", <PieChartOutlined />),
    getItem(currentUserRole >= 2, "Spreadsheets", "2", <FileOutlined />),
    getItem(currentUserRole >= 3, "Settings", "3", <DesktopOutlined />),
    getItem(currentUserRole >= 2, "Programs", "4", <ProjectOutlined />),
    { type: "divider" },
    getItem(currentUserRole >= 1, "Logout", LOGOUT_KEY, <LogoutOutlined />),
  ];

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem("user");
    if (!accessToken) return;
    let accessTime = JSON.parse(atob(accessToken.split(".")[1]));
    if (accessTime.exp * 1000 < Date.now()) {
      logout();
      return;
    }
    // @ts-ignore
    setCurrentUser(accessToken);
    const api = new APIService();
    api.getRole().then((res) => {
      if (!res.success) {
        return logout();
      }
      setCurrentUserRole(res.data);
    });
  }, []);

  const changeTab = (key: any) => {
    setTab(Number(key));
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setCurrentUser(null);
    setCurrentUserRole(0);
    setTab(1);
  };

  return (
    <div className="App">
      {currentUser ? (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider>
            <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items.filter((e: any) => e.key !== -1)}
              onClick={(e) =>
                e.key !== LOGOUT_KEY ? changeTab(e.key) : logout()
              }
            />
          </Sider>
          <Layout style={{ minHeight: "100vh" }}>
            <Content>
              {tab == 1 ? <VisulisationNagivation /> : <></>}
              {tab == 2 ? <SpreadsheetUpload /> : <></>}
              {tab == 3 ? <Settings /> : <></>}
              {tab == 4 ? <ProgramPage /> : <></>}
            </Content>
            {/* <Footer > */}
            {/* </Footer> */}
          </Layout>
        </Layout>
      ) : (
        <Login
          setCurrentUser={setCurrentUser}
          setCurrentUserRole={setCurrentUserRole}
        />
      )}
    </div>
  );
}
