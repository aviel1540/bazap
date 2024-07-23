import { CacheProvider } from "@emotion/react";
import { heIL } from "@mui/material/locale";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import propTypes from "prop-types";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#009EF7",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#f9f9f9",
            contrastText: "#252F4A",
        },
        error: {
            main: "#f1416c",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#ffc700",
            contrastText: "#ffffff",
        },
        info: {
            main: "#7239ea",
            contrastText: "#ffffff",
        },
        success: {
            main: "#50cd89",
            contrastText: "#ffffff",
        },
        lightPrimary: {
            main: "#f1faff",
            contrastText: "#00b2ff",
        },
        lightSecondary: {
            main: "#f9f9f9",
            contrastText: "#e1e3ea",
        },
        lightSuccess: {
            main: "#e8fff3",
            contrastText: "#50cd89",
        },
        lightInfo: {
            main: "#f8f5ff",
            contrastText: "#7239ea",
        },
        lightWarning: {
            main: "#fff8dd",
            contrastText: "#ffc700",
        },
        lightDanger: {
            main: "#fff5f8",
            contrastText: "#f1416c",
        },
        lightdark: {
            main: "#f4f4f4",
            contrastText: "#181c32",
        },
        background: {
            default: "#F9F9F9",
            paper: "#ffffff",
        },
        infoText: "#637381",
    },
    typography: {
        fontFamily: "Rubik, sans-serif",
    },
    direction: "rtl",
    heIL,
});
const Theme = ({ children }) => {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
};
Theme.propTypes = {
    children: propTypes.node.isRequired,
};
export default Theme;
