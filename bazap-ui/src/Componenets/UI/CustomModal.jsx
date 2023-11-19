import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, children, modalPropeties }) => {
    const [showModal, setShowModal] = useState(show);
    const { savePropetries, cancelProperties, hasFooter } = modalPropeties;

    useEffect(() => {
        setTimeout(() => {
            setShowModal(show);
        }, 100);
    }, [show]);

    return (
        <Modal show={showModal} {...modalPropeties}>
            <Modal.Header closeButton>{modalPropeties.title && <Modal.Title>{modalPropeties.title}</Modal.Title>}</Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {hasFooter && (
                <Modal.Footer>
                    {savePropetries && (
                        <Button variant="primary" size="sm" className={savePropetries.className} onClick={savePropetries.handleSave}>
                            {savePropetries.label}
                        </Button>
                    )}
                    {cancelProperties && (
                        <Button variant="primary" size="sm" className={cancelProperties.className} onClick={cancelProperties.handleCancel}>
                            {cancelProperties.label}
                        </Button>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default CustomModal;
