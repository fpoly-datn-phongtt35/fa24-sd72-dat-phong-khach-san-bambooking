import React, { useState } from 'react';
import './register.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // Quản lý bước
  const [errorMessage, setErrorMessage] = useState(''); // Quản lý lỗi

  // Xử lý gửi email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/khach-hang/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert(`Mật khẩu đã được gửi đến email: ${email}`);
        setStep(2); // Chuyển sang bước nhập mật khẩu
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      setErrorMessage('Không thể kết nối đến server.');
    }
  };

  // Xử lý đăng nhập
  // const handlePasswordSubmit = (e) => {
  //   e.preventDefault();
  //   if (password === '123456') {
  //     alert('Đăng nhập thành công!');
  //   } else {
  //     alert('Mật khẩu không chính xác!');
  //   }
  // };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Đăng Ký Tài Khoản</h2>

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
            <button type="submit">Tiếp theo</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Đăng nhập</button>
          </form>
        )}

        <div className="login-link">
          <p>
            Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
