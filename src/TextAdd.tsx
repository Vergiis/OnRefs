import { Form } from 'react-bootstrap';
import { MdOutlineTextFields } from 'react-icons/md';

export function TextAdd() {
  return (
    <Form className="addTextInput">
      <Form.Group>
        <Form.Label id="addTextButton">
          <MdOutlineTextFields />
        </Form.Label>
      </Form.Group>
    </Form>
  );
}
