import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ProjectData } from './ProjectComponents/ProjectData';
import { DeviceCard } from './ProjectComponents/DeviceCard';


export const ProjectPage = () => {
  const { id } = useParams();
  const project = useSelector((state) => {
    try {
      return state.project.projects.find((project) => project.id === id);
    } catch (error) {
      return null;
    }
  });
  if (!project)
    return (
      <Card>
        <Card.Body>
          <Card.Title className='py-3 text-center text-danger'>
            לא נמצא פרוייקט!
          </Card.Title>
        </Card.Body>
      </Card>
    )
  return (
    <>
      <Card className='bg-transparent border-0 shadow-none'>
        <Card.Body>
          <ProjectData />
          <DeviceCard />
        </Card.Body>
      </Card>

    </>)
}

