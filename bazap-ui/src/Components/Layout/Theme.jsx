import { CacheProvider } from "@emotion/react";
import { heIL } from "@mui/material/locale";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import propTypes from "prop-types";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ConfigProvider } from "antd";

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});
const theme = createTheme({
    typography: {
        fontFamily: "Rubik, sans-serif",
    },
    direction: "rtl",
    heIL,
});
const antdTheme = {
    components: {
        Button: {
            fontWeight: 500,
        },
    },
};
const Theme = ({ children }) => {
    return (
        <ConfigProvider theme={antdTheme}>
            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </CacheProvider>
        </ConfigProvider>
    );
};
Theme.propTypes = {
    children: propTypes.node.isRequired,
};
export default Theme;
