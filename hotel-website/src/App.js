// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Xóa BrowserRouter ở đây
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Footer from './components/Footer';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import Contact from './pages/Contact';
import AboutPage from './pages/AboutPage';
import HotelRules from './pages/HotelRules';
import BookingConfirmation from './pages/BookingConfirmation';
import DatPhong from './pages/DatPhong';
import TaoDatPhong from './pages/TaoDatPhong';
import LichSuDatPhong  from './pages/LichSuDatPhong';
function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rules" element={<HotelRules />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/datphong" element={<DatPhong />} />
            <Route path="/tao-dat-phong" element={<TaoDatPhong />} />
            <Route path="/histories" element={<LichSuDatPhong />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
