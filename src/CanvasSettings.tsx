import { Form } from 'react-bootstrap';
import { MdAddCircle, MdOutlineTextFields } from 'react-icons/md';

export function CanvasSettings() {
  return (
    <Form className="canvasSettings">
      <Form.Group className="addOptionWindow" id="canvasSettingsToggle">
        <Form.Control
          type="text"
          placeholder="Text"
          className="addTextInput"
          id="addTextValue"
        />

        <Form.Group className="addTextInput" id="addTextButtonsGroup">
          <MdAddCircle className="addTextIcon" />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Label id="addTextButton">
          <MdOutlineTextFields />
        </Form.Label>
      </Form.Group>
    </Form>
  );
}
