import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Rooms.css'; // Nếu cần thêm CSS riêng cho Rooms

const mockRooms = [
  { id: 1, name: 'Deluxe Room', price: 120, description: 'A luxurious room with a sea view.', imageUrl: '/images/room1.jpg' }, // Cập nhật đường dẫn
  { id: 2, name: 'Standard Room', price: 80, description: 'Comfortable room for budget travelers.', imageUrl: '/images/room2.jpg' }, // Cập nhật đường dẫn
  { id: 3, name: 'Suite', price: 200, description: 'The best experience with premium services.', imageUrl: '/images/room3.jpg' } // Cập nhật đường dẫn
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập gọi API lấy danh sách phòng
    setRooms(mockRooms);
  }, []);

  const handleBookNow = (room) => {
    navigate('/booking', { state: { room } });
  };
  
  return (
    <div className="rooms-page">
      <h1>Available Rooms</h1>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.imageUrl} alt={room.name} className="room-image" />
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <p>Price: ${room.price} / night</p>
            <button onClick={() => handleBookNow(room)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
