import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { signUp, verifyCode } from '../api';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Quản lý bước: 1 (nhập email), 2 (xác minh email)
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '']); // Mã xác minh 5 ký tự
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Xử lý nhập email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Xử lý nhập mã xác minh
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Chỉ cho phép 1 ký tự mỗi ô
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Tự động focus ô tiếp theo nếu nhập xong
    if (value && index < 4) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  // Xử lý submit bước 1 (nhập email)
  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Vui lòng nhập địa chỉ email!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Địa chỉ email không hợp lệ!');
      return;
    }
    handleRequest();
  };

  const handleRequest = async () => {
    await signUp(email).then(res => {
      setError('');
      setToken(res.data);
      setStep(2);
    }).catch(err => {
      console.log(err);
      alert(err?.response?.data?.message)
    })
  }
  // Xử lý submit bước 2 (xác minh email)
  const handleCodeSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join('');

    if (verificationCode.length !== 5) {
      setError('Vui lòng nhập đầy đủ mã xác minh!');
      return;
    }

    await verifyCode({
      code: verificationCode,
      encodedCode: token,
      email: email
    }).then(res => {
      if (res.data) {
        setError('');
        alert('Xác minh email thành công!');
        navigate('/login');
      } else {
        alert('Xác minh thất bại!');
      }
    })

  };

  // Quay lại bước 1
  const handleBackToStep1 = () => {
    setStep(1);
    setCode(['', '', '', '', '']); // Reset mã xác minh
    setError('');
  };

  return (
    <div>
      <main className="main-container">
        <div className="signup-container">
          {step === 1 ? (
            <>
              <h1>Đăng nhập hoặc tạo tài khoản</h1>
              <p>Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.</p>

              {error && <p className="error-message">{error}</p>}

              <form className="signup-form" onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Địa chỉ email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>

                <button type="submit" className="signup-button">Tiếp tục với email</button>
              </form>
            </>
          ) : (
            <>
              <h1>Xác minh địa chỉ email của bạn</h1>
              <p>
                Chúng tôi đã gửi một mã xác minh đến <strong>{email}</strong>. Vui lòng nhập mã này để tiếp tục.
              </p>

              {error && <p className="error-message">{error}</p>}

              <form className="signup-form" onSubmit={handleCodeSubmit}>
                <div className="code-inputs">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="code-input"
                      required
                    />
                  ))}
                </div>

                <button type="submit" className="signup-button">Xác minh email</button>
              </form>

              <p className="resend-link">
                Bạn chưa nhận được email? Vui lòng kiểm tra mục thư rác hoặc yêu cầu gửi lại mã khác trong 50 giây.
              </p>

              <p className="back-link">
                <a href="#" onClick={handleBackToStep1}>Quay lại trang đăng ký</a>
              </p>

            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Signup;