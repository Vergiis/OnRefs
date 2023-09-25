import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export function SignUpModal({ show, handleClose }: any) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="modalHeader" closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalCore">
        <Form.Group className="modalInput" controlId="controlFormSignUp">
          <Form.Label>* Username (Between 3 and 10 characters)</Form.Label>
          <Form.Control type="text" placeholder="e.g. Pablo123" />
          <Form.Text className="modalError" id="signUpError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <Form.Group className="modalInput" controlId="controlSignUpEmail">
          <Form.Label>* Email</Form.Label>
          <Form.Control type="email" placeholder="e.g. email@example.com" />
          <Form.Text className="modalError" id="signUpEmailError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <Form.Group className="modalInput" controlId="controlSignUpPassword">
          <Form.Label>* Password (At least 6 characters)</Form.Label>
          <Form.Control type="text" placeholder="password" />
          <Form.Text className="modalError" id="signUpPasswordError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <Form.Group className="modalInput" controlId="controlSignUpCPassword">
          <Form.Label>* Confirm password</Form.Label>
          <Form.Control type="text" placeholder="confirm password" />
          <Form.Text className="modalError" id="signUpCPasswordError">
            test, test, 123
          </Form.Text>
        </Form.Group>

        <Form.Text id="signUpAgreeText">
          * By creating a OnRefs account, you agree to our{' '}
          <a href="/terms-of-service">Terms of Service</a> and{' '}
          <a href="/">Privacy Policy</a>. We'll occasionally send you account
          related emails.
        </Form.Text>
      </Modal.Body>
      <Modal.Footer className="modalCore">
        <Button
          className="modalButtons"
          id="signInButton"
          variant="primary"
          onClick={handleClose}
        >
          Sign Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
