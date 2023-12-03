import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const CustomModal = ({
    show,
    title,
    showExitButton,
    showOkButton,
    okButtonHandler,
    showCancelButton,
    cancelButtonHandler,
    showFooter,
    children,
}) => {
    const [showModal, setShowModal] = useState(show);

    useEffect(() => {
        setTimeout(() => {
            setShowModal(show);
        }, 100);
    }, [show]);

    return (
        <Modal show={showModal} onHide={cancelButtonHandler}>
            <Modal.Header closeButton={showExitButton}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {showFooter && (
                <Modal.Footer>
                    {showCancelButton && (
                        <Button variant="secondary" onClick={cancelButtonHandler}>
                            Cancel
                        </Button>
                    )}
                    {showOkButton && (
                        <Button variant="primary" onClick={okButtonHandler}>
                            OK
                        </Button>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
};

CustomModal.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    showExitButton: PropTypes.bool,
    showOkButton: PropTypes.bool,
    okButtonHandler: PropTypes.func,
    showCancelButton: PropTypes.bool,
    cancelButtonHandler: PropTypes.func,
    showFooter: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

CustomModal.defaultProps = {
    showExitButton: true,
    showOkButton: true,
    okButtonHandler: () => {},
    showCancelButton: true,
    showFooter: false,
    cancelButtonHandler: () => {},
};

export default CustomModal;
