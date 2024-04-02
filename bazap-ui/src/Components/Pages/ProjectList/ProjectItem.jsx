import propTypes from "prop-types";
import { dateTostring } from "../../../Utils/utils";
import CustomInfoLabel from "../../UI/CustomForm/CustomInfoLabel";
import ProjectChart from "./ProjectChart";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const dummyData = { totalDevices: 100, totalWaiting: 20, totalInWork: 35, totalFinished: 10, TotalOut: 35 };
const ProjectItem = ({ projectData }) => {
    const navigate = useNavigate();
    const { projectName, startDate, _id: id } = projectData;
    
    const handleCardClick = () => {
        // Redirect to the specified route when the card is clicked
        navigate(`/Project/${id}`);
    };
    return (
        <Grid item="true" xs={12} sm={6} md={4} lg={3}>
            <Card onClick={handleCardClick} style={{ cursor: "pointer" }}>
                <CardHeader titleTypographyProps={{ variant: "h6" }} title={projectName} />
                <CardContent>
                    <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                    <Box margin={3}>
                        <ProjectChart data={dummyData} />
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

ProjectItem.propTypes = {
    projectData: propTypes.object.isRequired,
};

export default ProjectItem;
