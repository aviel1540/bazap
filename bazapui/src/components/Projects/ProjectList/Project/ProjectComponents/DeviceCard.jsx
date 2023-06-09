/* eslint-disable react/prop-types */
import { Card, Col, Row, Button } from "react-bootstrap"
import { useState } from 'react';
import { DevicesModal } from '../Modals/DevicesModal';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const DeviceCard = () => {
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const { id } = useParams();
    const project = useSelector((state) => {
        try {
            return state.project.projects.find((project) => project.id === id);
        } catch (error) {
            return null;
        }
    });
    const handleCategoriesButton = () => {
        setShowDeviceModal(true);
    }
    const hideCategoriesModal = () => {
        setShowDeviceModal(false);
    }

    return (
        <>
            <Card className='shadow-sm'>
                <Card.Body>
                    <Card.Title className='mb-5 py-3 border-bottom'>
                        <Row>
                            <Col>
                                ניהול מכשירים
                            </Col>
                            <Col>
                                <Button variant="light" className="btn-primary float-end" onClick={handleCategoriesButton}>ניהול מכשירים</Button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <div className='p-4 pb-2'>
                    </div>
                </Card.Body>
            </Card>
            {showDeviceModal && <DevicesModal devices={project.devices} categories={project.categories} hideModal={hideCategoriesModal} />}
        </>
    )
}