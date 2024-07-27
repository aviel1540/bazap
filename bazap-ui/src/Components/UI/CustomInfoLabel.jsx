import { Typography, Row, Col } from "antd";
import propTypes from "prop-types";

const CustomInfoLabel = ({ label, value }) => {
    return (
        <Row gutter={[0, 8]} className="fw-500">
            <Col span={12}>
                <Typography.Text className="text-muted fs-8">{label}</Typography.Text>
            </Col>
            <Col span={12}>
                <Typography.Text className="fs-8">{value}</Typography.Text>
            </Col>
        </Row>
    );
};

CustomInfoLabel.propTypes = {
    label: propTypes.string.isRequired,
    value: propTypes.any.isRequired,
};

export default CustomInfoLabel;
