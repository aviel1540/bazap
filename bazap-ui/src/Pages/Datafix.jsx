import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDevices } from "../Utils/deviceApi";
import { Input, Space, Table, Typography } from "antd";
import Loader from "../Components/Layout/Loader";
import CustomDropDown from "../Components/UI/CustomDropDown";
import { getAllProjects } from "../Utils/projectAPI";
import CustomButton from "../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import UnitForm from "./Unit/UnitForm";
import BrigadeForm from "./Unit/BrigadeForm";
import DivisionForm from "./Unit/DivisionForm";
const { Text } = Typography;

const Datafix = () => {
    const [unitOpen, setUnitOpen] = useState(false);
    const [brigadeOpen, setBrigadeOpen] = useState(false);
    const [divisionOpen, setDivisionOpen] = useState(false);
    const { isLoading: isLoadingProjects, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
    });
    const columns = [
        {
            title: "צ' מכשיר",
            dataIndex: "serialNumber",
            key: "serialNumber",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "פרוייקט",
            dataIndex: "project",
            key: "project",
            filters: projects?.map((project) => {
                return {
                    text: project.projectName,
                    value: project._id,
                };
            }),
            onFilter: (value, record) => record.project._id == value,
            render: (project) => project?.projectName,
        },
        {
            title: "יחידה",
            dataIndex: "unit",
            key: "unit",
            sorter: (a, b) => a?.unit?.unitsName.length - b?.unit?.unitsName.length,
            render: (unit) => unit?.unitsName,
        },
        {
            title: "הערות",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "פעולות",
            key: "menu",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={[]} data={row} />,
        },
    ];
    const showUnitModal = () => {
        setUnitOpen(true);
    };

    const showBrigadeModal = () => {
        setBrigadeOpen(true);
    };

    const showDivisionModal = () => {
        setDivisionOpen(true);
    };

    const handleUnitCancel = () => {
        setUnitOpen(false);
    };

    const handleBrigadeCancel = () => {
        setBrigadeOpen(false);
    };

    const handleDivisionCancel = () => {
        setDivisionOpen(false);
    };
    if (isLoadingArrivedDevices || isLoadingProjects) {
        return <Loader />;
    }
    return (
        <>
            <Space
                direction="vertical"
                size="middle"
                style={{
                    display: "flex",
                }}
            >
                <Space>
                    <CustomButton type="light-primary" onClick={() => showDivisionModal()} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף אוגדה
                    </CustomButton>
                    <CustomButton type="light-primary" onClick={() => showBrigadeModal()} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף חטיבה
                    </CustomButton>
                    <CustomButton type="light-primary" onClick={() => showUnitModal()} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף יחידה
                    </CustomButton>
                </Space>
                <Table dataSource={allDevices} size="small" rowKey={(record) => record._id} pagination={false} columns={columns} />
            </Space>
            <UnitForm formValues={null} open={unitOpen} onCancel={handleUnitCancel} isEdit={false} />
            <BrigadeForm formValues={null} open={brigadeOpen} onCancel={handleBrigadeCancel} isEdit={false} />
            <DivisionForm formValues={null} open={divisionOpen} onCancel={handleDivisionCancel} isEdit={false} />
        </>
    );
};

export default Datafix;
