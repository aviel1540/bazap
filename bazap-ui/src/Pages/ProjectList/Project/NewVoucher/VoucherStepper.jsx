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
        const isDeliveryVoucher = data.type == "false";
        if (isDeliveryVoucher) {
            // addVoucherOutMutation.mutate(data);
            alert(JSON.stringify(data));
        } else {
            let values = data;
            values.accessoriesData = values.accessoriesData.map((item) => {
                if (item.deviceTypeId && typeof item.deviceTypeId === "object" && item.deviceTypeId.value) {
                    return {
                        ...item,
                        deviceTypeId: item.deviceTypeId.value,
                    };
                }
                return item;
            });
            alert(JSON.stringify(data));
            // addVoucherMutation.mutate(values);
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
        <CustomForm steps={steps} onSubmit={handleSave} onCancel={onCancel} values={formDefaultValues} isLoading={isLoading}></CustomForm>
    );
};
VoucherStepper.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formDefaultValues: PropTypes.object,
};

export default VoucherStepper;
