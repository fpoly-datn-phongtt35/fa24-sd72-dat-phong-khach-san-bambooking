// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Navbar.css';

// export default function Navbar({ isLoggedIn, handleLogout }) { // Thêm `user` để hiển thị thông tin người dùng
//   const navigate = useNavigate(); // Hook điều hướng
//   const [user, setUser] = useState(null);
//   const handleLoginClick = () => {
//     navigate('/login'); // Điều hướng đến trang đăng nhập
//   };

//   const handleRegisterClick = () => {
//     navigate('/register'); // Điều hướng đến trang đăng ký
//   };

//   const handleLogoutClick = () => {
//     localStorage.removeItem('user');
//     navigate('/'); // Sau khi đăng xuất, quay về trang chủ
//     window.location.reload();
//   };
//   useEffect(() => {
//     // Lấy thông tin người dùng từ localStorage khi component được mount
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setUser(JSON.parse(userData)); // Chuyển đổi từ chuỗi JSON thành đối tượng
//     }
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <Link to="/">Hotel Booking</Link>
//       </div>
//       <ul className="navbar-links">
//         <li><Link to="/rooms">Phòng</Link></li>
//         <li><Link to="/bookings">Đặt Phòng</Link></li>
//         <li><Link to="/services">Dịch Vụ</Link></li>
//         <li><Link to="/reports">Báo Cáo</Link></li>

//         {user ? (
//           <>
//             <li>
//               <button onClick={handleLogoutClick} className="logout-button">
//                 Đăng Xuất
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <button onClick={handleLoginClick} className="login-button">
//                 Đăng Nhập
//               </button>
//             </li>
//             <li>
//               <button onClick={handleRegisterClick} className="sign-button">
//                 Đăng Ký
//               </button>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Bam Booking</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>Phòng</Link>
        </li>
        <li>
          <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>Đặt Phòng</Link>
        </li>
        <li>
          <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Dịch Vụ</Link>
        </li>
        <li>
          <Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>Báo Cáo</Link>
        </li>
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
      </div>
    </nav>
  );
}


