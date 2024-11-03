// Profile.jsx
import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage khi component được mount
    const userData = localStorage.getItem('user');
    if (userData) {
        setUser(JSON.parse(userData)); // Chuyển đổi từ chuỗi JSON thành đối tượng
    }
}, []);
  return (
    <div className="profile-container">
      <h2>Thông Tin Khách Hàng</h2>
      {user ? (
        <p>Chào mừng, {user.email}!</p>
      ) : (
        <p>Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}
