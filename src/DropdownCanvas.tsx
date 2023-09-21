import Dropdown from 'react-bootstrap/Dropdown';

export function DropdownCanvas(){
    return(
        <Dropdown className='list-inline-item'>
            <Dropdown.Toggle variant="info" id="canvasDropdownBtn" className='dropdownBtn navbar-text' aria-haspopup="true" aria-expanded="false">
                Unsaved*
            </Dropdown.Toggle>

            <Dropdown.Menu className='scrollable-menu' aria-labelledby="dropdownMenuButton" id="canvasesDropdown">
                <Dropdown.Item href="/load?canvas=" id='canvasItem' className='dropdown-item'>Action</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}