import {
  SettingOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
  SlidersOutlined,
  RiseOutlined,
  ContactsOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import SpreadsheetUpload from "./components/SpreadsheetUpload";
import VisualisationNavigation from "./components/VisualisationNavigation";
import { Layout, MenuProps, Menu } from "antd";
import GeneralSettings from "./components/Settings/GeneralSettings";
import TargetSettings from "./components/Settings/TargetSettings";
import ProgramPage from "./components/Settings/ProgramSettings";
import { APIService } from "./services/API";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import ApplicantTable from "./components/Applicants/ApplicantTable";
import UserAccessSettings from "./components/Settings/UserAccessSettings";
import {
  Outlet,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthVerification from "./services/AuthVerification";
import ParamGraphGrid from "./components/ParamGraphGrid";
import TemplateSettings from "./components/Settings/TemplateSettings";
import { useTour } from "@reactour/tour";

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
  let navigate = useNavigate();
  let location = useLocation();
  const LOGOUT_KEY = "5";

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(0);

  const [mockMode, setMockMode] = useState(false);
  const [mockData, setMockData] = useState<any[]>([]);

  const [tab, setTab] = useState(1);
  const items: ItemType[] = [
    getItem(
      currentUserRole >= 1,
      "Visualisations",
      "/visuals",
      <PieChartOutlined />
    ),
    getItem(
      currentUserRole >= 2,
      "Spreadsheets",
      "/spreadsheets",
      <FileOutlined />
    ),
    getItem(
      currentUserRole >= 2,
      "Applicants",
      "/applicants",
      <ContactsOutlined />
    ),
    getItem(
      currentUserRole >= 3,
      "Settings",
      "/settings",
      <SettingOutlined />,
      [
        getItem(
          currentUserRole >= 3,
          "General",
          "/settings/generals",
          <SlidersOutlined />
        ),
        getItem(
          currentUserRole >= 3,
          "Templates",
          "/settings/templates",
          <LayoutOutlined />
        ),
        getItem(
          currentUserRole >= 2,
          "Programs",
          "/settings/programs",
          <ProjectOutlined />
        ),
        getItem(
          currentUserRole >= 3,
          "Targets",
          "/settings/targets",
          <RiseOutlined />
        ),
        getItem(
          currentUserRole >= 3,
          "User Access",
          "/settings/user",
          <UserOutlined />
        ),
      ]
    ),
  ];

  const logOutItem: ItemType[] = [
    getItem(currentUserRole >= 1, "Logout", LOGOUT_KEY, <LogoutOutlined />),
  ];

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem("user");
    const api = new APIService();
    api.getRole().then((res) => {
      if (!res.success) {
        console.log("Logging out");
        return logout();
      }
      setCurrentUserRole(res.data);
      // @ts-ignore
      setCurrentUser(accessToken);
    });
  }, []);

  const logout = () => {
    sessionStorage.removeItem("user");
    setCurrentUser(null);
    setCurrentUserRole(0);
    setTab(1);
    navigate("/login");
  };

  return (
    <div className="App">
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <AuthVerification logout={logout} />
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            className="styledMenuContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100%)",
            }}
          >
            <Menu
              theme="dark"
              selectedKeys={[location.pathname]}
              mode="inline"
              items={items.filter((e: any) => e.key !== -1)}
              onClick={(e) => navigate(e.key)}
            ></Menu>
            <Menu
              theme="dark"
              mode="inline"
              items={logOutItem}
              onClick={(e) => logout()}
            />
          </div>
        </Sider>
        <Layout style={{ minHeight: "100vh" }}>
          <Content>
            <Routes>
              <Route
                path="visuals"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    roleRequired={1}
                    rolePossessed={currentUserRole}
                  >
                    <VisualisationNavigation mock={mockMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="visuals/:graphs"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    roleRequired={1}
                    rolePossessed={currentUserRole}
                  >
                    <ParamGraphGrid />
                  </ProtectedRoute>
                }
              />

              <Route
                path="spreadsheets"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    roleRequired={2}
                    rolePossessed={currentUserRole}
                  >
                    <SpreadsheetUpload
                      mock={currentUserRole < 3}
                      setMock={setMockMode}
                      setMockData={setMockData}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="settings">
                <Route
                  path="generals"
                  element={
                    <ProtectedRoute
                      user={currentUser}
                      roleRequired={3}
                      rolePossessed={currentUserRole}
                    >
                      <GeneralSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="templates"
                  element={
                    <ProtectedRoute
                      user={currentUser}
                      roleRequired={3}
                      rolePossessed={currentUserRole}
                    >
                      <TemplateSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="programs"
                  element={
                    <ProtectedRoute
                      user={currentUser}
                      roleRequired={3}
                      rolePossessed={currentUserRole}
                    >
                      <ProgramPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="user"
                  element={
                    <ProtectedRoute
                      user={currentUser}
                      roleRequired={3}
                      rolePossessed={currentUserRole}
                    >
                      <UserAccessSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="targets"
                  element={
                    <ProtectedRoute
                      user={currentUser}
                      roleRequired={3}
                      rolePossessed={currentUserRole}
                    >
                      <TargetSettings />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="applicants"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    roleRequired={2}
                    rolePossessed={currentUserRole}
                  >
                    <ApplicantTable />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Outlet />
          </Content>
          {/* <Footer > */}
          {/* </Footer> */}
        </Layout>
      </Layout>
    </div>
  );
}
