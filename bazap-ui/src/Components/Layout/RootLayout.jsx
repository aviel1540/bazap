import { Outlet } from "react-router-dom";
import Loader from "./Loader";
import { Suspense } from "react";
import PageLayout from "./PageLayout";
import { Box } from "@mui/material";
import { useUserAlert } from "../store/UserAlertContext";
function RootLayout() {
    const { contextHolder } = useUserAlert();
    return (
        <>
            <PageLayout>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        height: "100%",
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
