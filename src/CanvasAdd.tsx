import Form from 'react-bootstrap/Form';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { useState } from 'react';
import $ from 'jquery';

export function CanvasAdd() {
  const [canvasAddShow, setCanvasAddShow] = useState(false);

  const handleCanvasAddShow = () => {
    if (!canvasAddShow) {
      setCanvasAddShow(true);
      $('#canvasAddInput').animate(
        {
          width: 'toggle',
        },
        210
      );
    } else {
      $('#canvasAddInput').animate(
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
      <Form.Control id="canvasAddInput" type="text" placeholder="Image URL" />
    </Form.Group>
  );
}
