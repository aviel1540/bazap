
import { Card, Col, Row } from "react-bootstrap";
import CustomCardHeader from "../../UI/CustomCardHeader";
export const Project = () => {

    return (
        <>
            <Row sm={1} md={2} lg={3}>
                <Col>
                    <Card
                        className="bg-hover-light-primary"
                        onClick={() => {
                            alert("hi");
                        }}
                    >
                        <CustomCardHeader title="title" />
                        <Card.Body>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
