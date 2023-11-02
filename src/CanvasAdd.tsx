import Form from 'react-bootstrap/Form';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useState } from 'react';
import $ from 'jquery';
import { BsArrowLeftSquare, BsPlusSquare } from 'react-icons/bs';

export function CanvasAdd() {
  const [canvasAddShow, setCanvasAddShow] = useState(false);

  const handleCanvasAddShow = () => {
    if (!canvasAddShow) {
      setCanvasAddShow(true);
      $('#imageAddToggle').animate(
        {
          width: 'toggle',
        },
        210
      );
      setIsArrowIcon(!isArrowIcon);
    } else {
      $('#imageAddToggle').animate(
        {
          width: 'toggle',
        },
        210
      );
      setIsArrowIcon(!isArrowIcon);
      setCanvasAddShow(false);
    }
  };

  const [isArrowIcon, setIsArrowIcon] = useState(false);

  return (
    <Form.Group className="canvasAddInput">
      <Form.Label id="canvasAddButton" onClick={handleCanvasAddShow}>
        {isArrowIcon ? <BsArrowLeftSquare /> : <BsPlusSquare />}
      </Form.Label>
      <div id="imageAddToggle">
        <div id="canvasAddImage" className="canvasAddImage">
          <Form.Control type="text" placeholder="Image URL" />
          <AiFillPlusCircle className="imageAddButton" />
        </div>
      </div>
    </Form.Group>
  );
}
