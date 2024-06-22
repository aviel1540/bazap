import styled from "styled-components";
import { Button } from "antd";
import PropTypes from "prop-types";

// Custom shouldForwardProp function to filter out specific props
const shouldForwardProp = (prop) => !["bgColor", "hoverBgColor", "color", "hoverBorderColor", "hoverTextColor"].includes(prop);

const StyledCustomButton = styled(Button)
    .withConfig({
        shouldForwardProp,
    })
    .attrs((props) => ({
        style: {
            backgroundColor: props.bgColor,
            borderColor: props.bgColor,
            color: props.color,
        },
    }))`
    &&& {
        font-weight: 500; // Set font weight to 500

        &:hover,
        &:focus {
            background-color: ${(props) => props.hoverBgColor};
            border-color: ${(props) => props.hoverBorderColor};
            color: ${(props) => props.hoverTextColor};
        }
    }
`;
const colors = {
    primary: { bg: "#007bff", hoverBg: "#4096ff", color: "white", hoverBorder: "#4096ff", hoverText: "white" },
    "light-primary": { bg: "#f1faff", hoverBg: "#007bff", color: "#007bff", hoverBorder: "#007bff", hoverText: "white" },
    secondary: { bg: "#6c757d", hoverBg: "#a6acb4", color: "white", hoverBorder: "#a6acb4", hoverText: "white" },
    "light-secondary": { bg: "#f9f9f9", hoverBg: "#6c757d", color: "#6c757d", hoverBorder: "#6c757d", hoverText: "white" },
    success: { bg: "#28a745", hoverBg: "#62d77a", color: "white", hoverBorder: "#62d77a", hoverText: "white" },
    "light-success": { bg: "#e8fff3", hoverBg: "#28a745", color: "#28a745", hoverBorder: "#28a745", hoverText: "white" },
    info: { bg: "#17a2b8", hoverBg: "#68c3d1", color: "white", hoverBorder: "#68c3d1", hoverText: "white" },
    "light-info": { bg: "#f8f5ff", hoverBg: "#17a2b8", color: "#17a2b8", hoverBorder: "#17a2b8", hoverText: "white" },
    warning: { bg: "#ffc107", hoverBg: "#ffcd39", color: "white", hoverBorder: "#ffcd39", hoverText: "white" },
    "light-warning": { bg: "#fff8dd", hoverBg: "#ffc107", color: "#ffc107", hoverBorder: "#ffc107", hoverText: "white" },
    danger: { bg: "#dc3545", hoverBg: "#f27981", color: "white", hoverBorder: "#f27981", hoverText: "white" },
    "light-danger": { bg: "#fff5f8", hoverBg: "#dc3545", color: "#dc3545", hoverBorder: "#dc3545", hoverText: "white" },
    dark: { bg: "#343a40", hoverBg: "#4c515a", color: "white", hoverBorder: "#4c515a", hoverText: "white" },
    "light-dark": { bg: "#f9f9f9", hoverBg: "#343a40", color: "#343a40", hoverBorder: "#343a40", hoverText: "white" },
};
const CustomButton = ({ children, type, ...restProps }) => {
    const { bg, hoverBg, color, hoverBorder, hoverText } = colors[type] || colors.primary;

    return (
        <StyledCustomButton
            bgColor={bg}
            hoverBgColor={hoverBg}
            color={color}
            hoverBorderColor={hoverBorder}
            hoverTextColor={hoverText}
            {...restProps}
        >
            {children}
        </StyledCustomButton>
    );
};

CustomButton.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf([
        "primary",
        "light-primary",
        "secondary",
        "light-secondary",
        "success",
        "light-success",
        "info",
        "light-info",
        "warning",
        "light-warning",
        "danger",
        "light-danger",
        "dark",
        "light-dark",
    ]).isRequired,
};

export default CustomButton;
