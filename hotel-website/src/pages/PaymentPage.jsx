import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút tính bằng giây

  const {
    room,
    checkInDate,
    checkOutDate,
    guests,
    selectedServices,
    totalPrice,
  } = location.state || {};

  useEffect(() => {
    if (!room) {
      navigate('/booking');
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [room, navigate]);

  const handlePaymentConfirmation = () => {
    alert('Thanh toán thành công!');
    navigate('/confirmation');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!room) return null;

  return (
    <div className="payment-page">
      <div className="progress-bar">
        <div className="progress-step">
          <div className="progress-step-number progress-step-completed">1</div>
          <div className="progress-step-text">Thông tin khách hàng</div>
        </div>
        <div className="progress-step">
          <div className="progress-step-number progress-step-active">2</div>
          <div className="progress-step-text">Chi tiết thanh toán</div>
        </div>
        <div className="progress-step">
          <div className="progress-step-number">3</div>
          <div className="progress-step-text">Đã xác nhận đặt phòng!</div>
        </div>
      </div>

      <div className="timer">
        <span className="timer-icon">⏱</span>
        <span>Chúng tôi đang giữ giá cho quý khách... {formatTime(timeLeft)}</span>
      </div>

      <div className="payment-container">
        <div className="payment-form">
          <h2>Thanh toán an toàn</h2>
          <div className="card-type">
            <span className="card-icon">💳</span>
            <span>THẺ TÍN DỤNG/GHI NỢ</span>
          </div>
          <div className="form-group">
            <label htmlFor="cardName">Tên trên thẻ</label>
            <input type="text" id="cardName" placeholder="VD: NGUYEN VAN A" />
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Số thẻ tín dụng/thẻ ghi nợ</label>
            <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Ngày hết hạn</label>
              <select id="expiryDate">
                <option value="">MM/YY</option>
                <option value="01/24">01/24</option>
                <option value="02/24">02/24</option>
                {/* Thêm các tùy chọn khác */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cvc">Mã bảo mật CVC</label>
              <input type="text" id="cvc" placeholder="CVC" />
            </div>
          </div>
        </div>

        <div className="booking-summary">
          <h2>Chi Tiết Đặt Phòng</h2>
          <div className="summary-item">
            <h3>{room.name || 'Tên phòng không có sẵn'}</h3>
            <p>{guests} khách</p>
          </div>
          <div className="summary-item">
            <span>Nhận phòng</span>
            <span>{checkInDate}</span>
          </div>
          <div className="summary-item">
            <span>Trả phòng</span>
            <span>{checkOutDate}</span>
          </div>
          {selectedServices && selectedServices.length > 0 && (
            <div className="summary-item">
              <h4>Dịch vụ bổ sung:</h4>
              <ul>
                {selectedServices.map((service) => (
                  <li key={service.id}>
                    <span>{service.name}</span>
                    <span>{typeof service.price === 'number' ? service.price.toLocaleString() : service.price}đ</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="summary-total">
            <span>Tổng cộng</span>
            <span>{typeof totalPrice === 'number' ? totalPrice.toLocaleString() : totalPrice}đ</span>
          </div>
          <button onClick={handlePaymentConfirmation} className="confirm-payment-button">
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}