import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <li onClick={handleLogout} className="dropdown-item">
      Logout
    </li>
  );
};

export default LogoutButton;
