import { lazy } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import ErrorPage from "./Components/Layout/ErrorPage/ErrorPage";
import Theme from "./Components/Layout/Theme";
import { CustomModalProvider } from "./Components/store/CustomModalContext";
import { ProjectProvider } from "./Components/store/ProjectContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUserAlert } from "./Components/store/UserAlertContext";
import { AdminAuthProvider } from "./Components/store/AdminAuthContext";
import RootLayout from "./Components/Layout/RootLayout";
import CssImporter from "./Components/UI/CssImporter";
import NewVoucherPage from "./Pages/ProjectList/Project/NewVoucerPage";
import ProjectDashBoardPage from "./Pages/ProjectList/Project/ProjectDashBoardPage";

const DeviceType = lazy(() => import("./Pages/DeviceType/DeviceType"));
const Unit = lazy(() => import("./Pages/Unit/Unit"));
const Home = lazy(() => import("./Pages/Home/Home"));
const ProjectsList = lazy(() => import("./Pages/ProjectList/ProjectsList"));
const Project = lazy(() => import("./Pages/ProjectList/Project/Project"));
const Technician = lazy(() => import("./Pages/Technician/Technician"));
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Home />} />
            <Route path="DeviceType" element={<DeviceType />} />
            <Route path="Project" element={<ProjectsList />} />
            <Route path="Project/:id" element={<Project />} />
            <Route path="Project/:id/Voucher/:voucherType" element={<NewVoucherPage />} />
            <Route path="Project/:id/Dashboard" element={<ProjectDashBoardPage />} />
            <Route path="Unit" element={<Unit />} />
            <Route path="Technician" element={<Technician />} />
        </Route>,
    ),
);

function App() {
    const { onAlert, error } = useUserAlert();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                networkMode: "always",
                staleTime: 300000,
                onError: ({ message }) => {
                    onAlert(message, error);
                },
            },
            mutations: {
                networkMode: "always",
                staleTime: 300000,
                onError: ({ message }) => {
                    onAlert(message, error);
                },
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Theme>
                <CssImporter />
                <ProjectProvider>
                    <AdminAuthProvider>
                        <CustomModalProvider>
                            <RouterProvider router={router} />
                        </CustomModalProvider>
                    </AdminAuthProvider>
                </ProjectProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </Theme>
        </QueryClientProvider>
    );
}

export default App;
