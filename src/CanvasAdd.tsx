import Form from 'react-bootstrap/Form';
import { AiFillPlusCircle, AiOutlinePlusSquare } from 'react-icons/ai';
import { useState } from 'react';
import $ from 'jquery';

export function CanvasAdd() {
  const [canvasAddShow, setCanvasAddShow] = useState(false);

  const handleCanvasAddShow = () => {
    if (!canvasAddShow) {
      setCanvasAddShow(true);
      $('#canvasAddImage').animate(
        {
          width: 'toggle',
        },
        210
      );
    } else {
      $('#canvasAddImage').animate(
        {
          width: 'toggle',
        },
        210
      );
      setCanvasAddShow(false);
    }
  };

  return (
    <Form.Group className="canvasAddInput">
      <Form.Label id="canvasAddButton" onClick={handleCanvasAddShow}>
        <AiOutlinePlusSquare />
      </Form.Label>
      <div id="canvasAddImage" className="canvasAddImage">
        <Form.Control type="text" placeholder="Image URL" />
        <AiFillPlusCircle className="canvasNewButton" />
      </div>
    </Form.Group>
  );
}
