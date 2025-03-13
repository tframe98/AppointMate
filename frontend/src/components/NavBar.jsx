import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../api/api";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">AppointMate</div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {isAuthenticated() && <Link to="/clients">Clients</Link>}
          {isAuthenticated() && <Link to="/employees">Employees</Link>}
          <span className="navbar-login" onClick={handleLogin}>
            Login
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;