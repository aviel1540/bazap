import { Button, Col, Row } from "react-bootstrap";

const StepTitle = ({ title, stepNumber }) => {
    return (
        <Row className="mx-1">
            <Col xs="3">
                <Button size="lg" className="btn-icon btn-ligh-primary btn-active-success">
                    {stepNumber}
                </Button>
            </Col>
            <Col >
                <div className="fw-bold fs-6 text-gray-900">{`שלב ${stepNumber}`}</div>
                <div className="fw-semibold text-muted">{title}</div>
            </Col>
        </Row>
    );
};

export default StepTitle;
