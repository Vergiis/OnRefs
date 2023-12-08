import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { MdAddCircle, MdOutlineTextFields } from 'react-icons/md';

export function TextAdd({
  modalAddTextClick,
  handleTextAddShow,
  isArrowIcon,
}: any) {
  const textRef: any = useRef(null);
  const colorRef: any = useRef(null);
  const sizeRef: any = useRef(null);
  const fontRef: any = useRef(null);
  const addText = () => {
    modalAddTextClick([
      {
        value: textRef.current.value,
        size:
          sizeRef.current.value == '' ? 12 : parseFloat(sizeRef.current.value),
        color: colorRef.current.value,
        font: fontRef.current.value,
        id: -1,
        action: 'Add',
      },
    ]);
  };
  const textEdit = () => {
    modalAddTextClick([
      {
        value: textRef.current.value,
        size:
          sizeRef.current.value == '' ? 12 : parseFloat(sizeRef.current.value),
        color: colorRef.current.value,
        font: fontRef.current.value,
        id: -1,
        action: 'Edit',
      },
    ]);
  };
  return (
    <Form className="addText">
      <Form.Group className="addOptionWindow" id="textAddToggle">
        <Form.Control
          type="text"
          placeholder="Text"
          className="addTextInput"
          id="addTextValue"
          ref={textRef}
          onChange={() => textEdit()}
        />
        <Form.Control
          type="number"
          min="0"
          placeholder="Size"
          className="addTextInput"
          id="addTextSize"
          ref={sizeRef}
          onChange={() => textEdit()}
        />
        <Form.Select
          aria-label="Font"
          className="addTextInput text-truncate"
          id="fontInput"
          ref={fontRef}
          onChange={() => textEdit()}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </Form.Select>
        <Form.Group className="addTextInput" id="addTextColorGroup">
          <Form.Label>Color :</Form.Label>
          <Form.Control
            type="color"
            id="addTextColor"
            ref={colorRef}
            onChange={() => textEdit()}
          />
        </Form.Group>
        <Form.Group className="addTextInput" id="addTextButtonsGroup">
          <MdAddCircle
            className="addTextIcon"
            onClick={() => {
              addText();
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Label id="addTextButton" onClick={handleTextAddShow}>
          {isArrowIcon ? (
            <FaArrowCircleLeft className="arrowButton" />
          ) : (
            <MdOutlineTextFields />
          )}
        </Form.Label>
      </Form.Group>
    </Form>
  );
}
