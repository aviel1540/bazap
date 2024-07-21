import { NavLink } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { Avatar, Flex } from "antd";
import AdminAuth from "./AdminAuth";
import NavItem from "./NavItem";

const pages = [
    { label: "דף הבית", path: "/" },
    { label: "פרוייקטים", path: "/Project" },
    { label: "סוגי מכשירים", path: "/DeviceType" },
    { label: "יחידות", path: "/Unit" },
    { label: "טכנאים", path: "/Technician" },
];
const MainNavigation = () => {
    return (
        <>
            <Header className="fw-500 bg-nav-dark sticky-top d-flex align-items-center">
                <NavLink to="/">
                    <Avatar size={50} src={<img src={"/bazap-logo.png"} alt="logo" />} />
                </NavLink>
                <Flex gap="middle" justify="center" align="center" className="mx-3">
                    {pages.map((page) => {
                        return <NavItem key={page.path} page={page} />;
                    })}
                </Flex>
                {/* <Menu
                className="bg-transparent"
                mode="horizontal"
                selectedKeys={[currentPath]}
                items={pages.map((item) => ({
                    key: item.path,
                    label: <NavLink to={item.path}>{item.label}</NavLink>,
                    }))}
                    style={{
                        flex: 1,
                        }}
                        /> */}
                <div className="me-auto">
                    <AdminAuth />
                </div>
            </Header>
        </>
    );
};

export default MainNavigation;
