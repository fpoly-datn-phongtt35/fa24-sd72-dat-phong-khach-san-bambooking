import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Rooms.css';
import { getAllLoaiPhong, getAnhLP } from '../services/Rooms.js';

export default function Rooms() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomImages, setRoomImages] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const fetchRoomTypes = async () => {
    try {
      const response = await getAllLoaiPhong();
      setRoomTypes(response.data || []);
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách phòng.');
      console.error('Lỗi khi lấy danh sách loại phòng:', error);
    }
  };

  const fetchRoomImages = async (idLoaiPhong) => {
    try {
      const response = await getAnhLP(idLoaiPhong);
      const imagePaths = response.data.map((item) => item.duongDan).filter(Boolean);
      setRoomImages((prev) => ({
        ...prev,
        [idLoaiPhong]: imagePaths,
      }));
    } catch (error) {
      console.error(`Lỗi khi lấy ảnh cho ${idLoaiPhong}:`, error);
      setRoomImages((prev) => ({
        ...prev,
        [idLoaiPhong]: [],
      }));
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomTypes.length > 0) {
      roomTypes.forEach((room) => {
        fetchRoomImages(room.id);
      });
    }
  }, [roomTypes]);

  const handleRoomClick = (idLoaiPhong) => {
    navigate(`/room/${idLoaiPhong}`);
  };

  const openModal = (images, initialIndex = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(initialIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="rooms-container">
      <h2>Danh sách loại phòng</h2>
      <div className="room-list">
        {roomTypes.length > 0 ? (
          roomTypes.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-images-container">
                {roomImages[room.id] && roomImages[room.id].length > 0 ? (
                  <>
                    <img
                      src={roomImages[room.id][0]}
                      alt={`${room.tenLoaiPhong} - Ảnh chính`}
                      className="main-room-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(roomImages[room.id]);
                      }}
                    />
                    {roomImages[room.id].length > 1 && (
                      <div className="additional-images">
                        <div className="thumbnail-row">
                          {roomImages[room.id].slice(1, 4).map((imagePath, index) => (
                            <img
                              key={index + 1}
                              src={imagePath}
                              alt={`${room.tenLoaiPhong} - Ảnh ${index + 2}`}
                              className="thumbnail-room-image"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(roomImages[room.id], index + 1);
                              }}
                            />
                          ))}
                          {roomImages[room.id].length > 4 && (
                            <div className="show-more-overlay"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(roomImages[room.id]);
                              }}
                            >
                              <img
                                src={roomImages[room.id][3]}
                                alt={`${room.tenLoaiPhong} - Ảnh 4`}
                                className="thumbnail-room-image show-more-image"
                              />
                              <button
                                className="show-more-text"

                              >
                                Xem thêm
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Đang tải ảnh...</p>
                )}
              </div>
              <div className="room-info">
                <div className="room-details">
                  <h3>{room.tenLoaiPhong}</h3>
                  
                  <p className="room-area">Diện tích: {room.dienTich} m²</p>
                  <p className="room-capacity">Số khách tối đa: {room.soKhachToiDa}</p>
                  <p className="room-price">Đơn giá: {room.donGia.toLocaleString('vi-VN')} VNĐ</p>
                  <p className="room-description">{room.moTa}</p>
                </div>
                <button
                  className="book-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoomClick(room.id);
                  }}
                >
                  Đặt phòng
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có loại phòng nào để hiển thị.</p>
        )}
      </div>

      {modalOpen && (
        <div className="image-modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <div className="main-image-container">
              <button className="nav-button left" onClick={showPreviousImage}>❮</button>
              <img
                src={currentImages[currentImageIndex]}
                alt={`Ảnh ${currentImageIndex + 1}`}
                className="modal-main-image"
              />
              <button className="nav-button right" onClick={showNextImage}>❯</button>
              <div className="image-counter">
                {currentImageIndex + 1}/{currentImages.length}
              </div>
            </div>
            <div className="thumbnails-container">
              {currentImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Ảnh thu nhỏ ${index + 1}`}
                  className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}