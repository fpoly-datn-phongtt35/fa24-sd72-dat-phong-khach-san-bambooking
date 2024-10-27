// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Quản lý khách sạn</h2>
      <ul className="sidebar-menu">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/rooms">Danh sách phòng</Link></li>
        <li><Link to="/bookings">Đặt phòng</Link></li>
        <li><Link to="/services">Dịch vụ</Link></li>
        <li><Link to="/customers">Khách hàng</Link></li>
        <li><Link to="/reports">Báo cáo</Link></li>
      </ul>
    </div>
  );
}
