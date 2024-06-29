import { Button } from "antd";
import "./CustomButton.css";
import PropTypes from "prop-types";

function CustomButton({ type, children, ...restProps }) {
    const color = type;
    return (
        <Button {...restProps} className={`button custom-button-${type}`} type={color}>
            {children}
        </Button>
    );
}

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
