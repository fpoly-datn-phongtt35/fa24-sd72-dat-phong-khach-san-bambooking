import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toggleSubmenu } from '../assets/Slidebar';
import '../assets/Slidebar.css'; // File CSS cho sidebar

function Sidebar() {

  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (id, activeSubmenu, setActiveSubmenu) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  return (
    <div className="sidebar">
      <ul>
        <li className="nav-item">
          <Link className="nav-link" to="/TrangChu">Trang chủ</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/DatPhong">Đặt phòng</Link>
        </li>

        {/* Quản lý phòng with submenu */}
        <li
          className={`nav-item has-submenu ${activeSubmenu === 1 ? 'active' : ''}`}
          onClick={() => toggleSubmenu(1, activeSubmenu, setActiveSubmenu)}
        >
          <Link className="nav-link" to="#">Quản lý phòng</Link>
          <ul className={`submenu ${activeSubmenu === 1 ? 'show' : ''}`}>
            <li className="nav-item">
              <Link className="nav-link" to="/phong">Phòng</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/QuanLyPhong">Quản lý phòng</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/LoaiPhong">Loại phòng</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/TienNghi">Tiện nghi phòng</Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/TienIch">Tiện ích</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/DichVu">Dịch vụ</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/hinh-anh">Hình ảnh</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/HoaDon">Hóa đơn</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/NhanVien">Nhân viên</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/KhachHang">Khách hàng</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/DangXuat">Đăng xuất</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
