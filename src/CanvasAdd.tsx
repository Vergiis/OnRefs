import Form from 'react-bootstrap/Form';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useRef, useState } from 'react';
import $ from 'jquery';
import { BiImageAdd } from 'react-icons/bi';
import { FaArrowCircleLeft } from 'react-icons/fa';

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
      if (inputRef.current.value == '') handleCanvasAddShow();
    }, 300);
  };

  return (
    <Form className="canvasAddInput">
      <Form.Group id="imageAddToggle">
        <Form.Label id="imageAddError">Invalid URL</Form.Label>
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
      </Form.Group>
      <Form.Group id="canvasAddButton" onClick={handleCanvasAddShow}>
        {isArrowIcon ? (
          <FaArrowCircleLeft className="arrowButton" />
        ) : (
          <BiImageAdd />
        )}
      </Form.Group>
    </Form>
  );
}
