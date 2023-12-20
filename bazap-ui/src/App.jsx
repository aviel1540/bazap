import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
// import "./assets/css/style.bundle.rtl.css";
import ErrorPage from "./Componenets/Layout/ErrorPage/ErrorPage";
import RootLayout from "./Componenets/Layout/RootLayout";
import DeviceType from "./Componenets/Pages/DeviceType/DeviceType";
import Unit from "./Componenets/Pages/Unit/Unit";
import { Project } from "./Componenets/Pages/Project/Project";
import Home from "./Componenets/Pages/Home/Home";
import ProjectsList from "./Componenets/Pages/Project/ProjectsList";
import { ThemeProvider, createTheme } from "@mui/material";
import { heIL } from "@mui/material/locale";
import { blue, amber } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import "@fontsource/rubik/300.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@fontsource/rubik/800.css";
import "@fontsource/rubik/900.css";
import { CacheProvider } from "@emotion/react";

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
    typography: {
        fontFamily: "Rubik, sans-serif",
    },

    palette: {
        primary: blue,
        secondary: amber,
    },
    background: {
        default: "#f8f9fa",
    },
    direction: "rtl",
    heIL,
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Home />} />
            <Route path="DeviceType" element={<DeviceType />} />
            <Route path="Project" element={<ProjectsList />} />
            <Route path="Project/:id" element={<Project />} />
            <Route path="Unit" element={<Unit />} />
        </Route>,
    ),
);

function App() {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
