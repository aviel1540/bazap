import { lazy } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import ErrorPage from "./Componenets/Layout/ErrorPage/ErrorPage";
import RootLayout from "./Componenets/Layout/RootLayout";
import "@fontsource/rubik/300.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@fontsource/rubik/800.css";
import "@fontsource/rubik/900.css";
import Technician from "./Componenets/Pages/Technician/Technician";
import Theme from "./Componenets/Layout/Theme";
import { AlertDialog } from "./Componenets/UI/AlertDialog";
import { AlertProvider } from "./Componenets/store/AlertContext";
import { CustomModalProvider } from "./Componenets/store/CustomModalContext";
import CustomModal from "./Componenets/UI/CustomModal";
import { ProjectProvider } from "./Componenets/store/ProjectContext";

const DeviceType = lazy(() => import("./Componenets/Pages/DeviceType/DeviceType"));
const Unit = lazy(() => import("./Componenets/Pages/Unit/Unit"));
const Home = lazy(() => import("./Componenets/Pages/Home/Home"));
const ProjectsList = lazy(() => import("./Componenets/Pages/ProjectList/ProjectsList"));
const Project = lazy(() => import("./Componenets/Pages/ProjectList/Project/Project"));

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
            <CustomModalProvider>
                <AlertProvider>
                    <ProjectProvider>
                        <RouterProvider router={router} />
                        <AlertDialog />
                        <CustomModal />
                    </ProjectProvider>
                </AlertProvider>
            </CustomModalProvider>
        </Theme>
    );
}

export default App;
