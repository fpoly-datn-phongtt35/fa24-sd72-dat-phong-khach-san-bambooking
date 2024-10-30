import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate(); // Hook điều hướng

  const handleLoginClick = () => {
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Điều hướng đến trang đăng ký
  };

  const handleLogoutClick = () => {
    handleLogout(); // Gọi hàm logout từ App.jsx
    navigate('/'); // Sau khi đăng xuất, quay về trang chủ
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Hotel Booking</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/rooms">Phòng</Link></li>
        <li><Link to="/bookings">Đặt Phòng</Link></li>
        <li><Link to="/services">Dịch Vụ</Link></li>
        <li><Link to="/reports">Báo Cáo</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/profile">Tài Khoản</Link></li>
            <li>
              <button onClick={handleLogoutClick} className="logout-button">
                Đăng Xuất
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={handleLoginClick} className="login-button">
                Đăng Nhập
              </button>
            </li>
            <li>
              <button onClick={handleRegisterClick} className="sign-button">
                Đăng Ký
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
