import { useCustomModal } from "../../Components/store/CustomModalContext";
import CustomCard from "../../Components/UI/CustomCard";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton";

const Unit = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        onShow({
            title: "יחידה חדשה",
            name: "unit",
            body: <UnitForm formValues={data} onCancel={() => onHide("unit")} isEdit={isEdit} />,
        });
    };

    return (
        <CustomCard
            action={
                <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                    הוסף יחידה
                </CustomButton>
            }
            title="יחידות"
        >
            <UnitTable onEdit={showModal} />
        </CustomCard>
    );
};

export default Unit;
