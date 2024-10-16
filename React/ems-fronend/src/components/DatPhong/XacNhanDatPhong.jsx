import React from 'react';
import './XacNhanDatPhong.css'; // Import CSS tùy chỉnh

const XacNhanDatPhong = ({ showModal, handleCloseModal, handleConfirmBooking, selectedRoom, startDate, endDate, handleAdditionalRoom }) => {
    return (
        <div className={`modal-container ${showModal ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                <h2>Xác nhận đặt phòng</h2>
                {selectedRoom && (
                    <>
                        <h5>{selectedRoom.tenLoaiPhong} - {selectedRoom.tenPhong}</h5>
                        <p>Mã phòng: {selectedRoom.maPhong}</p>
                        <p>Giá: {selectedRoom.giaPhong} VND</p>
                        <p>Ngày check-in: {startDate}</p>
                        <p>Ngày check-out: {endDate}</p>
                    </>
                )}
                <label>
                    <input type="checkbox" onChange={handleAdditionalRoom} /> Chọn thêm phòng khác
                </label>
                <div className="modal-footer">
                    <button onClick={handleCloseModal}>Hủy</button>
                    <button onClick={handleConfirmBooking}>Xác nhận đặt phòng</button>
                </div>
            </div>
        </div>
    );
};

export default XacNhanDatPhong;
