import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip, Card } from "antd";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getAllUnits } from "../../../../Utils/unitAPI";
import { getAllTechnicians } from "../../../../Utils/technicianAPI";
import { sortOptions } from "../../../../Utils/utils";
import { PlusOutlined } from "@ant-design/icons";
import Loader from "../../../../Components/Layout/Loader";
import UnitForm from "../../../Unit/UnitForm";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import { addVoucherOut, exportVoucherToExcel } from "../../../../Utils/voucherApi";
import TechnicianForm from "../../../Technician/TechnicianForm";
import { useNavigate, useParams } from "react-router";
import AddVoucherAction from "../ProjectSideBar/AddVoucherAction";
import { useState } from "react";
import GenericForm from "../../../../Components/UI/Form/GenericForm/GenericForm";
import VoucherTabs from "./VoucherTabs";

const KABALA = "false"; // קבלה (Receipt)
const NIPUK = "true"; // ניפוק (Issue)

const NewVoucherPage = ({ onCancel, formDefaultValues }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { projectId, project, isLoading: isProjectLoading } = useProject();
    const { voucherType } = useParams();
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);

    // Fetch units and technicians using react-query
    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingTechnicians, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const unitOptions = sortOptions(units, "unitsName")?.map((unit) => ({
        value: unit._id,
        label: unit.unitsName,
    }));

    const technicianOptions = sortOptions(technicians, "techName")?.map((technician) => ({
        value: technician.techName,
        label: technician.techName,
    }));

    const handleSave = (values) => {
        alert(JSON.stringify(values));
    };

    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});
    const addVoucherOutMutation = useMutation(addVoucherOut, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel && onCancel();
        },
    });

    const addVoucherMutation = useMutation(AddVoucherAction, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel && onCancel();
        },
    });

    const isLoading =
        addVoucherOutMutation.isLoading || addVoucherMutation.isLoading || isLoadingUnits || isLoadingTechnicians || isProjectLoading;

    const navigateBack = () => {
        navigate(-1);
    };

    if (isProjectLoading) {
        return <Loader />;
    }

    const fields = [
        {
            name: "123",
            label: "יחידה",
            type: "text",
            options: unitOptions,
            rules: [{ required: true, message: "יש למלא שדה זה." }],
            span: 23,
            extra: (
                <Tooltip title="הוסף יחידה חדשה">
                    <CustomButton type="light-primary" onClick={() => setIsUnitModalOpen(true)} icon={<PlusOutlined />} />
                </Tooltip>
            ),
        },
        {
            name: "unit",
            label: "יחידה",
            type: "select",
            options: unitOptions,
            rules: [{ required: true, message: "יש למלא שדה זה." }],
            span: 23,
            extra: (
                <Tooltip title="הוסף יחידה חדשה">
                    <CustomButton type="light-primary" onClick={() => setIsUnitModalOpen(true)} icon={<PlusOutlined />} />
                </Tooltip>
            ),
        },
        {
            name: "arrivedBy",
            label: "חייל מנפק",
            type: voucherType === NIPUK ? "text" : "select",
            options: voucherType !== NIPUK ? technicianOptions : undefined,
            rules: [{ required: true, message: "יש למלא שדה זה." }],
            span: 23,
            extra: voucherType !== NIPUK && (
                <Tooltip title="הוסף טכנאי חדש">
                    <CustomButton type="light-primary" onClick={() => setIsTechnicianModalOpen(true)} icon={<PlusOutlined />} />
                </Tooltip>
            ),
        },
        {
            name: "receivedBy",
            label: "חייל מקבל",
            type: voucherType === KABALA ? "text" : "select",
            options: voucherType === KABALA ? undefined : technicianOptions,
            rules: [{ required: true, message: "יש למלא שדה זה." }],
            span: 23,
            extra: voucherType !== KABALA && (
                <Tooltip title="הוסף טכנאי חדש">
                    <CustomButton type="light-primary" onClick={() => setIsTechnicianModalOpen(true)} icon={<PlusOutlined />} />
                </Tooltip>
            ),
        },
        {
            name: "devicesData",
            type: "render",
            render: (renderFields) => {
                if (voucherType == KABALA) {
                    return <VoucherTabs key="devicesData" renderFields={renderFields} />;
                } else {
                    return <>asd</>;
                }
            },
        },
    ];

    return (
        <>
            <Card title={`${voucherType == NIPUK ? "שובר ניפוק חדש" : "שובר קבלה חדש"} לפרוייקט - ${project.projectName}`}>
                <GenericForm
                    isModal={false}
                    fields={fields}
                    onSubmit={handleSave}
                    title="שובר חדש"
                    visible={true}
                    onCancel={navigateBack}
                    initialValues={formDefaultValues}
                    isLoading={isLoading}
                />
            </Card>

            <UnitForm formValues={null} open={isUnitModalOpen} onCancel={() => setIsUnitModalOpen(false)} isEdit={false} />
            <TechnicianForm
                formValues={null}
                open={isTechnicianModalOpen}
                onCancel={() => setIsTechnicianModalOpen(false)}
                isEdit={false}
            />
        </>
    );
};

NewVoucherPage.propTypes = {
    onCancel: PropTypes.func,
    formDefaultValues: PropTypes.object,
    open: PropTypes.bool,
};

export default NewVoucherPage;
