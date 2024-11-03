import React from 'react';
import './ModalSelectedRoom.scss';
import { useNavigate } from 'react-router-dom';
const ModalSelectedRoom = ({
    showModal,
    handleCloseModal,
    selectedRooms = [],
    startDate,
    endDate,
    adults,
    handleRemoveRoom,
}) => {
    const navigate = useNavigate();
    // Hàm tính số ngày giữa ngày check-in và check-out
    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate); // Khoảng cách thời gian bằng milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi sang số ngày
        return diffDays === 0 ? 1 : diffDays; // Đảm bảo ít nhất là 1 ngày
    };
    
    // Hàm tính tổng tiền
    const calculateTotalPrice = (donGia, start, end) => {
        const days = calculateDays(start, end);
        return donGia * days;
    };

    // Hàm tính tổng tiền của tất cả các phòng đã chọn
    const calculateTotalAmount = () => {
        return selectedRooms.reduce((total, room) => {
            return total + calculateTotalPrice(room.donGia, room.startDate, room.endDate);
        }, 0);
    };

    const handleCreateBooking = () => {
        navigate('/tao-dat-phong', { state: { selectedRooms, startDate, endDate, adults } });
    };
    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Phòng Đã Chọn ({selectedRooms.length})</h2>
                <h4>{startDate} - {endDate}</h4>
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
                            <p>Thời gian: {room.startDate} -- {room.endDate}</p>
                            <p>Số Người: {room.adults}</p>
                            <p>Giá Đặt: {room.donGia.toLocaleString()} VND</p>
                            <p>Số đêm: {calculateDays(room.startDate, room.endDate)}</p>
                            <p>
                                Thành tiền: {calculateTotalPrice(room.donGia, room.startDate, room.endDate).toLocaleString()} VND
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
                    <button className="confirm-btn" onClick={handleCreateBooking}>
                        Tạo đặt phòng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSelectedRoom;
