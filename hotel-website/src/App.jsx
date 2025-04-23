import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Rooms from './pages/Rooms';
import Information from './pages/Information';
import DetailTTDP from "./components/DetailTTDP";
import TTDP from "./components/TTDP";
import Lookup from "./pages/Lookup";
import LookupHistory from "./components/LookupHistory";
import LookupDetailTTDP from "./components/LookupDetailTTDP";
import ConfirmBooking from "./components/ConfirmBooking";
import LookupTTDP from "./components/LookupTTDP";
import History from "./pages/History";
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import './App.css';
import AboutPage from './pages/AboutPage';
import Signup from './components/Signup';
import HotelBookingForm from './pages/HotelBookingForm';
import HotelBookingConfirmation from './pages/HotelBookingConfirmation';
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
              {/* <Route path="/" element={<Home user={user} />} />  */}
              <Route path="/information" element={<Information />} />
              <Route path="/history" element={<History />} />
              <Route path="/ttdp/:idDatPhong" element={<TTDP />} />
              <Route path="/detail-ttdp/:idDatPhong/:idLoaiPhong" element={<DetailTTDP />} />
              <Route path="/lookup/ttdp/:idDatPhong" element={<LookupTTDP />} />
              <Route path="/lookup/detail-ttdp/:idDatPhong/:idLoaiPhong" element={<LookupDetailTTDP />} />
              <Route path="/confirm-booking/:iddp" element={<ConfirmBooking />} />
              <Route path="/lich-su-dat-phong/:email" element={<LookupHistory />} />
              <Route path="/lookup" element={<Lookup />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/booking" element={<HotelBookingForm />} />
              <Route path="/booking-confirmation" element={<HotelBookingConfirmation />} />
              {/* <Route
                path="/register"
                element={<Register handleRegister={handleLogin} />}
              /> */}
              <Route
                path="/login"
                element={<Login handleLogin={handleLogin} />}
              />

              <Route path="/signup" element={<Signup />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}
