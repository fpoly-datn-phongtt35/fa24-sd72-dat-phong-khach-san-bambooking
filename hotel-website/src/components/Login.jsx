import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState(''); // Trạng thái email
  const [matKhau, setMatKhau] = useState(''); // Trạng thái mật khẩu
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
  const navigate = useNavigate(); // Hook điều hướng trang

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8080/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, matKhau })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data); // Log dữ liệu nhận được
        alert('Đăng nhập thành công!');

        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/profile'); // Điều hướng đến trang chủ sau khi đăng nhập
        window.location.reload();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log('Error data:', data.message); // Log chi tiết lỗi
          setErrorMessage(data.message || 'Đăng nhập thất bại!');
        } else {
          const errorText = await response.text();
          console.log('Error text:', errorText); // Log lỗi nếu không phải JSON
          setErrorMessage(errorText || 'Đăng nhập thất bại!');
        }
      }
    } catch (error) {
      console.error('Error connecting to server:', error); // Log lỗi kết nối
      setErrorMessage('Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Đăng Nhập</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
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
            type="password"
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
