import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import "./assets/css/style.bundle.rtl.css";
import ErrorPage from "./Componenets/Layout/ErrorPage/ErrorPage";
import RootLayout from "./Componenets/Layout/RootLayout";
import DeviceType from "./Componenets/Pages/DeviceType/DeviceType";
import Unit from "./Componenets/Pages/Unit/Unit";
import { Project } from "./Componenets/Pages/Project/Project";
import Home from "./Componenets/Pages/Home/Home";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Home/>} />
            <Route path="DeviceType" element={<DeviceType />} />
            <Route path="Project" element={<Project />} />
            <Route path="Unit" element={<Unit />} />
        </Route>,
    ),
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
