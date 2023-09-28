import { useEffect } from 'react';

import $ from 'jquery';
import { Form } from 'react-bootstrap';
import { AiOutlinePlusSquare } from 'react-icons/ai';

export function AddCanvasModal({ show, handleClose }: any) {
  useEffect(() => {
    if (show) {
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
      <Form.Label id="canvasNewButton">
        <AiOutlinePlusSquare />
      </Form.Label>
      </Form.Group>
    </div>
  );
}
