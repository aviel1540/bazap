import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import { useCustomModal } from "../store/CustomModalContext";

const CustomModal = () => {
    const { show, onHide, options } = useCustomModal();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Dialog open={show} onClose={onHide} fullScreen={fullScreen} fullWidth={true} maxWidth={options.maxWidth}>
            <DialogTitle id="responsive-dialog-title">{options.title}</DialogTitle>
            <DialogContent>{options.body}</DialogContent>
        </Dialog>
    );
};

CustomModal.propTypes = {
    // show: PropTypes.bool.isRequired,
    // title: PropTypes.string.isRequired,
    // cancelButtonHandler: PropTypes.func,
    // children: PropTypes.node.isRequired,
    // maxWidth: PropTypes.string,
};

CustomModal.defaultProps = {
    okButtonHandler: () => {},
    cancelButtonHandler: () => {},
    maxWidth: "md",
};

export default CustomModal;
