import { Badge } from "antd";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import CustomCard from "../../Components/UI/CustomCard";
import { DeviceStatuses, dateTostring } from "../../Utils/utils";
import ProjectChart from "./ProjectChart";
import CustomInfoLabel from "../../Components/UI/CustomInfoLabel";

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
        <Badge.Ribbon color={project.finished ? "red" : "green"} text={project.finished ? "פרוייקט סגור" : "פרוייקט פתוח"}>
            <CustomCard title={<Link to={`/Project/${id}`}> {projectName}</Link>}>
                <CustomInfoLabel label="תאריך התחלה" value={dateTostring(startDate)} />
                <div className="m-3">
                    <ProjectChart data={data} />
                </div>
            </CustomCard>
        </Badge.Ribbon>
    );
};

ProjectItem.propTypes = {
    project: propTypes.object.isRequired,
};

export default ProjectItem;
