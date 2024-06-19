import { Outlet } from "react-router-dom";
import Loader from "./Loader";
import { Suspense } from "react";
import PageLayout from "./PageLayout";
import { Box } from "@mui/material";
function RootLayout() {
    return (
        <>
            <PageLayout>
                <Box component="main">
                    <Suspense fallback={<Loader />}>
                        <main>
                            <Outlet />
                        </main>
                    </Suspense>
                </Box>
            </PageLayout>
        </>
    );
}

export default RootLayout;
