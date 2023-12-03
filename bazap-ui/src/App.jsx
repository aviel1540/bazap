import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import "./assets/css/style.bundle.rtl.css";
import ErrorPage from "./Componenets/Layout/ErrorPage/ErrorPage";
import RootLayout from "./Componenets/Layout/RootLayout";
import DeviceType from "./Componenets/Pages/DeviceType/DeviceType";
import Unit from "./Componenets/Pages/Unit/Unit";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index element={<div>sd</div>} />
            <Route path="DeviceType" element={<DeviceType />} />
            <Route path="Unit" element={<Unit />} />
        </Route>,
    ),
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;