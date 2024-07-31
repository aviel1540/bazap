import { List } from "@mui/material";
import Sider from "antd/es/layout/Sider";
import PropTypes from "prop-types";
import { theme } from "antd";
import AddVoucherAction from "./ProjectSideBar/AddVoucherAction";

import CreateDeviceReportAction from "./ProjectSideBar/CreateDeviceReportAction";
import CreateOutDevicesReportAction from "./ProjectSideBar/CreateOutDevicesReportAction";
import CloseProjectAction from "./ProjectSideBar/CloseProjectAction";
import DeleteProjectAction from "./ProjectSideBar/DeleteProjectAction";
import OpenProjectAction from "./ProjectSideBar/OpenProjectAction";
import EditProjectAction from "./ProjectSideBar/EditProjectAction";

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
                {!isProjectIsClosed && <AddVoucherAction />}
                {!isProjectIsClosed && <EditProjectAction />}
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
