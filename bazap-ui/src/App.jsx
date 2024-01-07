import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
// import "./assets/css/style.bundle.rtl.css";
import ErrorPage from "./Componenets/Layout/ErrorPage/ErrorPage";
import RootLayout from "./Componenets/Layout/RootLayout";
import DeviceType from "./Componenets/Pages/DeviceType/DeviceType";
import Unit from "./Componenets/Pages/Unit/Unit";
import { Project } from "./Componenets/Pages/Project/Project";
import Home from "./Componenets/Pages/Home/Home";
import ProjectsList from "./Componenets/Pages/Project/ProjectsList";
import "@fontsource/rubik/300.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@fontsource/rubik/800.css";
import "@fontsource/rubik/900.css";
import Technician from "./Componenets/Pages/Technician/Technician";
import Theme from "./Componenets/Layout/Theme";
import { ErrorProvider } from "./Componenets/Context/ErrorContext";
import { ErrorDialog } from "./Componenets/UI/ErrorDialog";

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
            <ErrorProvider>
                <RouterProvider router={router} />
                <ErrorDialog />
            </ErrorProvider>
        </Theme>
    );
}

export default App;
