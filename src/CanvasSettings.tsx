import { Form } from 'react-bootstrap';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings() {
  return (
    <Form className="canvasSettings">
      <Form.Group>
        <Form.Label id="canvasSettingsButton">
          <FaGear />
        </Form.Label>
      </Form.Group>
      <Form.Group
        className="canvasSettingsWindow"
        id="canvasSettingsToggle"
      ></Form.Group>
    </Form>
  );
}
