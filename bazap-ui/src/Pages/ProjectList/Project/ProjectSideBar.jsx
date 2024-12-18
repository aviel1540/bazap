import { List } from "@mui/material";
import Sider from "antd/es/layout/Sider";
import PropTypes from "prop-types";
import { theme } from "antd";

import CreateDeviceReportAction from "./ProjectSideBar/CreateDeviceReportAction";
import CreateOutDevicesReportAction from "./ProjectSideBar/CreateOutDevicesReportAction";
import CloseProjectAction from "./ProjectSideBar/CloseProjectAction";
import DeleteProjectAction from "./ProjectSideBar/DeleteProjectAction";
import OpenProjectAction from "./ProjectSideBar/OpenProjectAction";
import ProjectDashBoard from "./ProjectSideBar/ProjectDashBoard";
import NewVoucherPageAction from "./ProjectSideBar/NewVoucherPageAction";
// import EditProjectAction from "./ProjectSideBar/EditProjectAction";

const ProjectSideBar = ({ isProjectIsClosed }) => {
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();
    return (
        <Sider
            style={{
                borderRadius: borderRadius,
                backgroundColor: colorBgContainer,
            }}
            width={200}
        >
            <List>
                {!isProjectIsClosed && <NewVoucherPageAction />}
                {!isProjectIsClosed && <ProjectDashBoard />}
                {/* {!isProjectIsClosed && <EditProjectAction />} */}
                {!isProjectIsClosed && <CreateDeviceReportAction />}
                {<CreateOutDevicesReportAction />}
                {!isProjectIsClosed && <CloseProjectAction />}
                {isProjectIsClosed && <OpenProjectAction />}
                <DeleteProjectAction />
            </List>
        </Sider>
    );
};

ProjectSideBar.propTypes = {
    isProjectIsClosed: PropTypes.bool,
};

export default ProjectSideBar;
