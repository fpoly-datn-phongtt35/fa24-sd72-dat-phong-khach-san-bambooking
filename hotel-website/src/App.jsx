import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [user, setUser] = useState(null); // Lưu thông tin người dùng

  // Kiểm tra trạng thái đăng nhập khi tải lại trang
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true); // Đặt trạng thái đăng nhập thành true
    setUser(userData); // Lưu thông tin người dùng đã đăng nhập
    localStorage.setItem('user', JSON.stringify(userData)); // Lưu thông tin vào localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Đặt trạng thái đăng xuất
    setUser(null); // Xóa thông tin người dùng
    localStorage.removeItem('user'); // Xóa thông tin đăng nhập khỏi localStorage
  };

  return (
    <Router>
      <div className="hotel-website">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div className="main-content">
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home user={user} />} /> {/* Truyền user vào Home */}
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
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
                  <Profile />
                } />
              <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
              
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}
