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
import { addVoucherIn, addVoucherOut, exportVoucherToExcel } from "../../../../Utils/voucherApi";
import TechnicianForm from "../../../Technician/TechnicianForm";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import GenericForm from "../../../../Components/UI/Form/GenericForm/GenericForm";
import VoucherTabs from "./VoucherTabs";
import VoucherDevices from "./VoucherDevices";
import { getAllDivisions } from "../../../../Utils/divisionAPI";
import { getAllBrigades } from "../../../../Utils/brigadeAPI";

const KABALA = true;
const NIPUK = false;

const NewVoucherPage = () => {
    const location = useLocation();
    const voucherType = location?.state?.voucherType;
    const unit = location?.state?.unit;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { projectId, project, isLoading: isProjectLoading } = useProject();
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState(null);
    // const [selectedBrigade, setSelectedBrigade] = useState(null);
    const { isLoading: isLoadingDivision, data: divisions } = useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });
    const { isLoading: isLoadingBrigade, data: brigades } = useQuery({
        queryKey: ["brigades"],
        queryFn: getAllBrigades,
    });

    const [formDefaultValues, setFormDefaultValues] = useState({ projectId: projectId, type: voucherType, unit });
    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const { isLoading: isLoadingTechnicians, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });
    useEffect(() => {
        if (projectId) {
            setFormDefaultValues((prevValues) => ({
                ...prevValues,
                projectId,
            }));
        }
    }, [projectId]);
    const unitOptions = sortOptions(units, "unitsName")?.map((unit) => ({
        value: unit._id,
        label: unit.unitsName,
    }));

    const technicianOptions = sortOptions(technicians, "techName")?.map((technician) => ({
        value: technician.techName,
        label: technician.techName,
    }));

    const addVoucherMutation = useMutation(addVoucherIn, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            exportVoucherMutation.mutate(data.newVoucher._id);
            navigateBack();
            return true;
        },
    });

    const handleSave = async (values) => {
        if (voucherType == KABALA) {
            return await addVoucherMutation.mutateAsync(values);
        } else {
            return await addVoucherOutMutation.mutateAsync(values);
        }
    };

    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});
    const addVoucherOutMutation = useMutation(addVoucherOut, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            exportVoucherMutation.mutate(data.newVoucher._id);
            navigateBack();
            return true;
        },
    });

    const isLoading =
        addVoucherOutMutation.isLoading || addVoucherMutation.isLoading || isLoadingUnits || isLoadingTechnicians || isProjectLoading;

    const navigateBack = () => {
        navigate(`/Project/${projectId}`);
    };
    if (voucherType == undefined || voucherType == null) {
        navigate(`/Project/${projectId}`);
    }
    const fields = [
        // {
        //     label: "אוגדה",
        //     name: "divisionId",
        //     type: "select",
        //     onChange: ({ value }) => {
        //         setSelectedDivision(value);
        //     },
        //     placeholder: "בחר אוגדה",
        //     options: divisions?.map((division) => ({
        //         value: division._id,
        //         label: division.division_name,
        //     })),
        //     rules: [],
        //     span: 8,
        // },
        // {
        //     label: "חטיבה",
        //     name: "brigade",
        //     type: "select",
        //     disabled: selectedDivision == null,
        //     placeholder: "בחר חטיבה",
        //     options: brigades
        //         ?.filter((brigade) => {
        //             if (selectedDivision == null) {
        //                 return true;
        //             } else {
        //                 return brigade?.division?._id === selectedDivision;
        //             }
        //         })
        //         ?.map((brigade) => ({
        //             value: brigade._id,
        //             label: brigade.brigadeName,
        //         })),
        //     rules: [],
        //     span: 8,
        // },
        // {
        //     name: "unit",
        //     label: "יחידה",
        //     type: "select",
        //     options: unitOptions,
        //     rules: [{ required: true, message: "יש למלא שדה זה." }],
        //     span: 8,
        // },
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
            render: ({ renderFields }) => {
                if (voucherType == KABALA) {
                    return <VoucherTabs key="devicesData" renderFields={renderFields} />;
                } else {
                    return <VoucherDevices key="voucherDevices" setDefaultValues={setFormDefaultValues} />;
                }
            },
        },
    ];
    if (isProjectLoading) {
        return <Loader />;
    }
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
