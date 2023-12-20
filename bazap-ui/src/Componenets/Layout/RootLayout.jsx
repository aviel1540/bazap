import { Outlet } from "react-router-dom";
import MainNavigation from "./Navbar/MainNavigation";
import { Box, Container } from "@mui/material";
function RootLayout() {
    return (
        <>
            <MainNavigation />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
                    <main>
                        {/* <Box sx={{pt:1 }}> */}
                        <Outlet />
                    </main>
                </Container>
            </Box>
        </>
    );
}

export default RootLayout;
