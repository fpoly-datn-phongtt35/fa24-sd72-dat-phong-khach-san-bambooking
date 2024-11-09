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
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
