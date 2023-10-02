import { DropdownCanvas } from './DropdownCanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { RiDeleteBin7Fill, RiEdit2Fill } from 'react-icons/ri';
import { TbReload } from 'react-icons/tb';
import { BiSolidAddToQueue } from 'react-icons/bi';
import { VscTriangleRight } from 'react-icons/vsc';
import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';
import { useState } from 'react';
import { AddCanvasModal } from './AddCanvasModal';
import { EditCanvasModal } from './EditCanvasModal';
import { DeleteCanvasModal } from './DeleteCanvasModal';

export function NavBar() {
  const [deleteCanvasShow, setDeleteCanvasShow] = useState(false);

  const handleDeleteCanvasClose = () => setDeleteCanvasShow(false);
  const handleDeleteCanvasShow = () => setDeleteCanvasShow(true);

  const [signInShow, setSignInShow] = useState(false);

  const handleSignInClose = () => setSignInShow(false);
  const handleSignInShow = () => setSignInShow(true);

  const [signUpShow, setSignUpShow] = useState(false);

  const handleSignUpClose = () => setSignUpShow(false);
  const handleSignUpShow = () => setSignUpShow(true);

  const [addCanvasShow, setAddCanvasShow] = useState(false);
  const [isAddArrowIcon, setIsAddArrowIcon] = useState(false);

  const handleAddCanvasClose = () => {
    setAddCanvasShow(false);
  };
  const handleAddCanvasShow = () => {
    setAddCanvasShow(true);
    setIsAddArrowIcon(!isAddArrowIcon);
  };

  const [editCanvasShow, setEditCanvasShow] = useState(false);
  const [isEditArrowIcon, setIsEditArrowIcon] = useState(false);

  const handleEditCanvasClose = () => {
    setEditCanvasShow(false);
  };
  const handleEditCanvasShow = () => {
    setEditCanvasShow(true);
    setIsEditArrowIcon(!isEditArrowIcon);
  };

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
            onClick={handleDeleteCanvasShow}
          >
            <RiDeleteBin7Fill />
          </Nav.Item>

          <EditCanvasModal
            show={editCanvasShow}
            handleClose={handleEditCanvasClose}
          />

          <Nav.Item
            className="btn btn-dark canvasOptionsButtons"
            id="canvasEditButton"
            onClick={handleEditCanvasShow}
          >
            {isEditArrowIcon ? <VscTriangleRight /> : <RiEdit2Fill />}
          </Nav.Item>

          <AddCanvasModal
            show={addCanvasShow}
            handleClose={handleAddCanvasClose}
          />

          <Nav.Item
            className="btn btn-dark canvasOptionsButtons"
            id="canvasPlusButton"
            onClick={handleAddCanvasShow}
          >
            {isAddArrowIcon ? <VscTriangleRight /> : <BiSolidAddToQueue />}
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

      <DeleteCanvasModal
        show={deleteCanvasShow}
        handleClose={handleDeleteCanvasClose}
      />

      <LoginModal
        show={signInShow}
        handleClose={handleSignInClose}
        showSignUp={handleSignUpShow}
      />

      <SignUpModal show={signUpShow} handleClose={handleSignUpClose} />
    </Navbar>
  );
}
