import React from 'react';
import './XacNhanDatPhong.scss';

const XacNhanDatPhong = ({
    showModal,
    handleCloseModal,
    handleConfirmBooking,
    selectedRooms = [],
    startDate,
    endDate,
    children,
    adults,
    handleRemoveRoom,
}) => {
    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Danh Sách Phòng Đã Chọn ({selectedRooms.length})</h2>
                {selectedRooms.length > 0 ? (
                    selectedRooms.map((room, index) => (
                        <div key={`${room.id}-${index}`} className="ttdp-card">
                            <button
                                onClick={() => handleRemoveRoom(index)}
                                className="remove-btn"
                            >
                                ✕
                            </button>
                            <p>Loại Phòng: {room.tenLoaiPhong}</p>
                            <p>Thời Gian: {startDate} - {endDate}</p>
                            <p>Giá Đặt: {room.donGia.toLocaleString()} VND</p>
                            <p>Số Người: {adults + children}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có phòng nào được chọn</p>
                )}

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleCloseModal}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={handleConfirmBooking}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default XacNhanDatPhong;
