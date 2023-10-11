import { Dropdown } from 'react-bootstrap';

export function ContextMenu() {
  return (
    <Dropdown.Menu className="scrollable-menu context-menu">
      <Dropdown.Item id="context-resize" className="dropdown-item context-item">
        Resize
      </Dropdown.Item>
      <Dropdown.Item id="context-delete" className="dropdown-item context-item">
        Resize
      </Dropdown.Item>
    </Dropdown.Menu>
  );
}
