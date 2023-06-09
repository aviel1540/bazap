/* eslint-disable react/prop-types */
import { Row, Col } from 'react-bootstrap';

export const ProjectRowData = (props) => {
    const { title, data } = props;
    return (<>
        <Row className="mb-4">
            <Col className='fw-bold text-muted' lg={3}>
                {title}:
            </Col>
            <Col lg={9} className='fw-bolder'>
                {data}
            </Col>
        </Row>
    </>)
}

