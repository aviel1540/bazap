/* eslint-disable react/prop-types */
import { Card, Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CategoriesModal } from '../Modals/CategoriesModal';
import { ProjectRowData } from './ProjectRowData';
import ModalProject from '../../ModalProject';
export const ProjectData = () => {
    const { id } = useParams();
    const [showEditProject, setShowEditProject] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const project = useSelector((state) => {
        try {
            return state.project.projects.find((project) => project.id === id);
        } catch (error) {
            return null;
        }
    });
    const { projectName, unit, startDate, endDate } = project;
    const showModal = () => {
        setShowEditProject(true)
    }
    const handleCategoriesButton = () => {
        setShowCategories(true);
    }
    const hideCategoriesModal = () => {
        setShowCategories(false);
    }
    const hideModal = () => {
        setShowEditProject(false)
    }
    return (<>
        <Card className='mb-5 shadow-sm'>
            <Card.Body>
                <Card.Title className='mb-5 py-3 border-bottom'>
                    <Row>
                        <Col>
                            {projectName}
                        </Col>
                        <Col>
                            <Button variant="light" className="btn-light-primary float-end mx-2" onClick={showModal}>
                                ערוך פרוייקט</Button>
                            <Button variant="light" className="btn-primary float-end" onClick={handleCategoriesButton}>ניהול קטגוריות</Button>
                        </Col>
                    </Row>
                </Card.Title>
                <div className='p-4 pb-2'>
                    <ProjectRowData title='יחידה' data={unit} />
                    <ProjectRowData title='תאריך התחלה' data={startDate} />
                    {endDate && <ProjectData title='תאריך סיום' data={endDate} />}
                </div>
                <div>
                    {showCategories && <CategoriesModal categoriesArray={project.categories} hideModal={hideCategoriesModal} />}
                </div>
            </Card.Body>
        </Card>
        {showEditProject && <ModalProject modalTitle='עריכת פרוייקט' modalData={project} isEdit={true} hideModal={hideModal} />}
    </>)
}

