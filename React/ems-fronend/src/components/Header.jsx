import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Header.css'; // CSS cho giao diện

const HeaderComponents = () => {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate(); // Hook điều hướng

    // Lấy thông tin người dùng từ localStorage khi component được mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login', { replace: true }); // Điều hướng nếu không có thông tin người dùng
        } else {
            setUserInfo(user); // Cập nhật thông tin người dùng nếu tồn tại
        }
    }, []); 

    // Hàm mở/đóng dropdown khi nhấp vào avatar
    const toggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };


    return (
        <header className="navbar text-bg-info">
            <button className="navbar-item">Button</button>
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
                <li className="navbar-item">
                    {/* Avatar hình tròn */}
                    <div className="user-avatar" onClick={toggleUserInfo}>
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User Avatar"
                            className="avatar-img"
                        />
                    </div>

                    {/* Dropdown thông tin tài khoản */}
                    {showUserInfo && userInfo && (
                        <div className="user-info-dropdown">
                            <p>Tài khoản: {userInfo.tenDangNhap}</p>
                            <p>Trạng thái: {userInfo.trangThai}</p>
                        </div>
                    )}
                </li>
            </ul>
        </header>
    );
};

export default HeaderComponents;

