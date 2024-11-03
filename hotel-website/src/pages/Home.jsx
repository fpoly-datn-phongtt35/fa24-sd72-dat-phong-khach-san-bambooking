import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Danh sách đường dẫn ảnh phòng khách sạn
  const images = [
    '/images/room1.jpg', // Thay bằng tên file ảnh của bạn
    '/images/room2.jpg',
    '/images/room3.jpg',
    '/images/room4.jpg',
    // Thêm các ảnh khác nếu có
  ];

  const handleExploreClick = () => {
    navigate('/rooms'); // Điều hướng đến trang /rooms
  };
  // Tự động chuyển ảnh sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-page">
      <h1>Welcome to Our Bam Booking Platform</h1>
      <p>Book your stay with us and enjoy luxury and comfort.</p>

      <div className="slideshow-container">
        <img
          src={images[currentImageIndex]}
          alt={`Room ${currentImageIndex + 1}`}
          className="slideshow-image"
        />
      </div>

      {user ? (
        <div>
          <h2>Hello, {user.name || user.email}!</h2>
          <p>We are excited to have you here. Start booking your rooms now!</p>
        </div>
      ) : (
        <p>Please log in to book a room and enjoy exclusive benefits.</p>
      )}

      <button className="explore-button" onClick={handleExploreClick}>Explore Rooms</button>
    </div>
  );
}
