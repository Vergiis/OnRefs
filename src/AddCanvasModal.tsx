import { useEffect, useRef } from 'react';

import $ from 'jquery';
import { Form, Nav } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

export function AddCanvasModal({ show, handleClose }: any) {
  useEffect(() => {
    if (show) {
      $('#canvasAdd').animate(
        {
          width: 'toggle',
        },
        210
      );
      $('#canvasAdd').css('display', 'flex');
      handleClose();
    }
  }, [show]);

  let navigate = useNavigate();
  const inputRef = useRef(null);
  const addCanvas = () => {
    let id = uuidv4();
    let name = inputRef.current.value;
    if (name == null || name.trim() == '') return;

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
    <Nav.Item className="canvasNew" id="canvasAdd">
      <AiFillPlusCircle className="canvasNewButton" onClick={addCanvas} />
      <Form.Control
        id="canvasNewInput"
        type="text"
        placeholder="Add New"
        name="canvasName"
        maxLength={12}
        minLength={3}
        ref={inputRef}
      />
    </Nav.Item>
  );
}
