/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusSquare } from 'react-bootstrap-icons';
import { updateCategories } from '../../../projcetSlice';
import { useParams } from 'react-router-dom';
import { FormControlItem } from '../ProjectComponents/FormControlItem';

export const CategoriesModal = (props) => {
    const { id } = useParams();
    let { categoriesArray, hideModal } = props
    const [categories, setCategories] = useState(categoriesArray);
    const [newCategory, setNewCategory] = useState("");
    const [show, setShow] = useState(true);
    const dispatch = useDispatch();
    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            hideModal();
            setShow(true);
        }, 300);

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let project = {
            id,
            categories: [...categories]
        }
        newCategory && project.categories.push(newCategory);
        dispatch(updateCategories(project));
        setShow(false);
        setTimeout(() => {
            hideModal();
            setShow(true);
        }, 300);

    };

    const handlePlusClick = () => {
        let newCategoryValue = newCategory;
        if (newCategoryValue) {
            setNewCategory('');
            const updatedCategories = [...categories];
            updatedCategories.unshift(newCategoryValue);
            setCategories(updatedCategories);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category_new') {
            setNewCategory(value);
        } else {
            const index = parseInt(name.split('_')[1]);
            const updatedCategories = [...categories];
            updatedCategories[index] = value;
            setCategories(updatedCategories);
        }
    };

    const rednerInputs = () => {
        let inputs = [];
        inputs.push(
            <Row key={'new'}>
                <Col lg={9}>
                    <FormControlItem key='new' index='new' value={newCategory} handleChange={handleChange} label='קטגוריה חדשה' name='category' />
                </Col>
                <Col lg={3}>
                    <Button variant="light" className="btn-icon btn-light-primary mt-4" onClick={handlePlusClick}>
                        <PlusSquare size={20} />
                    </Button>
                </Col>
            </Row>

        )
        categories.forEach((cat, index) => {
            inputs.push(
                <FormControlItem key={index} index={index} value={cat} handleChange={handleChange} label={`קטגוריה ${index}`} name='category' />
            )
        })
        return inputs;
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>ניהול קטגוריות</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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

