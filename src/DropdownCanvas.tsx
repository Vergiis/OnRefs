import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';

export function DropdownCanvas() {
  const [show, setShow] = useState(false);
  const showDropdown = () => {
    setShow(!show);
  };
  const hideDropdown = () => {
    setShow(false);
  };

  return (
    <Dropdown
      className="list-inline-item"
      show={show}
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
    >
      <Dropdown.Toggle
        variant="info"
        id="canvasDropdownBtn"
        className="dropdownBtn navbar-text"
        aria-haspopup="true"
        aria-expanded="false"
      >
        123456789012*
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="scrollable-menu dropdownBackground"
        aria-labelledby="dropdownMenuButton"
      >
        <Dropdown.Item
          href="/load?canvas="
          id="canvasItem"
          className="dropdown-item"
        >
          Action
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
