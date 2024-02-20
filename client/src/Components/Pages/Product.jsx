import Table from "../Table";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../Pagination";
import { useParams } from "react-router";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";
import DropDown from "./DropDown";

const Product = () => {
  const [bodyData, setBodyData] = useState([]);
  const [headData, setHeadData] = useState([
    "C_ID",
    "C_Name",
    "Stock",
    "P_ID",
    "Product Name",
    "Brand",
    "MRP",
    "Discount",
  ]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(useParams().pageNumber)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState([]);
  let [categoryName, setCategoryName] = useState(useParams().categoryName);
  const [searchData, setSearchData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let url = `http://192.168.1.102:4000/category/product/`;
    if (categoryName !== "AllProducts")
      url = `http://192.168.1.102:4000/category/${categoryName}?page=${currentPage}&pageSize=5`;
    else
      url = `http://192.168.1.102:4000/category/product/?page=${currentPage}&pageSize=5`;

    axios
      .get(url)
      .then((res) => {
        setBodyData(res.data.result);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage, categoryName, navigate]);

  useEffect(() => {
    axios
      .get(`http://192.168.1.102:4000/category`)
      .then((res) => {
        let cat = {
          CD_ID: 0,
          CD: "AllProducts",
          stock: 1500,
          createdDate: "2024-03-14T18:30:00.000Z",
        };
        let com = [cat, ...res.data];
        setCategory(com);
        // console.log(com);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryName]);

  useEffect(() => {
    const url = `http://192.168.1.102:4000/category/search/${searchData}?page=${currentPage}&pageSize=5`;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        if (res.data.response !== undefined) {
          console.log(res.data.response);
          setBodyData(res.data.response.docs);
          setTotalPages(res.data.totalPages);
          setHeadData([
            "C_ID",
            "P_ID",
            "C_Name",
            "P_Name",
            "Brand",
            "MRP",
            "Discount",
            "Stock",
          ]);
          navigate(`/product/search/${searchData}/${currentPage}`);
        } else {
          setHeadData([
            "C_ID",
            "C_Name",
            "Stock",
            "P_ID",
            "Product Name",
            "Brand",
            "MRP",
            "Discount",
          ]);
          if (categoryName === undefined) setCategoryName("AllProducts");
          navigate(`/product/${categoryName}/${currentPage}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchData, currentPage, navigate, categoryName]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/product/${categoryName}/${page}`);
  };

  const handleChange = (e) => {
    let textsearch = e.target.value;
    textsearch = textsearch.trim();
    setSearchData(textsearch);
    setCurrentPage(1);
  };
  const handleSelect = (eventKey) => {
    setCategoryName(eventKey);
    setCurrentPage(1);
    setSearchData("");
    navigate(`/product/${eventKey}/1`);
  };

  return (
    <div>
      <NavBar flag={true} flag2={false} onChangeValue={handleChange} />
      <DropDown
        items={category}
        selectedItem={categoryName}
        onSelect={handleSelect}
      />
      <Table headData={headData} bodyData={bodyData} flag={false} />
      <Pagination
        totalPage={totalPages}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Product;
