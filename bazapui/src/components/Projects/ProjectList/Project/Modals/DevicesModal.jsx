/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { FormControlItem } from '../ProjectComponents/FormControlItem';
import { PlusSquare } from 'react-bootstrap-icons';
import { BiDuplicate, BiTrash } from "react-icons/bi";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const EMPTY_DEVICE = {
    serial: '',
    category: ''
};
const DOWN_KEY_BOARD = 40;

export const DevicesModal = (props) => {
    const { id } = useParams();
    const [show, setShow] = useState(true);
    const { hideModal, devices, categories } = props
    const [allDevices, setDevices] = useState(devices);
    const [newDevice, setNewDevice] = useState(EMPTY_DEVICE);
    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            hideModal();
            setShow(true);
        }, 300);

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // let project = {
        //     id,
        //     categories: [...categories]
        // }
        // newCategory && project.categories.push(newCategory);
        // dispatch(updateCategories(project));
        setShow(false);
        setTimeout(() => {
            hideModal();
            setShow(true);
        }, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('new')) {
            if (name.includes('serial')) {
                let newDeviceItem = { ...newDevice };
                newDeviceItem.serial = value;
                setNewDevice(newDeviceItem);
            }
            if (name.includes('category')) {
                let newDeviceItem = { ...newDevice };
                newDeviceItem.category = value;
                setNewDevice(newDeviceItem);
            }
        } else {
            const index = parseInt(name.split('_')[1]);
            const updatedDevices = [...allDevices];
            updatedDevices[index] = value;
            setDevices(updatedDevices);
        }
    };
    const handlePlusClick = () => {
        let newDeviceItem = newDevice;
        if (newDeviceItem.serial) {
            setNewDevice(EMPTY_DEVICE);
            const updatedDevices = [...allDevices];
            updatedDevices.unshift(newDeviceItem);
            setDevices(updatedDevices);
        }
    }
    const handleDuplicateClick = () => {
        let newDeviceItem = newDevice;
        if (newDeviceItem.serial) {
            setNewDevice(EMPTY_DEVICE);
            const updatedDevices = [...allDevices];
            updatedDevices.unshift(newDeviceItem);
            setDevices(updatedDevices);
        }
    }
    const renderTooltip = (props) => {
        const { text, ...otherProps } = props;

        return (
            <Tooltip {...otherProps}>
                {text}
            </Tooltip>
        );
    };
    const rednerInputs = () => {
        let inputs = [];
        inputs.push(
            <Row key={'new'}>
                <Col lg={5}>
                    <FormControlItem index='new' value={newDevice.serial} handleChange={handleChange} name='device_serial' label="צ' מכשיר" />
                </Col>
                <Col lg={4}>
                    <FormControlItem index='new' value={newDevice.category} handleChange={handleChange} type='select' options={categories} name='device_category' label="קטגוריה" />
                </Col>
                <Col lg={3}>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={(props) => renderTooltip({ text: 'לחיצה על הכפתור הזה יוסיף שורה כולל הקטגוריה', ...props })}>
                        <Button variant="light" className="btn-icon btn-primary mt-4 mx-1" onClick={handlePlusClick}>
                            <BiDuplicate size={20} />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={(props) => renderTooltip({ text: 'לחיצה על הכפתור הזה יוסיף שורה ללא לשמור הקטגוריה', ...props })}>
                        <Button variant="light" className="btn-icon btn-light-secondary mt-4 mx-1" onClick={handlePlusClick}>
                            <PlusSquare size={20} />
                        </Button>
                    </OverlayTrigger>
                </Col>
            </Row>
        )
        allDevices.forEach((dev, index) => {
            inputs.push(
                <Row key={index}>
                    <Col lg={9}>
                        <FormControlItem key={index} index={index} value={dev.serial} handleChange={handleChange} label={`מכשיר ${index}`} name='device' />
                    </Col>
                    <Col lg={3}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 100, hide: 100 }}
                            overlay={(props) => renderTooltip({ text: 'לחיצה על הכפתור הזה ימחק את המכשיר', ...props })}>
                            <Button variant="light" className="btn-icon btn-light-danger mt-4 mx-1" onClick={handlePlusClick}>
                                <BiTrash size={20} />
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>

            )
        })
        return inputs;
    }
    const formKeyPress = (event) => {
        if (event.keyCode === DOWN_KEY_BOARD) {
            if (event.ctrlKey) {
                handleDuplicateClick();
            } else {
                handlePlusClick();
            }
        }
    }
    if (categories == null || categories.length === 0) {
        return (

            <Modal show={show} onHide={handleClose} size="lg" backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>ניהול מכשירים</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    יש להוסיף לפחות קטגוריה אחת
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>

                </Modal.Footer>
            </Modal>
        )
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>ניהול מכשירים</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onKeyDown={formKeyPress}>
                        {rednerInputs()}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        שמירה
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}