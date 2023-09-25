import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { BsGoogle } from 'react-icons/bs';

export function LoginModal({ show, handleClose }: any) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="modalHeader" closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalCore">
        <Form.Group className="modalInput" controlId="controlFormLogin">
          <Form.Label>Your username or email</Form.Label>
          <Form.Control type="email" placeholder="username/email@example.com" />
          <Form.Text className="modalError" id="loginError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <Form.Group className="modalInput" controlId="controlFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="password" />
          <Form.Text className="modalError" id="passwordError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <div id="rememberLoginCheckbox">
          <Form.Group controlId="controlRememberLoginCheckbox">
            <Form.Check
              className="modalCheckbox"
              type="checkbox"
              label="Remember Me"
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer className="modalCore">
        <Button
          className="modalButtons"
          id="signGoogleButton"
          variant="secondary"
          onClick={handleClose}
        >
          <BsGoogle id="googleIcon" />
          Sign in with Google
        </Button>
        <Button
          className="modalButtons"
          id="signUpButton"
          variant="secondary"
          onClick={handleClose}
        >
          Sign Up
        </Button>
        <Button
          className="modalButtons"
          id="signInButton"
          variant="primary"
          onClick={handleClose}
        >
          Sign In
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
