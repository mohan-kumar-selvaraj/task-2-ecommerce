import React from "react";
import { Dropdown } from "react-bootstrap";

const DropDown = ({ items, onSelect, selectedItem }) => {
  return (
    <div className="text-center m-2">
      <Dropdown onSelect={onSelect}>
        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
          {selectedItem ? selectedItem : "All Products"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item, index) => (
            <Dropdown.Item key={index} eventKey={item.CD}>
              {item.CD}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropDown;
