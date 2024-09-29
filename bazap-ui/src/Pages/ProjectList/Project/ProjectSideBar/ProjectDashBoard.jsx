import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate } from "react-router-dom";

const ProjectDashBoard = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("Dashboard");
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="נתוני פרוייקט" />
            </ListItemButton>
        </ListItem>
    );
};

export default ProjectDashBoard;
