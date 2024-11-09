import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const [user, setUser] = useState(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Bam Booking</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>Phòng</Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Liên Hệ</Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Giới Thiệu</Link>
        </li>
        <li>
          <Link to="/rules" className={location.pathname === '/rules' ? 'active' : ''}>Quy Định</Link>
        </li>
      </ul>
      <div className="navbar-buttons">
        {user ? (
          <button onClick={handleLogoutClick} className="logout-button">
            Đăng Xuất
          </button>
        ) : (
          <>
            <button onClick={handleLoginClick} className="login-button">
              Đăng Nhập
            </button>
            <button onClick={handleRegisterClick} className="sign-button">
              Đăng Ký
            </button>
          </>
        )}
      </div>
    </nav>
  );
}


