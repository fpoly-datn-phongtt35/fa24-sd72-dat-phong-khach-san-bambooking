// pages/Rooms.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Rooms.css'; // Nếu cần thêm CSS riêng cho Rooms

const mockRooms = [
  { id: 1, name: 'Deluxe Room', price: 120, description: 'A luxurious room with a sea view.' },
  { id: 2, name: 'Standard Room', price: 80, description: 'Comfortable room for budget travelers.' },
  { id: 3, name: 'Suite', price: 200, description: 'The best experience with premium services.' },
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Giả lập gọi API lấy danh sách phòng
    setRooms(mockRooms);
  }, []);

  return (
    <div className="rooms-page">
      <h1>Available Rooms</h1>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <p>Price: ${room.price} / night</p>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
