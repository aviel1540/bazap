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
import Technician from "./Components/Pages/Technician/Technician";
import ErrorPage from "./Components/Layout/ErrorPage/ErrorPage";
import Theme from "./Components/Layout/Theme";
import { CustomModalProvider } from "./Components/store/CustomModalContext";
import { ProjectProvider } from "./Components/store/ProjectContext";
import "@sweetalert2/theme-material-ui/material-ui.scss";
import { UserAlertProvider } from "./Components/store/UserAlertContext";

const DeviceType = lazy(() => import("./Components/Pages/DeviceType/DeviceType"));
const Unit = lazy(() => import("./Components/Pages/Unit/Unit"));
const Home = lazy(() => import("./Components/Pages/Home/Home"));
const ProjectsList = lazy(() => import("./Components/Pages/ProjectList/ProjectsList"));
const Project = lazy(() => import("./Components/Pages/ProjectList/Project/Project"));

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
    return (
        <Theme>
            <UserAlertProvider>
                <ProjectProvider>
                    <CustomModalProvider>
                        <RouterProvider router={router} />
                    </CustomModalProvider>
                </ProjectProvider>
            </UserAlertProvider>
        </Theme>
    );
}

export default App;
