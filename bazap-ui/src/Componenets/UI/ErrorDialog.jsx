import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { useError } from "../Context/ErrorContext";
import { Box, Typography } from "@mui/material";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
export const ErrorDialog = () => {
    const { error, show, clearError } = useError();

    return (
        <Dialog open={show} fullWidth maxWidth="sm" onClose={clearError}>
            <DialogContent>
                <Box textAlign="center">
                    <DoNotDisturbAltIcon color="error" sx={{ fontSize: 80 }} />
                    <Typography>{error}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={clearError} color="primary">
                    אישור
                </Button>
            </DialogActions>
        </Dialog>
    );
};
