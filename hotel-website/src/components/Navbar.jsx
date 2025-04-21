import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const accessToken = localStorage.getItem('accessToken');
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const pendingData = localStorage.getItem("pendingData");
  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('avatar');
    localStorage.removeItem('user');
    setUser(null); // Clear user state on logout
    navigate("/");
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Kiểm tra dữ liệu
    if (!checkIn || !checkOut || !guests) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }
    if (parseInt(guests) <= 0) {
      alert("Số người phải lớn hơn 0!");
      return;
    }

    // Điều hướng đến /booking với dữ liệu
    navigate("/booking", {
      state: {
        ngayNhanPhong: checkIn,
        ngayTraPhong: checkOut,
        soNguoi: parseInt(guests),
      },
    });
    setIsOpen(false); // Đóng form sau khi submit
  };

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
      setAvatar(localStorage.getItem('avatar') === "null" ? "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" : localStorage.getItem('avatar'));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsAuthenticated(!!accessToken);
    const jsonData = JSON.parse(pendingData);
    console.log(jsonData);
  }, [accessToken]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <>
      {isOpen && (
        <nav style={{ backgroundColor: "#F5F5F5", height: "20vh" }}>
          <div className="container">
            <form className="row p-4" onSubmit={handleBooking}>
              <div className="col-6">
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Nhận phòng</label>
                      <input
                        type="date"
                        className="form-control"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Trả phòng</label>
                      <input
                        type="date"
                        className="form-control"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Người lớn</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button type="submit" className="btn btn-sm btn-custom">
                    Đặt phòng
                  </button>
                </div>
              </div>
            </form>
          </div>
        </nav>
      )}

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
          {/* <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              KHÁM PHÁ
            </Link>
          </li> */}
          <li>
            <Link
              to="/offers"
              className={location.pathname === "/offers" ? "active" : ""}
            >
              ƯU ĐÃI
            </Link>
          </li>
          {pendingData && (
            <li>
              <Link to="/pending-booking">ĐƠN ĐẶT PHÒNG</Link>
            </li>
          )}
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
        </ul>
        <div className="navbar-buttons d-flex align-items-center">
          <button className="book-now-button me-2" onClick={handleDropdown}>
            {isOpen ? "ĐÓNG" : "ĐẶT PHÒNG"}
          </button>
          {/* Show login button if not authenticated and not on login page */}
          {!isAuthenticated && location.pathname !== "/login" && (
            <button
              className="login-button me-2"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
          {/* Show user profile and logout button if authenticated */}
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
                  <span>{user}</span>
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
          {/* Show sign-up button if not authenticated */}
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
    </>
  );
}