import { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings({ canvasSettings, setCanvasSettings }: any) {
  const colorRef: any = useRef(null);

  const [cookies, setCookie] = useCookies(['canvasSettings']);
  useEffect(() => {
    if (
      cookies.canvasSettings == null ||
      cookies.canvasSettings == 'undefined'
    ) {
      setCookie('canvasSettings', canvasSettings);
      colorRef.current.value = '#FF0000';
    } else {
      colorRef.current.value = cookies.canvasSettings.sColor;
      setCanvasSettings(cookies.canvasSettings);
    }
  }, []);

  const colorChange = () => {
    setCookie('canvasSettings', {
      sColor: colorRef.current.value,
      sType: cookies.canvasSettings.sType,
    });
    setCanvasSettings(cookies.canvasSettings);
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
