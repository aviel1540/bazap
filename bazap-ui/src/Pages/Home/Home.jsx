import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import ClosedProjects from "./Projects/ClosedProjects";
function Home() {
    return (
        <>
            <ClosedProjects />
            <CustomButton type="primary">בדיקה</CustomButton>
        </>
    );
}

export default Home;
