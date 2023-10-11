import { Dropdown } from 'react-bootstrap';

export function ContextMenu({ show, showDropdown, hideDropdown }: any) {
  return (
    <Dropdown
      className="list-inline-item"
      id="context-menu"
      show={show}
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
    >
      <Dropdown.Menu className="scrollable-menu" aria-labelledby="contextMenu">
        <Dropdown.Item
          id="context-resize"
          className="dropdown-item context-item"
        >
          Resize
        </Dropdown.Item>
        <Dropdown.Item
          id="context-delete"
          className="dropdown-item context-item"
        >
          Resize
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
