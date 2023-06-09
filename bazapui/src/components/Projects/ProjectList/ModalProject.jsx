/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addProject, updateProject } from '../projcetSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import he from 'date-fns/locale/he'; 
import { formatDate, parseDate } from '../../Utils/Utils';
import { PlusSquare } from 'react-bootstrap-icons';

function ModalProject(props) {
    const [show,setShow] = useState(true);
    const { modalTitle, modalData, isEdit, hideModal } = props;
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const dispatch = useDispatch();
    const [project, setProject] = useState({
        projectName: '',
        unit: '',
        startDate: formatDate(new Date())
    });

    useEffect(() => {
        if (isEdit) {
            setProject(modalData);
            setCategories(modalData.categories)
        }
    }, [isEdit, modalData]);


    const handleClose = () => {
        setShow(false);
         setTimeout(() => {
            hideModal();
            setShow(true);
        }, 300);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        let projectData = project;
        projectData.categories= [...categories];
        newCategory && projectData.categories.push(newCategory);
        if (isEdit) {
            dispatch(updateProject(projectData));
        } else {
            dispatch(addProject(projectData));
        }
        setProject({
            projectName: '',
            unit: '',
            startDate: '',
        });
        setCategories([]);
        setNewCategory('');
        setShow(false);
        setTimeout(() => {
           hideModal();
           setShow(true);
       }, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category_new') {
            setNewCategory(value);
        } else if(name.includes('category')) {
            const index = parseInt(name.split('_')[1]);
            const updatedCategories = [...categories];
            updatedCategories[index] = value;
            setCategories(updatedCategories);
        } else{
            setProject({
                ...project,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handlePlusClick = () => {
        let newCategoryValue = newCategory;
        if(newCategoryValue)
        {
            setNewCategory('');
            const updatedCategories = [...categories];
            updatedCategories.unshift(newCategoryValue);
            setCategories(updatedCategories);
        }
    }
    const handleDateChange = (date) => {
        const formattedDate = formatDate(date);
        setProject({
            ...project,
            startDate: formattedDate,
        });
    };

    const rednerInputs = () => {
        let inputs = [];
        inputs.push(
            <Row key={'new'}>
                <Col lg={9}>
                    <Form.Group controlId="category_new">
                        <Form.Label>קטגוריה חדשה:</Form.Label>
                        <Form.Control
                            type="text"
                            name="category_new"
                            value={newCategory}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col lg={3}>
                    {/* BsPlusSquare */}
                    <Button variant="light" className="btn-icon btn-light-primary mt-4" onClick={handlePlusClick}>
                        <PlusSquare size={20} />
                    </Button>
                </Col>
            </Row>

        )
        categories.forEach((cat, index) => {
            inputs.push(
                <Form.Group key={index} controlId={'category_' + index}>
                    <Form.Label>קטגוריה {index}:</Form.Label>
                    <Form.Control
                        type="text"
                        name={'category_' + index}
                        value={cat}
                        onChange={handleChange}
                    />
                </Form.Group>
            )
        })
        return inputs;
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="projectName">
                            <Form.Label>שם פרוייקט:</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectName"
                                value={project.projectName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="unit">
                            <Form.Label>יחידה:</Form.Label>
                            <Form.Control
                                type="text"
                                name="unit"
                                value={project.unit}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="startDate">
                            <Form.Label>תאריך התחלה:</Form.Label>
                            <DatePicker
                                selected={project.startDate ? parseDate(project.startDate) : new Date()}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                locale={he} // Set the locale to Hebrew
                                isRTL // Set right-to-left direction
                            />
                        </Form.Group>
                        {rednerInputs()}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {isEdit ? 'שמירת שינויים' : 'שמירה'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalProject;
