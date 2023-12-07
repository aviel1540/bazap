import { Button, Card, Col, Row } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";

export const Project = () => {
    return (
        <>
            <Row sm={1} md={2} lg={3}>
                <Col>
                    <Card>
                        <div className="card-header">
                            <div className="card-title">title</div>
                            <div className="card-toolbar">
                                <Button size="sm" className="btn-light-primary btn-icon">
                                <TbEdit  className="fs-2" />
                                </Button>
                            </div>
                        </div>
                        <Card.Body>body</Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
