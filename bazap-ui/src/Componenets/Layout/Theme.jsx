import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { heIL } from "@mui/material/locale";
import { blue, amber } from "@mui/material/colors";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import propTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";

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
