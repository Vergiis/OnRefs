import { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { MdAddCircle, MdOutlineTextFields } from 'react-icons/md';

export function TextAdd({ modalAddTextClick }: any) {
  const [isArrowIcon, setIsArrowIcon] = useState(true);

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
      <Form.Group className="addOptionWindow">
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
        />
        <Form.Select
          aria-label="Font"
          className="addTextInput text-truncate"
          id="fontInput"
          ref={fontRef}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </Form.Select>
        <Form.Group className="addTextInput" id="addTextColorGroup">
          <Form.Label>Color :</Form.Label>
          <Form.Control type="color" id="addTextColor" ref={colorRef} />
        </Form.Group>
        <Form.Group className="addTextInput" id="addTextButtonsGroup">
          <MdAddCircle className="addTextIcon" />
          <GiConfirmed
            className="addTextIcon"
            onClick={() => {
              addText();
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Label id="addTextButton">
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
