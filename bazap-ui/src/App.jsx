import { lazy } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import RootLayout from "./Components/Layout/RootLayout";
import "@fontsource/rubik/300.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@fontsource/rubik/800.css";
import "@fontsource/rubik/900.css";
import Technician from "./Pages/Technician/Technician";
import ErrorPage from "./Components/Layout/ErrorPage/ErrorPage";
import Theme from "./Components/Layout/Theme";
import { CustomModalProvider } from "./Components/store/CustomModalContext";
import { ProjectProvider } from "./Components/store/ProjectContext";
import "@sweetalert2/theme-material-ui/material-ui.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUserAlert } from "./Components/store/UserAlertContext";
import "./utilities.css";
import { AdminAuthProvider } from "./Components/store/AdminAuthContext";
const DeviceType = lazy(() => import("./Pages/DeviceType/DeviceType"));
const Unit = lazy(() => import("./Pages/Unit/Unit"));
const Home = lazy(() => import("./Pages/Home/Home"));
const ProjectsList = lazy(() => import("./Pages/ProjectList/ProjectsList"));
const Project = lazy(() => import("./Pages/ProjectList/Project/Project"));

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Home />} />
            <Route path="DeviceType" element={<DeviceType />} />
            <Route path="Project" element={<ProjectsList />} />
            <Route path="Project/:id" element={<Project />} />
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
