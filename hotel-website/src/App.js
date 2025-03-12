// App.js
import React from "react";
import { Routes, Route } from "react-router-dom"; // Xóa BrowserRouter ở đây
import "./App.css";
import Navbar from "./components/Navbar";
import Rooms from "./pages/Rooms";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import HotelRules from "./pages/HotelRules";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
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
