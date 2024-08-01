import { NavLink } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { Avatar, Flex } from "antd";
import AdminAuth from "./AdminAuth";
import NavItem from "./NavItem";
import SearchArea from "./SearchArea";

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
            <Header className="fw-500 bg-nav-dark d-flex align-items-center">
                <NavLink to="/">
                    <Avatar size={50} src={<img src={"/bazap-logo.png"} alt="logo" />} />
                </NavLink>
                <Flex justify="space-between" align="center" className="flex-grow-1 mx-3">
                    <Flex>
                        {pages.map((page) => {
                            return <NavItem key={page.path} page={page} />;
                        })}
                    </Flex>
                    <SearchArea />
                    <AdminAuth />
                </Flex>
            </Header>
        </>
    );
};

export default MainNavigation;
