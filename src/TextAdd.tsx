import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { MdAddCircle, MdOutlineTextFields } from 'react-icons/md';

export function TextAdd() {
  const [isArrowIcon, setIsArrowIcon] = useState(true);

  return (
    <Form className="addText">
      <Form.Group className="addOptionWindow">
        <Form.Control type="text" placeholder="Text" className="addTextInput" />
        <Form.Control
          type="number"
          min="0"
          placeholder="Size"
          className="addTextInput"
        />
        <Form.Group className="addTextInput" id="addTextColorGroup">
          <Form.Label>Color :</Form.Label>
          <Form.Control type="color" id="addTextColor" />
        </Form.Group>
        <Form.Group className="addTextInput" id="addTextButtonsGroup">
          <MdAddCircle className="addTextIcon" />
          <GiConfirmed className="addTextIcon" />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Label id="addTextButton">
          { isArrowIcon ? <FaArrowCircleLeft className="arrowButton" />
          : <MdOutlineTextFields />}
        </Form.Label>
      </Form.Group>
    </Form>
  );
}
