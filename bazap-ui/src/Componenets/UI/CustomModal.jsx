import { Dialog, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CustomModal = ({ show, title, cancelButtonHandler, children }) => {
    const [showModal, setShowModal] = useState(show);

    useEffect(() => {
        setTimeout(() => {
            setShowModal(show);
        }, 100);
    }, [show]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Dialog
                open={showModal}
                onClose={cancelButtonHandler}
                fullScreen={fullScreen}
                PaperProps={{
                    sx: {
                        width: 1 / 3,
                    },
                }}
            >
                <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {children}
                    <DialogContentText></DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
};

CustomModal.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    cancelButtonHandler: PropTypes.func,
    children: PropTypes.node.isRequired,
};

CustomModal.defaultProps = {
    okButtonHandler: () => {},
    cancelButtonHandler: () => {},
};

export default CustomModal;
