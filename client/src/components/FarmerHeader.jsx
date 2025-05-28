import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';
import "../styles/Header.css";


function FarmerHeader() {
  return (
    <header className="p-2 mb-0 ">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            <img src="../Images/f2c_logo 1.svg" alt="log" width="50" height="80"/>
          </a>
          <h4 className='text-dark pe-3 pt-1'>F2C!</h4>
          {/* <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
          </form> */}
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li><Link to="/seller-home" className="nav-link">Dashboard</Link></li>
              <li><Link to="/seller-update-product" className="nav-link">Update Product</Link></li>
              <li><Link to="/seller-upload-product" className="nav-link">Upload Product</Link></li>
              <li><Link to="/seller-sales-history" className="nav-link">Sales History</Link></li>
          </ul>
          <div className="dropdown text-end">
            <Link to="/profile" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
            </Link>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#"><i className="fas fa-sliders-h fa-fw"></i> Account</a></li>
            <li><a className="dropdown-item" href="#"><i className="fas fa-cog fa-fw"></i> Settings</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item"><i className="fas fa-sign-out-alt fa-fw"></i> <LogoutButton /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FarmerHeader;
