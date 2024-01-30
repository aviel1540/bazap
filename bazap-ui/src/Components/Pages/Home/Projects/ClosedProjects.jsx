import Card from "@mui/material/Card";
import { Box, CardContent, CardHeader, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../../../Utils/projectAPI";
import Loader from "../../../Layout/Loader";
import DevicesChart from "./DevicesChart";

const ClosedProjects = () => {
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    const closedprojects = projects.filter((project) => project.finished == false);
    return (
        <Card>
            <CardHeader titleTypographyProps={{ variant: "h5" }} title="פרוייקטים סגורים" />
            <CardContent>
                {closedprojects.length == 0 && (
                    <Box textAlign="center" fontWeight="600">
                        <Typography>לא נמצאו פרוייקטים סגורים!</Typography>
                    </Box>
                )}

                {closedprojects.length > 0 && <DevicesChart />}
            </CardContent>
        </Card>
    );
};

export default ClosedProjects;
