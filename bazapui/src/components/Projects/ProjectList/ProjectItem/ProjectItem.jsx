/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Button, Card, Col, Stack, Table } from "react-bootstrap";
import { PencilSquare } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import ProjectChart from "./ProjectChart/ProjectChart";

function ProjectItem(props) {
  const { data, editProjectMethod } = props;
  const { projectName, unit, startDate, endDate, id } = data;
  const handleEditClick = () => {
    editProjectMethod(id);
  }
  return (
    <Col>
      <Card className="rounded shadow-sm my-2 mx-3 border-0">
        <Card.Body className="py-1 p-3 m-3 card-semi-radius">
          <Card.Title className="fs-4 fw-bold min-h-25 p-3">
            <Stack direction="horizontal" gap={3}>
              <Link to={`/project/${id}`}>
                <Button variant="link" className="fs-5 fw-boldest text-gray-900 text-hover-primary">
                  {projectName}
                </Button>
              </Link>
              <div className="ms-auto">
                <Button variant="light" className="btn-icon btn-light-primary" onClick={handleEditClick}>
                  <PencilSquare size={20} />
                </Button>
              </div>
            </Stack>
          </Card.Title>
          <div className="separator my-2 border-2"></div>
          <Table borderless className="fs-5">
            <tbody>
              <tr>
                <td className="fw-semibold text-muted w-125px">יחידה:</td>
                <td className="fw-bold"><span className="badge fs-6 text-bg-secondary">{unit}</span></td>
              </tr>
              <tr>
                <td className="fw-semibold  text-muted w-125px">תאריך התחלה:</td>
                <td className="fw-bold">{startDate}</td>
              </tr>
              {endDate &&
                <tr>
                  <td className="fw-semibold text-muted w-125px">תאריך סיום:</td>
                  <td className="fw-bold">{endDate}</td>
                </tr>
              }
            </tbody>
          </Table>
          <ProjectChart data={data} />
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProjectItem;
