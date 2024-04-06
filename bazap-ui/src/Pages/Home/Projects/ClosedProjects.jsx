import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import DevicesChart from "./DevicesChart";
import CustomCard from "../../../Components/UI/CustomCard";
import { getAllProjects } from "../../../Utils/projectAPI";
import Loader from "../../../Components/Layout/Loader";
const ClosedProjects = () => {
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    const closedprojects = projects.filter((project) => project.finished == true);
    return (
        <CustomCard title="פרוייקטים סגורים">
            {closedprojects.length == 0 && (
                <Box textAlign="center" fontWeight="600">
                    <Typography>לא נמצאו פרוייקטים סגורים!</Typography>
                </Box>
            )}

            {closedprojects.length > 0 && <DevicesChart projects={closedprojects} />}
        </CustomCard>
    );
};

export default ClosedProjects;
