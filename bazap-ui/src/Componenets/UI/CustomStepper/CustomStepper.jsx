import { Button, Col, Row, Stack } from "react-bootstrap";
import StepTitle from "./StepTitle";

const CustomStepper = ({ steps, children }) => {

    return (
        <Stack gap={5} direction="horizontal" className="justify-content-center">
            <StepTitle title ={steps[0]} stepNumber={'1'}/> 
            <StepTitle title ={steps[1]} stepNumber={'1'}/>
            <StepTitle title ={steps[0]} stepNumber={'1'}/>
        </Stack>
    );
};

export default CustomStepper;
