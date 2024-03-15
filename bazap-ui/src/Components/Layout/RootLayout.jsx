import { Outlet } from "react-router-dom";
import MainNavigation from "./Navbar/MainNavigation";
import { Box, Container } from "@mui/material";
import Loader from "./Loader";
import { Suspense } from "react";
import { useUserAlert } from "../store/UserAlertContext";
import PageLayout from "./PageLayout";
function RootLayout() {
    const { contextHolder } = useUserAlert();
    return (
        <>
            <PageLayout>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Suspense fallback={<Loader />}>
                        <main>
                            <Outlet />
                        </main>
                    </Suspense>
                    {contextHolder}
                </Box>
            </PageLayout>
        </>
    );
}

export default RootLayout;
