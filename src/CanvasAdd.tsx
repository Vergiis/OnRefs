import Form from 'react-bootstrap/Form';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useRef, useState } from 'react';
import $ from 'jquery';
import { BsArrowLeftSquare, BsPlusSquare } from 'react-icons/bs';

export function CanvasAdd({ modalAddImageClick }: any) {
  const [canvasAddShow, setCanvasAddShow] = useState(false);

  const handleCanvasAddShow = () => {
    if (!canvasAddShow) {
      setCanvasAddShow(true);
      $('#imageAddToggle').animate(
        {
          width: 'toggle',
        },
        200
      );
      setIsArrowIcon(!isArrowIcon);
    } else {
      $('#imageAddToggle').animate(
        {
          width: 'toggle',
        },
        200
      );
      setIsArrowIcon(!isArrowIcon);
      setCanvasAddShow(false);
    }
  };

  const [isArrowIcon, setIsArrowIcon] = useState(false);
  const inputRef: any = useRef(null);

  const addImage = () => {
    modalAddImageClick(inputRef.current.value);
    setTimeout(() => {
      handleCanvasAddShow();
    }, 300);
  };

  return (
    <Form.Group className="canvasAddInput">
      <Form.Label id="canvasAddButton" onClick={handleCanvasAddShow}>
        {isArrowIcon ? <BsArrowLeftSquare /> : <BsPlusSquare />}
      </Form.Label>
      <div id="imageAddToggle">
        <Form.Label id="imageAddError">Wrong URL</Form.Label>
        <div id="canvasAddImage" className="canvasAddImage">
          <Form.Control
            type="text"
            placeholder="Image URL"
            id="addImageInput"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key == 'Enter') addImage();
            }}
          />
          <AiFillPlusCircle
            className="imageAddButton"
            onClick={() => {
              addImage();
            }}
          />
        </div>
      </div>
    </Form.Group>
  );
}
