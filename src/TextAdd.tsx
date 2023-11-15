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
  const addText = () => {
    modalAddTextClick([
      {
        value: textRef.current.value,
        size:
          sizeRef.current.value == '' ? 12 : parseFloat(sizeRef.current.value),
        color: colorRef.current.value,
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
          ref={textRef}
        />
        <Form.Control
          type="number"
          min="0"
          placeholder="Size"
          className="addTextInput"
          ref={sizeRef}
        />
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
