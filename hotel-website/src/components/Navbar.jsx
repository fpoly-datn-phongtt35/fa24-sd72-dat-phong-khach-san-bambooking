import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const accessToken = localStorage.getItem("accessToken");
  const TIMEOUT_DURATION = 300000; // 5 phút (300000ms)

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("avatar");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  // Kiểm tra các đơn đặt phòng chưa xác nhận trong localStorage
  const checkPendingBookings = () => {
    const bookingKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("booking_data_")
    );

    const validBookingsCount = bookingKeys.reduce((count, key) => {
      const timeoutKey = key.replace("booking_data_", "booking_timeout_");
      const startTime = parseInt(localStorage.getItem(timeoutKey) || "0", 10);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = TIMEOUT_DURATION - elapsedTime;

      if (remainingTime > 0) {
        return count + 1;
      } else {
        // Xóa các đơn đã hết hạn
        localStorage.removeItem(key);
        localStorage.removeItem(timeoutKey);
        return count;
      }
    }, 0);

    setPendingBookingsCount(validBookingsCount);
  };

  // useEffect để kiểm tra trạng thái xác thực và đơn đặt phòng
  useEffect(() => {
    // Kiểm tra xác thực
    if (accessToken) {
      setIsAuthenticated(true);
      setUser(localStorage.getItem("user"));
      setAvatar(
        localStorage.getItem("avatar") === "null" ||
          !localStorage.getItem("avatar")
          ? "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
          : localStorage.getItem("avatar")
      );
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setAvatar(null);
    }

    // Kiểm tra đơn đặt phòng
    checkPendingBookings();

    // Cập nhật đơn đặt phòng mỗi 10 giây
    const interval = setInterval(checkPendingBookings, 10000);

    return () => clearInterval(interval);
  }, [accessToken]);

  // Toggle menu hồ sơ
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
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
            to="/rooms"
            className={location.pathname === "/rooms" ? "active" : ""}
          >
            PHÒNG
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
            to="/offers"
            className={location.pathname === "/offers" ? "active" : ""}
          >
            ƯU ĐÃI
          </Link>
        </li>
        <li className="pending-booking-link">
          <Link
            to="/pending-booking"
            className={location.pathname === "/pending-booking" ? "active" : ""}
          >
            ĐƠN ĐẶT PHÒNG ({pendingBookingsCount})
            {pendingBookingsCount > 0 && (
              <span className="badge">{pendingBookingsCount}</span>
            )}
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link
              to="/history"
              className={location.pathname === "/history" ? "active" : ""}
            >
              LỊCH SỬ ĐẶT PHÒNG
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/lookup"
            className={location.pathname === "/lookup" ? "active" : ""}
          >
            TRA CỨU
          </Link>
        </li>
      </ul>
      <div className="navbar-buttons d-flex align-items-center">
        <button className="book-now-button me-2" onClick={() => navigate("/")}>
          ĐẶT PHÒNG
        </button>
        {!isAuthenticated && location.pathname !== "/login" && (
          <button
            className="login-button me-2"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        )}
        {isAuthenticated && (
          <div className="user-profile-container position-relative">
            <div
              className="user-profile d-flex align-items-center"
              onClick={toggleProfileMenu}
              style={{ cursor: "pointer" }}
            >
              <img
                className="avatar rounded-circle me-2"
                src={avatar}
                alt="User Avatar"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              <div className="user-info">
                <span>{user || "Người dùng"}</span>
              </div>
            </div>
            {isProfileMenuOpen && (
              <div className="profile-menu position-absolute bg-white shadow-sm p-2">
                <button
                  className="logout-button w-100 text-start"
                  onClick={() => navigate("/account")}
                >
                  Tài khoản
                </button>
                <button
                  className="logout-button w-100 text-start"
                  onClick={logout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
        {!isAuthenticated && (
          <button
            className="sign-up-button"
            onClick={() => navigate("/signup")}
          >
            Đăng kí
          </button>
        )}
      </div>
    </nav>
  );
}