import { Badge, Col, Typography } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CustomCard from "../../Components/UI/CustomCard";
import { dateTostring } from "../../Utils/utils";
import ProjectChart from "./ProjectChart";
import CustomInfoLabel from "../../Components/UI/CustomInfoLabel";
const { Text } = Typography;
const ProjectItem = ({ project }) => {
    const { projectName, startDate, endDate, _id: id, finished, vouchersList } = project;

    return (
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={8}>
            <Badge.Ribbon color={finished ? "red" : "green"} text={finished ? "פרוייקט סגור" : "פרוייקט פתוח"}>
                <CustomCard
                    className="shadow-md"
                    title={
                        <Link to={`/Project/${id}`}>
                            <Text strong className="text-hover-primary fs-6">
                                {projectName}
                            </Text>
                        </Link>
                    }
                >
                    <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                    <CustomInfoLabel label="תאריך סיום" value={finished ? dateTostring(endDate) : "טרם הסתיים"} />
                    <div className="m-3">
                        <ProjectChart vouchersList={vouchersList} />
                    </div>
                </CustomCard>
            </Badge.Ribbon>
        </Col>
    );
};

ProjectItem.propTypes = {
    project: PropTypes.object.isRequired,
};

export default ProjectItem;
