import { useEffect, useRef } from 'react';

import $ from 'jquery';
import { Form, Nav } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';

export function EditCanvasModal({ show, handleClose }: any) {
  useEffect(() => {
    if (show) {
      $('#canvasEdit').animate(
        {
          width: 'toggle',
        },
        210
      );
      $('#canvasEdit').css('display', 'flex');
      handleClose();
    }
  });

  const inputRef = useRef(null);
  const editCanvas = () => {
    let name = inputRef.current.value;
    if (name == null || name.trim() == '') return;
  };

  return (
    <Nav.Item className="canvasNew" id="canvasEdit">
      <Form.Control
        id="canvasEditInput"
        type="text"
        placeholder="Change Name"
        name="canvasNewName"
        maxLength={12}
        minLength={3}
        ref={inputRef}
        value="123"
      />
      <AiFillPlusCircle className="canvasNewButton" onClick={editCanvas} />
    </Nav.Item>
  );
}
