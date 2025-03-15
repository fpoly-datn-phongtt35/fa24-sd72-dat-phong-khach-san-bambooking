import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutPage.css';
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from '../utils/constants';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  useEffect(() => {
    // Test API
    const getCustomer = async () => {
      try {

        await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/customer`).then(res => {
          console.log(res?.data?.data);
        })
      } catch (e) {
        console.log(e);
      }
    }
    getCustomer();
  }, [])

  return (
    <div className="about-page">
      <header className="about-header">
        <h1>Chào mừng đến với Khách sạn Sunrise</h1>
        <p>Nơi nghỉ dưỡng tuyệt vời cho kỳ nghỉ của bạn</p>
      </header>

      <section className="about-content">
        <div className="about-image">
          <img src="/hotel-website/public/images/room1.jpg" alt="Khách sạn Sunrise" />
        </div>
        <div className="about-text">
          <h2>Về chúng tôi</h2>
          <p>
            Khách sạn Sunrise là điểm đến lý tưởng cho những ai đang tìm kiếm sự kết hợp hoàn hảo giữa sang trọng và thoải mái.
            Tọa lạc tại trung tâm thành phố, chúng tôi cung cấp dịch vụ đẳng cấp 5 sao với tầm nhìn tuyệt đẹp ra biển.
          </p>
          <p>
            Với hơn 20 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào mang đến cho quý khách trải nghiệm lưu trú
            đáng nhớ với dịch vụ chuyên nghiệp và tiện nghi hiện đại.
          </p>
        </div>
      </section>

      <section className="features">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <i className="feature-icon location-icon"></i>
            <h3>Vị trí đắc địa</h3>
            <p>Nằm ở trung tâm thành phố, gần các điểm tham quan nổi tiếng</p>
          </div>
          <div className="feature-item">
            <i className="feature-icon comfort-icon"></i>
            <h3>Tiện nghi sang trọng</h3>
            <p>Phòng ốc hiện đại với đầy đủ tiện nghi cao cấp</p>
          </div>
          <div className="feature-item">
            <i className="feature-icon service-icon"></i>
            <h3>Dịch vụ xuất sắc</h3>
            <p>Đội ngũ nhân viên chuyên nghiệp, tận tâm 24/7</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Sẵn sàng cho kỳ nghỉ tuyệt vời?</h2>
        <p>Đặt phòng ngay hôm nay để nhận ưu đãi đặc biệt!</p>
        <button onClick={handleBookNow} className="cta-button">Đặt phòng ngay</button>
      </section>
    </div>
  );
}