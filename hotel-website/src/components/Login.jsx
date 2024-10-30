import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import CSS cho trang Login

export default function Login() {
  const [email, setEmail] = useState(''); // Trạng thái email
  const [matKhau, setMatKhau] = useState(''); // Trạng thái mật khẩu
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn không cho trang reload
    setLoading(true); // Hiển thị loading

    try {
      // Gửi yêu cầu đăng nhập tới API backend
      const response = await fetch('http://localhost:8080/khach-hang/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau }), // Khớp với backend
      });

      if (response.ok) {
        const data = await response.json(); // Xử lý dữ liệu trả về từ backend

        // Thông báo đăng nhập thành công và điều hướng trang
        alert('Đăng nhập thành công!');
        navigate('/'); // Điều hướng về trang chủ
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Đăng nhập thất bại!'); // Hiển thị lỗi
      }
    } catch (error) {
      setErrorMessage('Không thể kết nối đến server.');
    } finally {
      setLoading(false); // Tắt loading sau khi xử lý xong
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Đăng Nhập</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleLogin}>
          {/* Trường nhập email */}
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Trường nhập mật khẩu */}
          <input
            type="password" // Đổi thành type="password" để bảo mật
            placeholder="Nhập mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />

          {/* Nút đăng nhập */}
          <button type="submit" disabled={loading}>
            {loading ? 'Vui lòng đợi...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
