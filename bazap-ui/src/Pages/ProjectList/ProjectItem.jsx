import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import CustomCard from "../../Components/UI/CustomCard";
import { DeviceStatuses, dateTostring } from "../../Utils/utils";
import ProjectChart from "./ProjectChart";
import CustomInfoLabel from "../../Components/UI/CustomInfoLabel";
import { Badge } from "antd";

const ProjectItem = ({ project }) => {
    const { projectName, startDate, _id: id } = project;
    let allDevices = [];
    let allAccessories = [];

    project.vouchersList.forEach((voucher) => {
        if (voucher.type) allDevices = allDevices.concat(voucher.deviceList);
        if (voucher.accessoriesList) allAccessories = allAccessories.concat(voucher.accessoriesList);
    });

    const data = {
        totalDevices: allDevices.length,
        totalWaiting: allDevices.filter((device) => device.status === DeviceStatuses.WAIT_TO_WORK).length,
        totalInWork: allDevices.filter((device) => device.status === DeviceStatuses.AT_WORK).length,
        totalFinished: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE, DeviceStatuses.FIXED].includes(device.status)).length,
        totalOut: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(device.status))
            .length,
        accessoriesWaiting: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.WAIT_TO_WORK).length,
        accessoriesInWork: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.AT_WORK).length,
        accessoriesFinished: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.FINISHED).length,
        accessoriesOut: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.FINISHED_OUT).length,
    };

    return (
        <Grid item="true" xs={12} sm={6} md={4} lg={4}>
            <Badge.Ribbon color={project.finished ? "red" : "green"} text={project.finished ? "פרוייקט סגור" : "פרוייקט פתוח"}>
                <CustomCard title={<Link to={`/Project/${id}`}> {projectName}</Link>}>
                    <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                    <Box margin={3}>
                        <ProjectChart data={data} />
                    </Box>
                </CustomCard>
            </Badge.Ribbon>
        </Grid>
    );
};

ProjectItem.propTypes = {
    project: propTypes.object.isRequired,
};

export default ProjectItem;
