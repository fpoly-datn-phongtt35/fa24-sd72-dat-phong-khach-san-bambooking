// pages/Home.jsx
import React from 'react';
import '../styles/Home.css'; // Nếu cần thêm CSS riêng cho Home

export default function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Our Hotel Booking Platform</h1>
      <p>Book your stay with us and enjoy luxury and comfort.</p>
      <button className="explore-button">Explore Rooms</button>
    </div>
  );
}
