import React from "react";

const ListGroup = (props) => {
  const { items, textProperty, valueProperty, onItemSelect, selectedItem } =
    props;
  // console.log(items);
  // console.log(selectedItem);
  // if(selectedItem === undefined) return ();
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          className={
            selectedItem === undefined
              ? "list-group-item"
              : item.CD_ID === selectedItem.CD_ID
              ? "list-group-item active"
              : "list-group-item"
          }
        >
          {item[textProperty]}
          {/* {console.log(item,selectedItem)} */}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "CD",
  valueProperty: "CD_ID",
};

export default ListGroup;
