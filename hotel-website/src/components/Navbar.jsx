import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  }
  return (
    <>
      {
        isOpen && (
          <nav style={{ backgroundColor: '#F5F5F5', height: '20vh' }}>
            <div className="container">
              <div className="row p-4">
                <div className="col-3">
                  <h1>Đặt phòng ngay</h1>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-3">
                      <div className="mb-3">
                        <label className="form-label">Nhận phòng</label>
                        <input type="date" className="form-control" />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label className="form-label">Trả phòng</label>
                        <input type="date" className="form-control" />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label className="form-label">Phòng nghỉ</label>
                        <select className="form-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          {/* Thêm tùy chọn nếu cần */}
                        </select>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label className="form-label">Người lớn</label>
                        <select className="form-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          {/* Thêm tùy chọn nếu cần */}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <button className="btn btn-sm btn-custom">Đặt phòng</button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )
      }

      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">BamBooking</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link
              to="/information"
              className={location.pathname === "/information" ? "active" : ""}
            >
              THÔNG TIN KHÁCH SẠN
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={location.pathname === "/services" ? "active" : ""}
            >
              DỊCH VỤ
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              KHÁM PHÁ
            </Link>
          </li>
          <li>
            <Link
              to="/offers"
              className={location.pathname === "/offers" ? "active" : ""}
            >
              ƯU ĐÃI
            </Link>
          </li>
          <li>
            <Link
              to="/rooms"
              className={location.pathname === "/rooms" ? "active" : ""}
            >
              PHÒNG
            </Link>
          </li>
        </ul>
        <div className="navbar-buttons">
          <button className="book-now-button" onClick={handleDropdown}>
            {isOpen ? 'ĐÓNG' : 'ĐẶT PHÒNG'}
          </button>
        </div>
      </nav>
    </>
  );
}
