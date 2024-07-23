import { forwardRef } from "react";
import { Button } from "antd";
import "./CustomButton.css";
import PropTypes from "prop-types";

const CustomButton = forwardRef(({ type, children, ...restProps }, ref) => {
    const color = type;
    return (
        <Button ref={ref} {...restProps} className={`button custom-button-${type}`} type={color}>
            {children}
        </Button>
    );
});

CustomButton.displayName = "CustomButton";

CustomButton.propTypes = {
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
    children: PropTypes.node,
};

export default CustomButton;
