import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import SpreadsheetUpload from "./components/SpreadsheetUpload";
import VisulisationNagivation from "./components/VisulisationNagivation";
import { Layout, MenuProps, Menu } from "antd";
import Settings from "./components/Settings";
import Login from "./components/Login";
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
  const LOGOUT_KEY = "4";

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(0);

  const [tab, setTab] = useState(1);
  const items: ItemType[] = [
    getItem(currentUserRole >= 1, "Visulisations", "1", <PieChartOutlined />),
    getItem(currentUserRole >= 2, "Applicants", "2", <UserOutlined />),
    getItem(currentUserRole >= 3, "Spreadsheets", "3", <FileOutlined />),
    getItem(currentUserRole >= 3, "Settings", "4", <DesktopOutlined />),
    { type: "divider" },
    getItem(currentUserRole >= 1, "Logout", LOGOUT_KEY, <LogoutOutlined />),
  ];

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem("user");
    if (!accessToken) return;
    console.log("HELLO");
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
              {tab == 2 ? <ApplicantTable /> : <></>}
              {tab == 3 ? <SpreadsheetUpload /> : <></>}
              {tab == 4 ? <Settings /> : <></>}
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
