import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export function DropdownCanvas() {
  const [buttonName, setButtonName] = useState('Unnamed');

  const [dropdownList, setDropdownList] = useState<any[]>([]);
  const updateDropdownList = (name: string, id: number) => {
    setDropdownList((dropdownList) => [
      ...dropdownList,
      { name: name, id: id },
    ]);
  };

  const [show, setShow] = useState(false);
  const showDropdown = () => {
    setShow(!show);
  };
  const hideDropdown = () => {
    setShow(false);
  };

  const [cookies] = useCookies(['canvasID']);

  useEffect(() => {
    for (let key in localStorage) {
      if (key.substring(0, 3) == 'cav') {
        let JSONdata = localStorage.getItem(key);
        if (JSONdata != null) {
          let data = JSON.parse(JSONdata);
          updateDropdownList(data.canvasName, data.canvasID);

          if (data.canvasID == cookies.canvasID) {
            setButtonName(data.canvasName);
          }
        }
      }
    }
  }, []);

  let navigate = useNavigate();
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
        {buttonName}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="scrollable-menu dropdownBackground"
        aria-labelledby="dropdownMenuButton"
      >
        {dropdownList.map((el) => (
          <Dropdown.Item
            onClick={() => {
              navigate('/load?canvas=' + el.id);
            }}
            id="canvasItem"
            className="dropdown-item"
            key={el.id}
          >
            {el.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
