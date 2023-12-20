import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import propTypes from "prop-types";

const lightColors = {
    primary: {
        backgroundColor: "#f1faff",
        hoverAndTextColor: "#00b2ff",
    },
    secondary: {
        backgroundColor: "#f9f9f9",
        hoverAndTextColor: "#e1e3ea",
    },
    success: {
        backgroundColor: "#e8fff3",
        hoverAndTextColor: "#50cd89",
    },
    info: {
        backgroundColor: "#f8f5ff",
        hoverAndTextColor: "#7239ea",
    },
    warning: {
        backgroundColor: "#fff8dd",
        hoverAndTextColor: "#ffc700",
    },
    danger: {
        backgroundColor: "#fff5f8",
        hoverAndTextColor: "#f1416c",
    },
    dark: {
        backgroundColor: "#f4f4f4",
        hoverAndTextColor: "#181c32",
    },
};
const LightButton = (props) => {
    const { btnColor, children, onClick } = props;
    const ColorButton = styled(Button)(() => ({
        // color: theme.palette.getContrastText(color[200]),
        color: lightColors[btnColor].hoverAndTextColor,
        backgroundColor: lightColors[btnColor].backgroundColor,
        "&:hover": {
            backgroundColor: lightColors[btnColor].hoverAndTextColor,
            color: "#ffffff",
        },
    }));
    return (
        <ColorButton variant="contained" {...props} onClick={onClick}>
            {children}
        </ColorButton>
    );
};

LightButton.propTypes = {
    btnColor: propTypes.string.isRequired,
    children: propTypes.node.isRequired,
    onClick: propTypes.func.isRequired,
};

export default LightButton;
