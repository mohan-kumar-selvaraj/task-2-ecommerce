import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./Components/Pages/Category";
import Product from "./Components/Pages/Product";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Category />}></Route>
        <Route exact path="/category" element={<Category />}></Route>
        <Route path="/product/:categoryName" element={<Product />}></Route>
        <Route
          path="/product/:categoryName/:pageNumber"
          element={<Product />}
        ></Route>
        <Route
          path="/product/search/:searchData/:pageNumber"
          element={<Product />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
