import { Dropdown } from 'react-bootstrap';

export function ContextMenu({
  show,
  showDropdown,
  showTextDropdown,
  hideDropdown,
  contextDelete,
  contextResize,
  contextCopyURL,
  contextEditText,
  showSelectDropdown,
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
        {!showTextDropdown && !showSelectDropdown ? (
          <Dropdown.Item
            id="context-copy"
            className="dropdown-item context-item"
            onClick={contextCopyURL}
          >
            Copy Image URL
          </Dropdown.Item>
        ) : (
          <></>
        )}
        {!showTextDropdown && !showSelectDropdown ? (
          <Dropdown.Item
            id="context-resize"
            className="dropdown-item context-item"
            onClick={contextResize}
          >
            Resize
          </Dropdown.Item>
        ) : (
          <></>
        )}
        {showTextDropdown ? (
          <Dropdown.Item
            id="context-edit"
            className="dropdown-item context-item"
            onClick={contextEditText}
          >
            Edit
          </Dropdown.Item>
        ) : (
          <></>
        )}
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
