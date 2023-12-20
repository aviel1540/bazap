import propTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const CustomInfoLabel = ({ label, value }) => {
    return (
        <Row className="mb-7">
            <Col lg={4}>
                <label className="fw-semibold text-muted">{label}</label>
            </Col>
            <Col lg={8}>
                <span className="fw-bold fs-6 text-gray-900">{value}</span>
            </Col>
        </Row>
    );
};
CustomInfoLabel.propTypes = {
    label: propTypes.string.isRequired,
    value: propTypes.string.isRequired,
};

export default CustomInfoLabel;
