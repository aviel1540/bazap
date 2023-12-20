import { Card, Col } from "react-bootstrap";
import CustomCardHeader from "../../UI/CustomCardHeader";
import propTypes from "prop-types";
import { dateTostring } from "../../../Utils/utils";
import CustomInfoLabel from "../../UI/CustomForm/CustomInfoLabel";
import ProjectChart from "./ProjectChart";
import { NavLink } from "react-router-dom";

const dummyData = { totalDevices: 100, totalWaiting: 20, totalInWork: 35, totalFinished: 10, TotalOut: 35 };
const ProjectItem = ({ projectData }) => {
    const { projectName, startDate, _id: id } = projectData;
    return (
        <Col>
            <NavLink to={`/Project/${id}`}>
                <Card className="bg-hover-light-primary">
                    <CustomCardHeader title={projectName} />
                    <Card.Body>
                        <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                        <ProjectChart data={dummyData} />
                    </Card.Body>
                </Card>
            </NavLink>
        </Col>
    );
};

ProjectItem.propTypes = {
    projectData: propTypes.object.isRequired,
};

export default ProjectItem;
