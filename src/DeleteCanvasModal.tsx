import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function DeleteCanvasModal({ show, handleClose }: any) {
  let navigate = useNavigate();
  const [cookies] = useCookies(['canvasID']);
  const deleteCanvas = () => {
    let canvasID = cookies.canvasID;
    localStorage.removeItem('cav' + canvasID);

    let reload = true;

    for (let key in localStorage) {
      if (key.substring(0, 3) == 'cav') {
        let JSONdata = localStorage.getItem(key);
        if (JSONdata != null) {
          let data = JSON.parse(JSONdata);
          reload = false;
          navigate('/load?canvas=' + data.canvasID);
          break;
        }
      }
    }
    if (reload) navigate('/reload');
  };

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
          onClick={deleteCanvas}
        >
          Delete
        </Button>
        <Button
          className="modalButtons"
          id="closeCanvasButton"
          variant="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
