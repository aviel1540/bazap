import PropTypes from "prop-types";
import VoucherStep1 from "./VoucherStep1";
import VoucherStep2 from "./VoucherStep2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addVoucherIn, addVoucherOut, exportVoucherToExcel } from "../../../../Utils/voucherApi";
import { useProject } from "../../../../Components/store/ProjectContext";
import CustomForm from "../../../../Components/UI/CustomForm/CustomForm";

const VoucherStepper = ({ onCancel, formDefaultValues }) => {
    const queryClient = useQueryClient();
    const { projectId } = useProject();

    const steps = [
        { title: "יצירת שובר", render: () => <VoucherStep1 /> },
        { title: "הוספת מכשירים", render: () => <VoucherStep2 /> },
    ];

    const handleSave = (data) => {
        let values = { ...data };
        if (values.unit && typeof values.unit === "object" && values.unit.value) {
            values.unit = values.unit.value;
        }
        if (values.receivedBy && typeof values.receivedBy === "object" && values.receivedBy.value) {
            values.receivedBy = values.receivedBy.value;
        }
        if (values.arrivedBy && typeof values.arrivedBy === "object" && values.arrivedBy.value) {
            values.arrivedBy = values.arrivedBy.value;
        }
        const isDeliveryVoucher = values.type === "false";
        if (isDeliveryVoucher) {
            addVoucherOutMutation.mutate(values);
        } else {
            values.accessoriesData = values.accessoriesData.map((item) => {
                if (item.deviceTypeId && typeof item.deviceTypeId === "object" && item.deviceTypeId.value) {
                    return {
                        ...item,
                        deviceTypeId: item.deviceTypeId.value,
                    };
                }
                return item;
            });

            addVoucherMutation.mutate(values);
        }
    };

    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});
    const addVoucherOutMutation = useMutation(addVoucherOut, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["projects"]);
            queryClient.invalidateQueries(["project", projectId]);
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel();
        },
    });

    const addVoucherMutation = useMutation(addVoucherIn, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel();
        },
    });
    const isLoading = addVoucherOutMutation.isLoading || addVoucherMutation.isLoading;
    return (
        <CustomForm steps={steps} onSubmit={handleSave} onCancel={onCancel} values={formDefaultValues}  isLoading={isLoading}></CustomForm>
    );
};
VoucherStepper.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formDefaultValues: PropTypes.object,
};

export default VoucherStepper;
