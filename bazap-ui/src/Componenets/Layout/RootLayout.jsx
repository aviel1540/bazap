import { Outlet } from "react-router-dom";
import MainNavigation from "./Navbar/MainNavigation";
import { Box, Container } from "@mui/material";
import Loader from "./Loader";
import { Suspense } from "react";
function RootLayout() {
    return (
        <>
            <MainNavigation />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
                    <Suspense fallback={<Loader />}>
                        <main>
                            <Outlet />
                        </main>
                    </Suspense>
                </Container>
            </Box>
        </>
    );
}

export default RootLayout;
