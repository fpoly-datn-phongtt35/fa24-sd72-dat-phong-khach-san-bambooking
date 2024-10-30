import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Register from './components/Register';
import Login from './components/Login'; // Thêm Login
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [user, setUser] = useState(null); // Lưu thông tin người dùng

  const handleLogin = (userData) => {
    setIsLoggedIn(true); // Đặt trạng thái đăng nhập thành true
    setUser(userData); // Lưu thông tin người dùng đã đăng nhập
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Đặt trạng thái đăng xuất
    setUser(null); // Xóa thông tin người dùng
  };

  return (
    <Router>
      <div className="hotel-website">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/services" element={<Services />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/register"
                element={<Register handleRegister={handleLogin} />}
              />
              <Route
                path="/login"
                element={<Login handleLogin={handleLogin} />}
              />
              <Route
                path="/profile"
                element={
                  isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />
                }
              />
              <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
