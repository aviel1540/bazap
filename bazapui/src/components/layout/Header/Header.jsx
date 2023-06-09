import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className='shadow-sm bg-white' >
      <Container fluid className='mx-5'>
        <Navbar.Brand href="/">בצפ</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="respon
          sive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} end to="/">
              בית
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ProjectsList">
              פרויקטים
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="חיפוש"
              className="me-2"
              aria-label="חיפוש"
            />
            <Button variant="outline-success">חפש</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;