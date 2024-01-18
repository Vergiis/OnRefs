import { useEffect, useRef, useState } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { FaGear } from 'react-icons/fa6';

export function CanvasSettings({ canvasSettings, setCanvasSettings }: any) {
  const colorRef: any = useRef(null);
  const typeRef: any = useRef(null);
  const [type,setType] = useState("Top");

  const [cookies, setCookie] = useCookies(['canvasSettings']);
  useEffect(() => {
    if (
      cookies.canvasSettings == null ||
      cookies.canvasSettings == 'undefined'
    ) {
      setCookie('canvasSettings', canvasSettings);
      colorRef.current.value = canvasSettings.sColor;
      typeRef.current.value = canvasSettings.sType;
      setType(canvasSettings.sType)
    } else {
      colorRef.current.value = cookies.canvasSettings.sColor;
      typeRef.current.value = cookies.canvasSettings.sType;
      setType(cookies.canvasSettings.sType)
      setCanvasSettings(cookies.canvasSettings);
    }
  }, []);

  const settingChange = () => {
    setCookie('canvasSettings', {
      sColor: colorRef.current.value,
      sType: typeRef.current.value,
    });
    setType(typeRef.current.value)
    setCanvasSettings(cookies.canvasSettings);
  };

  const tooltip = type=="Top"?(
    <Tooltip id="tooltip">
      <strong>Always on top while moving</strong>
    </Tooltip>
  ):type=="Context"?(
    <Tooltip id="tooltip">
      <strong>Change order in context menu</strong>
    </Tooltip>
  ):<></>;


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
            onChange={settingChange}
          />
        </Form.Group>
        <Form.Label className="canvasSettingsLabels">
          Image Order Mode:
        </Form.Label>
        <OverlayTrigger placement="left" overlay={tooltip}>
          <Form.Select
            aria-label="Image Order"
            className="addTextInput text-truncate"
            id="selectionTypeInput"
            ref={typeRef}
            onChange={settingChange}
          >
            <option value="Top">Always On Top</option>
            <option value="Context">Context Menu</option>
          </Form.Select>
        </OverlayTrigger>
      </Form.Group>
    </Form>
  );
}
