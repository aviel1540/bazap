import AddIcon from "@mui/icons-material/Add";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import VoucherStepper from "../NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import { useProject } from "../../../../Components/store/ProjectContext";
const AddVoucherAction = () => {
    const { onShow, onHide } = useCustomModal();
    const { projectId } = useProject();
    const addVoucher = () => {
        const formDefaultValues = {
            projectId,
        };
        onShow({
            title: "שובר חדש",
            name: "voucherStepper",
            body: <VoucherStepper onCancel={() => onHide("voucherStepper")} formDefaultValues={formDefaultValues} />,
        });
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={addVoucher}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="הוסף שובר" />
            </ListItemButton>
        </ListItem>
    );
};

export default AddVoucherAction;
