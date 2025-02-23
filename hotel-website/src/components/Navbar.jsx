import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { addDatPhongNgay } from '../DatPhong';

export default function Navbar({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Quản lý trạng thái dropdown
  const [bookingDetails, setBookingDetails] = useState({
    ngayNhanPhong: '',
    ngayTraPhong: '',
    soNguoi: 1,
  });

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để tránh vấn đề chênh lệch múi giờ
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleBookNow = () => {
    const phong = {
      khachHang: user,
      maDatPhong: '',
      ngayDat: getTodayDate(),
      tongTien: 0,
      datCoc: 0,
      ghiChu: "",
      trangThai: "Cho xac nhan",
    }
    addDatPhongNgay(phong)
      .then((response) => {
        const newId = response; // Lấy ID từ API trả về
        console.log('ID của đối tượng mới:', newId);
        navigate('/datphong', {
          state: {
            startDate: bookingDetails.ngayNhanPhong,
            endDate: bookingDetails.ngayTraPhong,
            guests: bookingDetails.soNguoi,
            id: newId,
          },
        });
      })
      .catch((error) => {
        console.error("Lỗi khi thêm mới đặt phòng:", error);
      });

    setDropdownOpen(false);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Lỗi phân tích JSON:', error);
      }
    } else {
      console.log('Không tìm thấy dữ liệu người dùng.');
    }
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/">Bam Booking</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>
            Phòng
          </Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Liên Hệ
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            Giới Thiệu
          </Link>
        </li>
        <li>
          <Link to="/rules" className={location.pathname === '/rules' ? 'active' : ''}>
            Quy Định
          </Link>
        </li>
        {user ? (
            <li>
            <Link to="/histories" className={location.pathname === '/histories' ? 'active' : ''}>
              Lịch sử đặt phòng
            </Link>
          </li>
        ) : null}
      </ul>
      <div className="navbar-buttons">
        {user ? (
          <button onClick={handleLogoutClick} className="logout-button">
            Đăng Xuất
          </button>
        ) : (
          <>
            <button onClick={handleLoginClick} className="login-button">
              Đăng Nhập
            </button>
            <button onClick={handleRegisterClick} className="sign-button">
              Đăng Ký
            </button>
          </>
        )}
        <button onClick={toggleDropdown} className="book-now-button">
          Đặt phòng ngay
        </button>
      </div>

      {/* Form Đặt Phòng */}
      {isDropdownOpen && (
        <div className="booking-form-container1">
          <div className="booking-form">
            <div className="form-item">
              <label>Ngày check-in:</label>
              <input
                type="date"
                name="ngayNhanPhong"
                value={bookingDetails.ngayNhanPhong}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-item">
              <label>Ngày check-out:</label>
              <input
                type="date"
                name="ngayTraPhong"
                value={bookingDetails.ngayTraPhong}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-item">
              <label>Số người:</label>
              <input
                type="number"
                name="soNguoi"
                min="1"
                value={bookingDetails.soNguoi}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleBookNow} className="confirm-button">
              Xác nhận
            </button>
          </div>
        </div>
      )}

    </div>

  );
}
