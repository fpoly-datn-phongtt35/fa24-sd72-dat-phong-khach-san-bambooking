// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Hotel Booking</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/profile">Tài khoản</Link></li>
        <li><Link to="/login">Đăng nhập</Link></li>
      </ul>
    </nav>
  );
}
