import React from "react";
import { Avatar, Layout, Menu, theme } from "antd";
import { NavLink, useLocation } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const pages = [
    { label: "דף הבית", path: "/" },
    { label: "פרוייקטים", path: "/Project" },
    { label: "סוגי מכשירים", path: "/DeviceType" },
    { label: "יחידות", path: "/Unit" },
    { label: "טכנאים", path: "/Technician" },
];

const PageLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    return (
        <Layout>
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <NavLink to="/">
                    <Avatar size={45}>
                        <img src="/logo.jpg" alt="Logo" className="logo" />
                    </Avatar>
                </NavLink>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={pages.map((item) => ({
                        key: item.path,
                        label: <NavLink to={item.path}>{item.label}</NavLink>,
                    }))}
                    style={{
                        flex: 1,
                    }}
                />
            </Header>

            <Content
                style={{
                    marginTop: "20px",
                    padding: "0 48px",
                }}
            >
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: "center",
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default PageLayout;
