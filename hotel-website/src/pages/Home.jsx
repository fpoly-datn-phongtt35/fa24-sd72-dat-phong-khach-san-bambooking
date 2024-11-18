import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/images/room1.jpg',
    '/images/room2.jpg',
    '/images/room3.jpg',
    '/images/room4.jpg',
  ];

  const handleExploreClick = () => {
    navigate('/rooms');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-page">
      <div className="container">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Chào mừng đến với khách sạn Bam</h2>
          <p className="text-styling">
            Khách sạn Bam cung cấp các phòng nghỉ, với tiện nghi hiện đại, mang đến không gian nghỉ dưỡng lý tưởng cho du khách.
          </p>
          <p className="text-styling">
            Khách sạn cung cấp nhiều tiện ích từ nhà hàng ẩm thực, phòng gym, spa đến các dịch vụ tham quan thành phố.
            Hãy đến và cảm nhận sự hiếu khách, thoải mái để biến kỳ nghỉ của quý khách trở nên trọn vẹn và đáng nhớ.
          </p>
          <p className="text-styling font-italic text-center">
            Khách sạn Bam – Sự lựa chọn hoàn hảo cho những hành trình sang trọng và thư giãn.
          </p>
        </div>
      </div>

      <div className='slide-show'>
        <span>THE BAM HOTEL</span>
        <span>ROOM & SUITES</span>
        <hr />
        <div className="slideshow-container">
          <img
            src={images[currentImageIndex]}
            alt={`Room ${currentImageIndex + 1}`}
            className="slideshow-image"
          />
          <button className="explore-button" onClick={handleExploreClick}>Đặt phòng ngay</button>
        </div>
      </div>

      <div className="services-and-image">
        <div className="image-column">
          <div className="image-frame">
            <img src="/images/le-tan.jpg" alt="Lễ tân" className="large-image" />
            <div className="small-images-row">
              <img src="/images/gym-ha-noi.jpg" alt="Gym" className="small-image" />
              <img src="/images/dich-vu-cham-soc-phong.jpg" alt="Chăm sóc phòng" className="small-image" />
            </div>
          </div>
        </div>
        <div className="services-column">
          <span>THE BAM HOTEL</span>
          <span>DỊCH VỤ & TIỆN ÍCH</span>
          <hr />
          <ul>
            <li>Lễ tân trực 24/7</li>
            <li>Phục vụ phòng 24 giờ</li>
            <li>Truy cập Internet miễn phí</li>
            <li>Liệu trình chăm sóc sức khỏe tại Spa</li>
            <li>Trung tâm thể dục thể thao 24/7</li>
            <li>Thưởng thức tinh hoa ẩm thực</li>
            <li>Dịch vụ giặt là</li>
            <li>ATM</li>
            <li>Dịch vụ văn phòng: máy tính làm việc, Internet, phòng họp,...</li>
          </ul>
        </div>
      </div>


      {user ? (
        <div>
          <h2>Hello, {user.name || user.email}!</h2>
          <p>We are excited to have you here. Start booking your rooms now!</p>
        </div>
      ) : (
        <p>Please log in to book a room and enjoy exclusive benefits.</p>
      )}

    </div>
  );
}
