import { useEffect, useRef } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
      colorRef.current.value = canvasSettings.sColor;
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

  let tooltip = (
    <Tooltip id="tooltip">
      <strong>Holy guacamole!</strong> Check this info.
    </Tooltip>
  );
  return (
    <Form className="canvasSettings">
      <Form.Group>
        <Form.Label id="canvasSettingsButton">
          <FaGear />
        </Form.Label>
      </Form.Group>
      <Form.Group className="canvasSettingsWindow" id="canvasSettingsToggle">
        <Form.Group className="addTextInput" id="canvasSettingsColorGroup">
          <Form.Label>Selection Color :</Form.Label>
          <Form.Control
            type="color"
            id="addTextColor"
            ref={colorRef}
            onChange={colorChange}
          />
        </Form.Group>
        <Form.Label className="canvasSettingsLabels">
          Image Order Mode:
        </Form.Label>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Form.Select
            aria-label="Font"
            className="addTextInput text-truncate"
            id="selectionTypeInput"
          >
            <option value="Arial">Always On Top</option>
            <option value="Verdana">Context Menu</option>
          </Form.Select>
        </OverlayTrigger>
      </Form.Group>
    </Form>
  );
}
