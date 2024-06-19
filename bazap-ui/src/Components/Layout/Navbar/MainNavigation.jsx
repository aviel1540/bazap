import { NavLink, useLocation } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { Avatar, Menu } from "antd";

const pages = [
    { label: "דף הבית", path: "/" },
    { label: "פרוייקטים", path: "/Project" },
    { label: "סוגי מכשירים", path: "/DeviceType" },
    { label: "יחידות", path: "/Unit" },
    { label: "טכנאים", path: "/Technician" },
];
const MainNavigation = () => {
    const location = useLocation();
    let index = location.pathname.lastIndexOf("/");
    const currentPath = location.pathname.slice("/", index > 0 ? index : undefined);
    return (
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
                <Avatar size={50} src={<img src={"/bazap-logo.png"} alt="logo" />} />
            </NavLink>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[currentPath]}
                items={pages.map((item) => ({
                    key: item.path,
                    label: <NavLink to={item.path}>{item.label}</NavLink>,
                }))}
                style={{
                    flex: 1,
                }}
            />
        </Header>
    );
};

export default MainNavigation;
