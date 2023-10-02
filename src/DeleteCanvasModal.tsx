import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function DeleteCanvasModal({ show, handleClose }: any) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="modalCore">
        <div className="deleteCanvasModalText">Are you sure?</div>
        <div className="modalError">
          You will delete only local version, Sign In if you want delete it
          permanently!
        </div>
      </Modal.Body>
      <Modal.Footer className="modalCore">
        <Button
          className="modalButtons"
          id="deleteCanvasButton"
          variant="primary"
          onClick={handleClose}
        >
          Delete
        </Button>
        <Button
          className="modalButtons"
          variant="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
