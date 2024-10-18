import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { tenDangNhap: username, matKhau: password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Lưu thông tin người dùng vào localStorage
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true'); // Lưu trạng thái đăng nhập

        // Gọi hàm onLoginSuccess (nếu có) và điều hướng đến trang Nhân Viên
        if (onLoginSuccess) onLoginSuccess(userData);

        navigate('/*'); // Điều hướng sau khi đăng nhập
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setMessage('Sai tên đăng nhập hoặc mật khẩu!');
            break;
          case 500:
            setMessage('Lỗi máy chủ, vui lòng thử lại sau!');
            break;
          default:
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
        }
      } else {
        setMessage('Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;

