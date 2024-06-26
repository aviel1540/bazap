// import { Card, CardContent, CardHeader } from "@mui/material";
import { Card } from "antd";
import PropTypes from "prop-types";

const CustomCard = ({ title, action, children }) => {
    return (
        <Card title={title} extra={action} bordered={false}>
            {children}
        </Card>
    );
};

CustomCard.propTypes = {
    title: PropTypes.any,
    action: PropTypes.node,
    children: PropTypes.node,
};
export default CustomCard;
