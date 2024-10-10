import AddIcon from "@mui/icons-material/Add";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewVoucherPageAction = () => {
    const navigate = useNavigate();
    const addVoucher = () => {
        navigate(`Voucher/false`);
    };
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={addVoucher}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="הוסף שובר קבלה" />
            </ListItemButton>
        </ListItem>
    );
};

export default NewVoucherPageAction;
