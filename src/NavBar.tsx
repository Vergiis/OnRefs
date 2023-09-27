import { DropdownCanvas } from './DropdownCanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { RiDeleteBin7Fill, RiEdit2Fill } from 'react-icons/ri';
import { TbReload } from 'react-icons/tb';
import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';
import { useState } from 'react';

export function NavBar() {
  const [signInShow, setSignInShow] = useState(false);

  const handleSignInClose = () => setSignInShow(false);
  const handleSignInShow = () => setSignInShow(true);

  const [signUpShow, setSignUpShow] = useState(false);

  const handleSignUpClose = () => setSignUpShow(false);
  const handleSignUpShow = () => setSignUpShow(true);

  return (
    <Navbar
      expand="lg"
      className="navbar navbar-icon-top fixed-top navbar-dark bg-dark"
    >
      <Navbar.Brand href="/" className="brand">
        <img src="\img\logo.png" alt="Logo" height="30" />
      </Navbar.Brand>

      <Navbar.Toggle className="mobileToggle" />

      <Navbar.Collapse>
        <Nav className="ms-auto flex-row rightNav">
          <Nav.Item
            className="btn btn-dark canvasOptionsButtons"
            id="canvasDeleteButton"
          >
            <RiDeleteBin7Fill />
          </Nav.Item>
          <Nav.Item
            className="btn btn-dark canvasOptionsButtons"
            id="canvasEditButton"
          >
            <RiEdit2Fill />
          </Nav.Item>
          <div className="mobileButton">
            <DropdownCanvas />
          </div>
          <Nav.Link
            className="mobileButton"
            id="saveCanvas"
            onClick={handleSignInShow}
          >
            <TbReload />
            Saved Locally
          </Nav.Link>
          <Nav.Link
            className="mobileButton"
            id="signIn"
            onClick={handleSignInShow}
          >
            Sign In
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>

      <LoginModal
        show={signInShow}
        handleClose={handleSignInClose}
        showSignUp={handleSignUpShow}
      />

      <SignUpModal show={signUpShow} handleClose={handleSignUpClose} />
    </Navbar>
  );
}
