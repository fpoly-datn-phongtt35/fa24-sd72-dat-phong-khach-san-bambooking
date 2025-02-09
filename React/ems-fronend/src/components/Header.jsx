import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Header.css';

const Header = ({ isAuthenticated }) => {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    // Lấy thông tin người dùng từ localStorage khi component được mount
    useEffect(() => {
        if (isAuthenticated) {
            const user = localStorage.getItem('user');
            if (user) {
                setUserInfo(user); // Cập nhật thông tin người dùng nếu tồn tại
            }
        } else {
            setUserInfo(null); // Xóa thông tin người dùng khi chưa đăng nhập
        }
    }, [isAuthenticated]);

    // Hàm mở/đóng dropdown khi nhấp vào avatar
    const toggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    // Hàm xử lý đăng xuất
    const handleLogoutClick = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage khi đăng xuất
        setUserInfo(null); // Xóa user info khỏi state
        navigate("/login")
    };

    return (
        <header className="navbar">
            <ul className="navbar-navbar">
                <li className="navbar-item">
                    <Link className="navbar-link" to="#">Trang chủ</Link>
                </li>
                <li className="navbar-item">
                    <Link className="navbar-link" to="/DichVu">Dịch vụ</Link>
                </li>
                <li className="navbar-item">
                    <Link className="navbar-link" to="/NhanVien">Nhân viên</Link>
                </li>
                {isAuthenticated && userInfo && (
                    <li className="navbar-item">
                        {/* Avatar hình tròn */}
                        <div className="user-avatar" onClick={toggleUserInfo}>
                            <img
                                alt="User Avatar"
                                className="avatar-img"
                            />
                        </div>

                        {/* Dropdown thông tin tài khoản */}
                        {showUserInfo && (
                            <div className="user-info-dropdown">
                                <p>Tài khoản: {userInfo}</p>
                                <p>Trạng thái: Đang hoạt động</p>
                                <button onClick={handleLogoutClick} className="logout-button">
                                    Đăng Xuất
                                </button>
                            </div>
                        )}
                    </li>
                )}
            </ul>
        </header>
    );
};

export default Header