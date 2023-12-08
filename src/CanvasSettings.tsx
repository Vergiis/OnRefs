import { Form } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings() {
  return (
    <Form className="canvasSettings">
      <Form.Group>
        <Form.Label id="canvasSettingsButton">
          <FaGear />
        </Form.Label>
      </Form.Group>
      <Form.Group className="canvasSettingsWindow" id="canvasSettingsToggle">
        <Form.Group className="addTextInput" id="addTextButtonsGroup">
          <MdAddCircle className="addTextIcon" />
        </Form.Group>
      </Form.Group>
    </Form>
  );
}
