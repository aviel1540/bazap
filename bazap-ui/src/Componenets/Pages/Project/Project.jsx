import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../Utils/projectAPI";
import Loader from "../../Layout/Loader";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import CustomCardHeader from "../../UI/CustomCardHeader";
import CustomModal from "../../UI/CustomModal";
import CustomStepper from "../../UI/CustomStepper/CustomStepper";

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
                <CustomCardHeader title={project.projectName}>
                    <Button size="sm" className="btn-light-primary">
                        הוסף שובר
                    </Button>
                </CustomCardHeader>
            </Card>
            <CustomModal size="lg" title="שובר חדש" show={false} showExitButton showCancelButton>
                <CustomStepper steps={steps} />
            </CustomModal>
        </>
    );
};
