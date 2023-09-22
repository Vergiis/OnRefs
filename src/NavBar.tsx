import { DropdownCanvas } from './DropdownCanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function NavBar() {
  return (
    <Navbar
      expand="lg"
      className="navbar navbar-icon-top fixed-top navbar-dark bg-dark"
    >
      <Navbar.Brand href="/" className="brand">
        <img src="\img\logo.png" alt="Logo" height="30" />
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <Nav className="ms-auto flex-row rightNav">
          <Nav.Item className="mobileButton">
            <DropdownCanvas />
          </Nav.Item>
          <Nav.Item className="mobileButton">
            <a className="btn btn-light navbar-text" id="saveCanvas">
              Save
            </a>
          </Nav.Item>
          <Nav.Item className="mobileButton">
            <Nav.Link id="signIn">Sign In</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
