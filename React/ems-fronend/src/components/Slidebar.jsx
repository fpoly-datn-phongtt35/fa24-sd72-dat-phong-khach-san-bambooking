import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Slidebar.css'; // File CSS cho Sidebar

function Sidebar() {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (id) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  return (
    <div className="sidebar">
      <>
        <ul>
          <li className="nav-item">
            <Link className="nav-link" to="/TrangChu">Trang chủ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/giao-dien-tao-dp">Đặt phòng</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/quan-ly-dat-phong">Quản lý đặt phòng</Link>
          </li>

          {/* Quản lý phòng với submenu */}
          <li
            className={`nav-item has-submenu quan-ly-phong ${activeSubmenu === 1 ? 'active' : ''}`}
            onClick={() => toggleSubmenu(1)}
          >
            <div className="nav-link">Quản lý phòng</div>
            <ul className={`submenu ${activeSubmenu === 1 ? 'open' : ''}`}>
              <li className="nav-item">
                <Link className="nav-link" to="/phong">Phòng</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/LoaiPhong">Loại phòng</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/TienNghi">Tiện nghi phòng</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/TienIch">Tiện ích</Link>
              </li>
            </ul>
          </li>

        </ul>

        <ul>
          <li className="nav-item">
            <Link className="nav-link" to="/DichVu">Dịch vụ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/hinh-anh">Hình ảnh</Link>
          </li>

          <li
            className={`nav-item has-submenu quan-ly-phong ${activeSubmenu === 2 ? 'active' : ''}`}
            onClick={() => toggleSubmenu(2)}
          >
            <div className="nav-link">Hóa đơn</div>
            <ul className={`submenu ${activeSubmenu === 2 ? 'open' : ''}`}>
              <li className="nav-item">
                <Link className="nav-link" to="/tra-phong">Trả phòng</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/hoa-don">Quản lý hóa đơn</Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/NhanVien">Nhân viên</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/TaiKhoan">Tài Khoản</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/VaiTro">Vai Trò</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/khach-hang">Khách hàng</Link>
          </li>
        </ul>
      </>
    </div>
  );
}

export default Sidebar;
