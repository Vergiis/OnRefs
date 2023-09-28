import { useEffect } from 'react';

import $ from 'jquery';
import { Form } from 'react-bootstrap';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { BsTriangleFill } from 'react-icons/bs';

export function AddCanvasModal({ show, handleClose }: any) {
  useEffect(() => {
    if (show) {
      $('#canvasNew').animate(
        {
          height: 'toggle',
        },
        210
      );
      handleClose();
    }
  });
  return (
    <div id="canvasNew">
      <Form.Group className="canvasNew">
        <Form.Control
          id="canvasNewInput"
          type="text"
          placeholder="123456789012"
        />
        <Form.Label className="canvasNewButton">
          <AiOutlinePlusSquare />
        </Form.Label>
        <Form.Label className="canvasNewButton" id="canvasNewClose">
          <BsTriangleFill />
        </Form.Label>
      </Form.Group>
    </div>
  );
}
