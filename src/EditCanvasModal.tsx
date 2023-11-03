import { useEffect, useRef, useState } from 'react';

import $ from 'jquery';
import { Form, Nav } from 'react-bootstrap';
import { GiConfirmed } from 'react-icons/gi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

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
  }, [show]);

  const [cookies] = useCookies(['canvasID']);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    let canvasID = cookies.canvasID;

    for (let key in localStorage) {
      if (key == 'cav' + canvasID) {
        let JSONdata = localStorage.getItem(key);
        if (JSONdata != null) {
          let data = JSON.parse(JSONdata);

          setInputValue(data.canvasName);
        }
      }
    }
  }, []);

  let navigate = useNavigate();
  const inputRef:any = useRef(null);
  const editCanvas = () => {
    let name = inputRef.current.value;
    if (name == null || name.trim() == '') return;

    let canvasID = cookies.canvasID;

    for (let key in localStorage) {
      if (key == 'cav' + canvasID) {
        let JSONdata = localStorage.getItem(key);
        if (JSONdata != null) {
          let data = JSON.parse(JSONdata);
          data.canvasName = name;

          localStorage.setItem('cav' + String(canvasID), JSON.stringify(data));

          navigate('/reload');
        }
      }
    }
  };

  return (
    <Nav.Item className="canvasNew" id="canvasEdit">
      <GiConfirmed className="canvasNewButton" onClick={editCanvas} />
      <Form.Control
        id="canvasEditInput"
        type="text"
        placeholder="Change Name"
        name="canvasNewName"
        maxLength={12}
        minLength={3}
        ref={inputRef}
        defaultValue={inputValue}
      />
    </Nav.Item>
  );
}
