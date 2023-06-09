import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ModalProject from "./ModalProject";
import ProjectItem from "./ProjectItem/ProjectItem";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const EMPTY_DATA = {};
const MODAL_STRUCT = {
    modalTitle: 'פרוייקט חדש',
    projectData: EMPTY_DATA,
    isEdit: false,
    show: false
};

function ProjectsList() {
    const projects = useSelector((state) => state.project.projects);
    const [projectModalData, setProjectModalData] = useState(MODAL_STRUCT);
    const [projectList, setProjectList] = useState(projects);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            let allProjects = projects;
            if (search) {
                allProjects = allProjects.filter(
                    (p) =>
                        p.projectName.includes(search) || p.unit.includes(search)
                );
            }
            setProjectList(allProjects);
        }, 500); // Adjust the delay time (in milliseconds) as needed

        return () => clearTimeout(delaySearch);
    }, [projects, search]);


    const onChangeSearchHandler = (event) => {
        setSearch(event.target.value);
    };
    const renderProjectItems = () => {
        if(projectList.length ==0)
        return (
            <Col lg={12} className='fs-5 fw-bolder col py-3 text-center text-danger'>
            לא נמצאו פרוייקטים להצגה!
          </Col>
        )
        return projectList.map(item => {
            return <ProjectItem data={item} key={item.id} editProjectMethod={showModalEditProject} />
        })
    }
    const showModalNewProject = () => {
        setProjectModalData({
            ...MODAL_STRUCT,
            projectData: EMPTY_DATA,
            isEdit: false,
            show: true
        });
    }
    const showModalEditProject = (projectId) => {
        let project = projects.find(p => p.id == projectId);
        if (project) {
            let modalStruct = MODAL_STRUCT;
            modalStruct.isEdit = true;
            modalStruct.projectData = project;
            modalStruct.show = true;
            setProjectModalData({
                ...MODAL_STRUCT,
                isEdit: true,
                show: true,
                projectData: project
            });
        }
    }
    const hideModal = () => {
        let modalStruct = MODAL_STRUCT;
        modalStruct.show = false;
        setProjectModalData(modalStruct);
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>רשימת פרוייקטים</Card.Title>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Form className="d-flex">
                                <Form.Control
                                    type="search"
                                    placeholder="חפש פרוייקט"
                                    className="me-2"
                                    aria-label="Search"
                                    onChange={onChangeSearchHandler}
                                />
                            </Form>
                            <Button className='btn btn-light-primary' onClick={showModalNewProject}>
                                פרוייקט חדש
                            </Button>
                        </Col>
                    </Row>
                    <div className="bg-light my-3 rounded p-3">
                        <Row md={4}>
                            {renderProjectItems()}
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            {projectModalData.show &&
                <ModalProject modalTitle={projectModalData.modalTitle} isEdit={projectModalData.isEdit} modalData={projectModalData.projectData} hideModal={hideModal} />
            }
        </>
    );
}

export default ProjectsList;