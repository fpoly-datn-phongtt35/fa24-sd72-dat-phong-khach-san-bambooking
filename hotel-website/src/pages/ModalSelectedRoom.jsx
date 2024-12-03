import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModalSelectedRoom.css';
import { ListGioHang } from '../TTDP'
import {xoaTTDP} from '../TTDP'

const ModalSelectedRoom = ({
    showModal,
    handleCloseModal,
    idDatPhong,
    startDate,
    endDate,
    adults,
}) => {
    const [gioHang, setgioHang] = useState([]); // Mảng chứa các phòng đã chọn


    useEffect(() => {
        ListGioHang(idDatPhong)
        .then((response) => {
            setgioHang(response.data);
        })
        .catch((error) => {
            console.error(error);
        });


      }, [gioHang]);

      

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
        return gioHang.reduce((total, room) => {
            return total + calculateTotalPrice(room.giaDat, room.ngayNhanPhong, room.ngayTraPhong);
        }, 0);
    };
    const handleRemoveRoom = (idTTDP) => {
        xoaTTDP(idTTDP)
    };

    const handleCreateBooking = () => {
        navigate('/tao-dat-phong', { state: { gioHang, startDate, endDate, adults } });
    };
    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Phòng Đã Chọn ({gioHang.length})</h2>
                <h4>{startDate} - {endDate}</h4>
                {gioHang.length > 0 ? (
                    gioHang.map((room, index) => (
                        <div key={`${room.id}-${index}`} className="ttdp-card">
                            <button
                                onClick={() => handleRemoveRoom(room.id)}
                                className="remove-btn"
                            >
                                ✕
                            </button>
                            <p>Loại Phòng: {room.loaiPhong.tenLoaiPhong}</p>
                            <p>Thời gian: {room.ngayNhanPhong} -- {room.ngayTraPhong}</p>
                            <p>Số Người: {room.soNguoi}</p>
                            <p>Giá Đặt: {room.giaDat} VND</p>
                            <p>Số đêm: {calculateDays(room.ngayNhanPhong, room.ngayTraPhong)}</p>
                            <p>
                                Thành tiền: {calculateTotalPrice(room.giaDat, room.ngayNhanPhong, room.ngayTraPhong).toLocaleString()} VND
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
