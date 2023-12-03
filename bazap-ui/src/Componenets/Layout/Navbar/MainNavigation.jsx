import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const MainNavigation = () => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-white shadow-sm">
                <Container>
                    <Navbar.Brand className="me-5 me-md-10">
                        <img alt="Logo" src="/logo.jpg" className="h-70px logo-default" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mx-3">
                            <NavLink to="/" className="fw-bold text-dark" end>
                                דף הבית
                            </NavLink>
                        </Nav>
                        <Nav className="mx-3">
                            <NavLink to="/DeviceType" className="fw-bold text-dark" end>
                                סוגי מכשירים
                            </NavLink>
                        </Nav>
                        <Nav className="mx-3">
                            <NavLink to="/Unit" className="fw-bold text-dark" end>
                               יחידות
                            </NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default MainNavigation;
