import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings() {
  const colorRef: any = useRef(null);

  const colorChange = () => {
    console.log(colorRef.current.value);
  };

  return (
    <Form className="canvasSettings">
      <Form.Group>
        <Form.Label id="canvasSettingsButton">
          <FaGear />
        </Form.Label>
      </Form.Group>
      <Form.Group className="canvasSettingsWindow" id="canvasSettingsToggle">
        <Form.Group className="addTextInput" id="addTextColorGroup">
          <Form.Label>Selection Color :</Form.Label>
          <Form.Control
            type="color"
            id="addTextColor"
            ref={colorRef}
            onChange={colorChange}
          />
        </Form.Group>
      </Form.Group>
    </Form>
  );
}
