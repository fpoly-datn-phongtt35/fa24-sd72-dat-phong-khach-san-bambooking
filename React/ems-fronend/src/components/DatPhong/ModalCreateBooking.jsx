import React from 'react';
import './ModalCreateBooking.scss';

const ModalCreateBooking = ({
    showModal,
    selectedRooms = [],
    startDate,
    endDate,
    adults,
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
            
        </div>
    );
};

export default ModalCreateBooking;
