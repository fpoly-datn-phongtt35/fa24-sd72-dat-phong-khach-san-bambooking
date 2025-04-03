import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { signUp, verifyCode } from '../api';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 4) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

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
    setIsLoading(true); // Bật loading
    try {
      const res = await signUp(email);
      setError('');
      setToken(res.data);
      setStep(2);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message);
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 5) {
      setError('Vui lòng nhập đầy đủ mã xác minh!');
      return;
    }
    setIsLoading(true); // Bật loading
    try {
      const res = await verifyCode({
        code: verificationCode,
        encodedCode: token,
        email: email
      });
      if (res.data) {
        setError('');
        alert('Xác minh email thành công!');
        navigate('/login');
      } else {
        alert('Xác minh thất bại!');
      }
    } catch (err) {
      alert('Xác minh thất bại!');
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setCode(['', '', '', '', '']);
    setError('');
  };

  return (
    <div className="signup-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
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
                <button type="submit" className="signup-button" disabled={isLoading}>
                  Tiếp tục với email
                </button>
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
                <button type="submit" className="signup-button" disabled={isLoading}>
                  Xác minh email
                </button>
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