import { useEffect, useRef } from 'react';

import $ from 'jquery';
import { Form, Nav } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

export function AddCanvasModal({ show, handleClose }: any) {
  useEffect(() => {
    if (show) {
      $('.canvasNew').animate(
        {
          width: 'toggle',
        },
        210
      );
      $('.canvasNew').css('display', 'flex');
      handleClose();
    }
  });

  let navigate = useNavigate();
  const inputRef = useRef(null);
  const addCanvas = () => {
    let id = uuidv4();
    let name = inputRef.current.value;
    if (name == null) name = 'Unnamed';

    localStorage.setItem(
      'cav' + String(id),
      JSON.stringify({
        canvasID: id,
        canvasChangeFlag: true,
        canvasName: name,
        canvasData: [],
        canvasPositionData: [
          {
            d: 1,
            e: 0,
            f: 0,
          },
        ],
      })
    );

    navigate('/load?canvas=' + id);
  };

  return (
    <Nav.Item className="canvasNew">
      <Form.Control
        id="canvasNewInput"
        type="text"
        placeholder="Name"
        name="canvasName"
        maxLength={12}
        minLength={3}
        ref={inputRef}
      />
      <AiFillPlusCircle className="canvasNewButton" onClick={addCanvas} />
    </Nav.Item>
  );
}
