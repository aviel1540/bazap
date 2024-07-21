import { Card } from "antd";
import PropTypes from "prop-types";

const CustomCard = ({ title, action, children, className, bordered = false }) => {
    return (
        <Card title={title} extra={action} bordered={bordered} className={className}>
            {children}
        </Card>
    );
};

CustomCard.propTypes = {
    title: PropTypes.any,
    action: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    bordered: PropTypes.bool,
};
export default CustomCard;
