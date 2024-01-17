import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { heIL } from "@mui/material/locale";
// import { blue, amber } from "@mui/material/colors";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import propTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

// const theme = createTheme({
//     typography: {
//         fontFamily: "Rubik, sans-serif",
//     },
//     palette: {
//         mode: "light",
//         // primary: {

//         // },
//         secondary: amber,
//         lightPrimary: {
//             light: "#ffffff",
//             main: "#f1faff",
//             dark: "#00b2ff",
//             contrastText: "#ffffff",
//         },
//     },
//     background: {
//         // default: "#f8f9fa",
//         default: "#04255c",
//     },
//     direction: "rtl",
//     heIL,
// });
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#009EF7",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#f9f9f9",
        },
        error: {
            main: "#f1416c",
        },
        warning: {
            main: "#ffc700",
        },
        info: {
            main: "#7239ea",
        },
        success: {
            main: "#50cd89",
        },
        background: {
            default: "#F9F9F9",
            paper: "#ffffff",
        },
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
