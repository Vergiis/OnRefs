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
        {/*Move*/}
        {!showSelectDropdown && <>
        <Dropdown.Item
          id="context-moveTop"
          className="dropdown-item context-item"
          onClick={contextDelete}
        >
          Move To Top
        </Dropdown.Item>
        <Dropdown.Item
          id="context-moveUp"
          className="dropdown-item context-item"
          onClick={contextDelete}
        >
          Move Up
        </Dropdown.Item>
        <Dropdown.Item
          id="context-moveDown"
          className="dropdown-item context-item"
          onClick={contextDelete}
        >
          Move Down
        </Dropdown.Item>
        <Dropdown.Item
          id="context-moveBotton"
          className="dropdown-item context-item"
          onClick={contextDelete}
        >
          Move To Bottom
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Divider />
        </>}
        {!showTextDropdown && !showSelectDropdown && (
          <Dropdown.Item
            id="context-copy"
            className="dropdown-item context-item"
            onClick={contextCopyURL}
          >
            Copy Image URL
          </Dropdown.Item>
        )}
        {!showTextDropdown && !showSelectDropdown && (
          <Dropdown.Item
            id="context-resize"
            className="dropdown-item context-item"
            onClick={contextResize}
          >
            Resize
          </Dropdown.Item>
        )}
        {showTextDropdown && (
          <Dropdown.Item
            id="context-edit"
            className="dropdown-item context-item"
            onClick={contextEditText}
          >
            Edit
          </Dropdown.Item>
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
