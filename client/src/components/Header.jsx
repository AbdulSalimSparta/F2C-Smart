import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';
import "../styles/Header.css";


function Header() {
  return (
    <header className="p-2 mb-0 ">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            <img src="../Images/f2c_logo 1.svg" alt="log" width="50" height="80"/>
          </a>
          <h4 className='text-dark pe-3 pt-1'>F2C!</h4>
          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
          </form>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/category" className="nav-link">Category</Link></li>
              <li><Link to="/products" className="nav-link">Products</Link></li>
              <li><Link to="/cart" className="nav-link">Cart</Link></li>
          </ul>
          <div className="dropdown text-end">
            <Link to="/profile" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
            </Link>
            <ul className="dropdown-menu text-small">
              <li><LogoutButton /></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
