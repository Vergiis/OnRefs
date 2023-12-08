import { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings() {
  const colorRef: any = useRef(null);

  const [cookies, setCookie] = useCookies(['canvasSettings']);
  useEffect(() => {
    if (cookies.canvasSettings == null) {
      setCookie('canvasSettings', { sColor: '#FF0000', stype: 'Normal' });
      colorRef.current.value = '#FF0000';
    } else {
      colorRef.current.value = cookies.canvasSettings.sColor;
    }
  }, []);

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
