import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p className="col-md-4 mb-0 text-muted">© 2024 F2C, Inc</p>

        <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <img className="bi me-2" width="60" height="60" src="./Images/f2c_logo 1.svg" alt="logo">
          </img>
        </a>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-muted">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/orders" className="nav-link px-2 text-muted">Orders</Link>
          </li>
          <li className="nav-item">
          <Link to="/cart" className="nav-link px-2 text-muted">My Cart</Link>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">FAQs</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">About</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
