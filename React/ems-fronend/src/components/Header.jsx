import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Header.css';

const Header = ({ isAuthenticated }) => {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [avatar, setAvatar] = useState("https://res.cloudinary.com/dy9md2des/image/upload/v1744199850/rrbede72z7nagjdlrdx3.png");

    const navigate = useNavigate();

    // Lấy thông tin người dùng từ localStorage khi component được mount
    useEffect(() => {
        if (isAuthenticated) {
            const user = localStorage.getItem('user');
            if (user) {
                setUserInfo(user);
                setAvatar(localStorage.getItem('avatar'));
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
        localStorage.removeItem('user');
        localStorage.removeItem('avatar');
        setUserInfo(null); // Xóa user info khỏi state
        navigate("/login")
    };

    return (
        <header className="navbar">
            <ul className="navbar-navbar">
                {isAuthenticated && userInfo && (
                    <li className="navbar-item">
                        {/* Avatar hình tròn */}
                        <div className="user-avatar" onClick={toggleUserInfo}>
                            <img
                                alt="User Avatar"
                                className="avatar-img"
                                src={avatar}
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