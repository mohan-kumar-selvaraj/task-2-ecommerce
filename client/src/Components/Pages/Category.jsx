import React, { useEffect, useState } from "react";
import Table from "../Table";
import axios from "axios";
import NavBar from "../NavBar";

const Category = () => {
  const [bodyData, setBodyData] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.1.65:4000/category")
      .then((res) => {
        setBodyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <NavBar flag={false} />
      <Table
        headData={["Category Id", "Category Name", "Stock", "Date"]}
        bodyData={bodyData}
        flag={true}
      />
    </div>
  );
};

export default Category;
