// Profile.jsx
import React from 'react';

export default function Profile({ user }) {
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
