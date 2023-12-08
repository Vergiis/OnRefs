import { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings({ selectionColor }: any) {
  const colorRef: any = useRef(null);

  const [cookies, setCookie] = useCookies(['canvasSettings']);
  useEffect(() => {
    if (
      cookies.canvasSettings == null ||
      cookies.canvasSettings == 'undefined'
    ) {
      setCookie('canvasSettings', { sColor: '#FF0000', sType: 'Normal' });
      colorRef.current.value = '#FF0000';
      selectionColor('#FF0000');
    } else {
      colorRef.current.value = cookies.canvasSettings.sColor;
      selectionColor(cookies.canvasSettings.sColor);
    }
  }, []);

  const colorChange = () => {
    setCookie('canvasSettings', {
      sColor: colorRef.current.value,
      sType: cookies.canvasSettings.sType,
    });
    selectionColor(colorRef.current.value);
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
