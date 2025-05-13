import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css"
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
