import { Divider, Steps } from "antd";
const RenderSteps = () => {
    return (
        <>
            {/* {steps && steps.length > 1 && (
                <>
                    <Steps
                        className="px-5"
                        labelPlacement="vertical"
                        current={currentStep}
                        size="small"
                        items={steps.map((step) => ({
                            title: step.title,
                            description: step.description,
                        }))}
                    />
                    <Divider />
                </>
            )}
            {steps && steps[currentStep].fields && <RenderFields stepFields={steps[currentStep].fields} />}
            {steps && steps[currentStep].render && steps[currentStep].render()} */}
        </>
    );
};

export default RenderSteps;
