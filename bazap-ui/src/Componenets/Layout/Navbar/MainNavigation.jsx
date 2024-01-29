import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";

const pages = [
    { title: "דף הבית", navTo: "/" },
    { title: "פרוייקטים", navTo: "/Project" },
    { title: "סוגי מכשירים", navTo: "/DeviceType" },
    { title: "יחידות", navTo: "/Unit" },
    { title: "טכנאים", navTo: "/Technician" },
];
const MainNavigation = () => {
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(() => {
        const currentPath = `/${window.location.pathname.split("/")[1]}`;
        const index = pages.findIndex((page) => page.navTo == currentPath);
        index >= 0 && setCurrentPage(index);
    }, []);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };
    return (
        // <StyledAppBar position="static">
        <AppBar position="absolute" sx={{ bgcolor: "#fff", boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link component={RouterLink} to="/" onClick={() => handleChangePage(null, 0)}>
                        <Avatar alt="Bazap" src="/logo.jpg" sx={{ m: "10px", width: 56, height: 56 }} />
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        <Tabs value={currentPage} onChange={handleChangePage} aria-label="icon tabs example">
                            {pages.map((page, index) => (
                                <Tab
                                    label={<Box sx={{ fontWeight: "bold", fontSize: 14, m: 1 }}>{page.title}</Box>}
                                    value={index}
                                    key={page.title}
                                    to={page.navTo}
                                    component={RouterLink}
                                />
                            ))}
                        </Tabs>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MainNavigation;
