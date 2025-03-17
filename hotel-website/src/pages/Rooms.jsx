import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Rooms.css'; // CSS file để tùy chỉnh giao diện
import { getAllLoaiPhong } from '../services/Rooms.js';

export default function Rooms() {
  const [roomTypes, setRoomTypes] = useState([]); // State để lưu danh sách loại phòng
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await getAllLoaiPhong(); 
        setRoomTypes(data); 
        console.log(data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách loại phòng:', error);
      }
    };

    fetchRoomTypes();
  }, []);


  const handleRoomClick = (maLoaiPhong) => {
    navigate(`/room/${maLoaiPhong}`); 
  };

  return (
    <div className="rooms-container">
      <h2>Danh sách loại phòng</h2>
      <div className="room-list">
        {roomTypes.length > 0 ? (
          roomTypes.map((room) => (
            <div
              key={room.maLoaiPhong}
              className="room-card"
              onClick={() => handleRoomClick(room.maLoaiPhong)}
            >
              {/* Hiển thị danh sách ảnh */}
              <div className="room-images">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]} // Hiển thị ảnh đầu tiên
                    alt={room.tenLoaiPhong}
                    className="main-image"
                  />
                ) : (
                  <div className="no-image">Không có ảnh</div>
                )}
                {/* Hiển thị các ảnh phụ nếu có */}
                <div className="thumbnail-images">
                  {room.images &&
                    room.images.slice(1, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${room.tenLoaiPhong}-${index}`}
                        className="thumbnail"
                      />
                    ))}
                </div>
              </div>

              {/* Thông tin loại phòng */}
              <div className="room-info">
                <h3>{room.tenLoaiPhong}</h3>
                <p className="room-code">Mã loại phòng: {room.maLoaiPhong}</p>
                <p className="room-area">Diện tích: {room.dienTich} m²</p>
                <p className="room-capacity">Số khách tối đa: {room.soKhachToiDa}</p>
                <p className="room-price">Đơn giá: {room.donGia.toLocaleString('vi-VN')} VNĐ</p>
                <p className="room-description">{room.moTa}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có loại phòng nào để hiển thị.</p>
        )}
      </div>
    </div>
  );
}