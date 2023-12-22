import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../Utils/projectAPI";
import Loader from "../../Layout/Loader";
import CustomModal from "../../UI/CustomModal";
import CustomStepper from "../../UI/CustomStepper/CustomStepper";
import { Card, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
export const Project = () => {
    // Access the id parameter from the URL
    const { id } = useParams();
    // Use React Query to fetch project data by ID
    const { isLoading, data: project } = useQuery({
        queryKey: ["project", id],
        queryFn: getProjectData,
    });
    if (isLoading) {
        return <Loader />;
    }
    const steps = ["תיאור 1", "תיאוק123213 2asdsadasda"];
    return (
        <>
            <Card>
                <CardHeader
                    titleTypographyProps={{ variant: "h6" }}
                    title={project.projectName}
                    action={
                        <LightButton variant="contained" btncolor="primary" size="small" icon={<AddIcon />}>
                            הוסף שובר
                        </LightButton>
                    }
                />
            </Card>
            <CustomModal size="lg" title="שובר חדש" show={false} showExitButton showCancelButton>
                <CustomStepper steps={steps} />
            </CustomModal>
        </>
    );
};
