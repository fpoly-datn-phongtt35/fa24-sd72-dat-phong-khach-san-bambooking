import React from 'react';
import './ModalSelectedRoom.scss';

const ModalSelectedRoom = ({
    showModal,
    handleCloseModal,
    handleConfirmBooking,
    selectedRooms = [],
    startDate,
    endDate,
    adults,
    handleRemoveRoom,
}) => {
    // Hàm tính số ngày giữa ngày check-in và check-out
    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    // Hàm tính tổng tiền cho mỗi phòng
    const calculateTotalPrice = (donGia, start, end) => {
        const days = calculateDays(start, end);
        return donGia * days;
    };

    // Hàm tính tổng tiền của tất cả các phòng đã chọn
    const calculateTotalAmount = () => {
        return selectedRooms.reduce((total, room) => {
            return total + calculateTotalPrice(room.donGia, startDate, endDate);
        }, 0);
    };

    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Phòng Đã Chọn ({selectedRooms.length})</h2>
                <h4>Thời Gian: {startDate} / {endDate}</h4>
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
                            <p>Số Người: {adults}</p>
                            <p>Giá Đặt: {room.donGia.toLocaleString()} VND</p>
                            <p>Số đêm: {calculateDays(startDate,endDate)}</p>
                            <p>
                                Thành tiền: {calculateTotalPrice(room.donGia, startDate, endDate).toLocaleString()} VND
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Không có phòng nào được chọn</p>
                )}
                
                {/* Hiển thị tổng tiền */}
                <h3>Tổng tiền: {calculateTotalAmount().toLocaleString()} VND</h3>
                
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleCloseModal}>
                        Đóng
                    </button>
                    <button className="confirm-btn" onClick={handleConfirmBooking}>
                        Tạo đặt phòng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSelectedRoom;
