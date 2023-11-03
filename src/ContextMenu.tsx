import { Dropdown } from 'react-bootstrap';

export function ContextMenu({
  show,
  showDropdown,
  hideDropdown,
  contextDelete,
  contextResize,
}: any) {
  return (
    <Dropdown
      className="list-inline-item"
      id="context-menu"
      show={show}
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
    >
      <Dropdown.Menu>
        <Dropdown.Item
          id="context-copy"
          className="dropdown-item context-item"
          onClick={contextResize}
        >
          Copy Image URL
        </Dropdown.Item>
        <Dropdown.Item
          id="context-resize"
          className="dropdown-item context-item"
          onClick={contextResize}
        >
          Resize
        </Dropdown.Item>
        <Dropdown.Item
          id="context-delete"
          className="dropdown-item context-item"
          onClick={contextDelete}
        >
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
