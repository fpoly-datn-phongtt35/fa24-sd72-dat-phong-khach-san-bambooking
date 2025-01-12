import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

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
  }, [room, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!room) return null;

  return (
    <div className="booking-confirmation-page">
      <div className="progress-bar">
        <div className="progress-step">
          <div className="progress-step-number progress-step-completed">1</div>
          <div className="progress-step-text">Thông tin khách hàng</div>
        </div>
        <div className="progress-step">
          <div className="progress-step-number progress-step-completed">2</div>
          <div className="progress-step-text">Chi tiết thanh toán</div>
        </div>
        <div className="progress-step">
          <div className="progress-step-number progress-step-active">3</div>
          <div className="progress-step-text">Đã xác nhận đặt phòng!</div>
        </div>
      </div>

      <div className="confirmation-message">
        <h2>Đặt phòng thành công!</h2>
        <p>Chúng tôi đã nhận được thanh toán của bạn và phòng đã được xác nhận.</p>
      </div>

      <div className="confirmation-details">
        <h3>Chi tiết đặt phòng</h3>
        <div className="summary-item">
          <h4>{room.name || 'Tên phòng không có sẵn'}</h4>
          <p>{guests} khách</p>
        </div>
        <div className="summary-item">
          <span>Nhận phòng:</span>
          <span>{checkInDate}</span>
        </div>
        <div className="summary-item">
          <span>Trả phòng:</span>
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
      </div>

      <div className="action-button">
        <button onClick={handleBackToHome} className="back-to-home-button">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
