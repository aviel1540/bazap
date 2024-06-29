import { Card } from "antd";
import PropTypes from "prop-types";

const CustomCard = ({ title, action, children, className }) => {
    return (
        <Card title={title} extra={action} bordered={false} className={className}>
            {children}
        </Card>
    );
};

CustomCard.propTypes = {
    title: PropTypes.any,
    action: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
};
export default CustomCard;
