import React from "react";

const NavBar = ({ flag, flag2, onSearch, onChangeValue, text }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a href="/category" className="navbar-brand">
        ECommerece
      </a>  
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/category">
              Category <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/product/AllProducts/1">
              Product <span className="sr-only">(current)</span>
            </a>
          </li>
        </ul>
      </div>
      {flag ? (
        <form className="form-inline" autoComplete="off">
          <input
            name="search"
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            value={text}
            aria-label="Search"
            onChange={onChangeValue}
          />
        </form>
      ) : null}
    </nav>
  );
};

export default NavBar;
