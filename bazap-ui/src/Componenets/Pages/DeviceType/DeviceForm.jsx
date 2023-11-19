import CustomForm from "../../UI/CustomForm/CustomForm";

const DeviceForm = ({ onSubmit, onCancel }) => {
    const deviceNameInputObj = [
        {
            label: "שם סוג מכשיר",
            name: "deviceTypeName",
            type: "text",
            placeholder: "לדוגמא RPT",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
        },
    ];
    return (
        <>
            <CustomForm inputs={deviceNameInputObj} onSubmit={onSubmit} onCancel={onCancel}></CustomForm>
        </>
    );
};

export default DeviceForm;
