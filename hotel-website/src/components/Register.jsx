import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 

export default function Register() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Gửi email để xác thực
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/khach-hang/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert(`Mật khẩu đã được gửi đến email: ${email}`);
        setStep(2);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      setErrorMessage('Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành đăng ký bằng mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/khach-hang/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, matKhau }), // Truyền đúng dữ liệu cần thiết
      });

      if (response.ok) {
        alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
        navigate('/login');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      setErrorMessage('Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng Ký</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Vui lòng đợi...' : 'Tiếp Theo'}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Vui lòng đợi...' : 'Đăng Ký'}
          </button>
        </form>
      )}
    </div>
  );
}
