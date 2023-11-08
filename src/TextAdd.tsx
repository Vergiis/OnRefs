import { Form } from 'react-bootstrap';
import { MdOutlineTextFields } from 'react-icons/md';

export function TextAdd() {
  return (
    <Form.Group className="addTextInput">
      <Form.Label id="addTextButton">
        <MdOutlineTextFields />
      </Form.Label>
    </Form.Group>
  );
}
