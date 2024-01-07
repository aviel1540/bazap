import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CustomModal = ({ show, title, cancelButtonHandler, children, maxWidth }) => {
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
                fullWidth={true}
                maxWidth={maxWidth}
                // PaperProps={{
                //     sx: {
                //         width: 1,
                //     },
                //     md: {
                //         width: 1,
                //     },
                //     lg: {
                //         width: 1,
                //     },
                // }}
            >
                <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    );
};

CustomModal.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    cancelButtonHandler: PropTypes.func,
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.string,
};

CustomModal.defaultProps = {
    okButtonHandler: () => {},
    cancelButtonHandler: () => {},
    maxWidth: "md",
};

export default CustomModal;
