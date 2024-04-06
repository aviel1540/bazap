import propTypes from "prop-types";
import { DeviceStatuses, dateTostring } from "../../../Utils/utils";
import CustomInfoLabel from "../../UI/CustomForm/CustomInfoLabel";
import ProjectChart from "./ProjectChart";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CustomCard from "../../UI/CustomCard";
const ProjectItem = ({ projectData }) => {
    const { projectName, startDate, _id: id } = projectData;
    let allDevices = [];

    projectData.vouchersList.forEach((voucher) => {
        if (voucher.type) allDevices = allDevices.concat(voucher.deviceList);
    });
    const data = {
        totalDevices: allDevices.length,
        totalWaiting: allDevices.filter((device) => device.status == DeviceStatuses.WAIT_TO_WORK).length,
        totalInWork: allDevices.filter((device) => device.status == DeviceStatuses.AT_WORK).length,
        totalFinished: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE, DeviceStatuses.FIXED].includes(device.status)).length,
        totalOut: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(device.status))
            .length,
    };
    return (
        <Grid item="true" xs={12} sm={6} md={4} lg={3}>
            <CustomCard title={<Link to={`/Project/${id}`}> {projectName}</Link>}>
                <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                <Box margin={3}>
                    <ProjectChart data={data} />
                </Box>
            </CustomCard>
        </Grid>
    );
};

ProjectItem.propTypes = {
    projectData: propTypes.object.isRequired,
};

export default ProjectItem;
