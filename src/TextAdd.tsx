import { Form } from 'react-bootstrap';
import { BiRightArrow } from 'react-icons/bi';
import { GiConfirmed } from 'react-icons/gi';
import { MdAddCircle, MdOutlineTextFields } from 'react-icons/md';

export function TextAdd() {
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
          <GiConfirmed className="addTextIcon" />
          <MdAddCircle className="addTextIcon" />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Label id="addTextButton">
          <BiRightArrow />
          <MdOutlineTextFields />
        </Form.Label>
      </Form.Group>
    </Form>
  );
}
