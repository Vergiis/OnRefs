import Form from 'react-bootstrap/Form';
import { AiOutlinePlusSquare } from 'react-icons/ai';

export function CanvasAdd() {
  return (
    <Form.Group className="canvasAddInput" controlId="controlCanvasAdd">
      <Form.Label id="canvasAddButton">
        <AiOutlinePlusSquare />
      </Form.Label>
      <Form.Control type="text" placeholder="Image URL" />
    </Form.Group>
  );
}
