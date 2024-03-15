import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { useAlert } from "../store/AlertContext";
import { Box, Typography, Zoom } from "@mui/material";
import { forwardRef, useEffect } from "react";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Transition = forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});
const defualtOptions = {
    confirmButtonText: "אישור",
    cancelButtonText: "בטל",
    showCancel: false,
    handleConfirm: () => {
        return true;
    },
    handleCancel: () => {
        return true;
    },
    icon: "success",
};
export const AlertDialog = () => {
    const { alertRecord, show, clearAlert } = useAlert();

    const { showCancel, handleConfirm, handleCancel, icon, confirmButtonText, cancelButtonText } = alertRecord?.options
        ? alertRecord.options
        : defualtOptions;
    const handleConfirmClick = () => {
        let isValid = true;
        if (handleConfirm) {
            isValid = handleConfirm();
        }
        isValid && handleClearAlert();
    };
    const handleCancelClick = () => {
        let isValid = true;
        if (handleCancel) {
            isValid = handleCancel();
        }
        isValid && handleClearAlert();
    };
    const handleClearAlert = () => {
        clearAlert();
    };
    return (
        <Dialog open={show} TransitionComponent={Transition} fullWidth maxWidth="sm" onClose={handleClearAlert}>
            <DialogContent>
                <Box textAlign="center">
                    {icon == "success" && <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />}
                    {icon == "error" && <DoNotDisturbAltIcon color="error" sx={{ fontSize: 80 }} />}
                    {icon == "info" && <ErrorOutlineIcon color="info" sx={{ fontSize: 80 }} />}
                    {icon == "warning" && <HelpOutlineIcon color="warning" sx={{ fontSize: 80 }} />}
                    <Typography>{alertRecord?.message}</Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                {showCancel && (
                    <Button onClick={handleCancelClick} variant="contained" color="secondary">
                        {cancelButtonText ? cancelButtonText : defualtOptions.cancelButtonText}
                    </Button>
                )}
                <Button onClick={handleConfirmClick} variant="contained" color="primary">
                    {confirmButtonText ? confirmButtonText : defualtOptions.confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
