import { Typography } from "@mui/material";
import propTypes from "prop-types";

const CustomInfoLabel = ({ label, value }) => {
    return (
        <Typography variant="body1" fontSize={14}>
            <span style={{ fontWeight: 600 }}>{label}:</span> <span style={{ color: "#888" }}>{value}</span>
        </Typography>
        // <Row className="mb-7">
        //     <Col lg={4}>
        //         <label className="fw-semibold text-muted">{label}</label>
        //     </Col>
        //     <Col lg={8}>
        //         <span className="fw-bold fs-6 text-gray-900">{value}</span>
        //     </Col>
        // </Row>
    );
};
CustomInfoLabel.propTypes = {
    label: propTypes.string.isRequired,
    value: propTypes.string.isRequired,
};

export default CustomInfoLabel;
