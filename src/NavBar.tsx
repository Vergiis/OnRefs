import { DropdownCanvas } from './DropdownCanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function NavBar() {
  return (
    <Navbar
      expand="lg"
      className="navbar navbar-icon-top fixed-top navbar-dark bg-dark"
    >
      <Navbar.Brand href="/">
        <img src="\img\logo.png" alt="Logo" height="30" />
      </Navbar.Brand>
      <Navbar.Collapse>
        <Nav className="ms-auto">
          <DropdownCanvas />
          <Nav.Item>
            <a className="btn btn-light navbar-text" id="saveCanvas">
              Save
            </a>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link id="signIn">Sign In</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
