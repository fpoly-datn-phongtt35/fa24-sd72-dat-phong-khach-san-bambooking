import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Row, Col, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import './BookingForm.scss'; // Import file CSS
import XacNhanDatPhong from './XacNhanDatPhong'; // Import the new modal component
import { addThongTinDatPhong, getLoaiPhongKhaDung } from '../../services/TTDP';
const BookingForm = () => {
    const [datPhong, setDatPhong] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false); // State to handle modal visibility
    const [selectedRooms, setSelectedRooms] = useState([]); // Mảng chứa các phòng đã chọn
    const navigate = useNavigate();

    const [ttdpList, setTTDPList] = useState([]);

    const LoaiPhongKhaDung = (ngayNhanPhong, ngayTraPhong) => {
        getLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, { page: currentPage })
            .then((response) => {
                setLoaiPhongKhaDung(response.data.content);
                console.log(loaiPhongKhaDung);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        LoaiPhongKhaDung(startDate, endDate);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleCreateBooking = async (room) => {
        setSelectedRooms((prevRooms) => [...prevRooms, room]);
        // alert(`Đã thêm phòng ${room.tenLoaiPhong} vào danh sách giỏ hàng.`);
        setShowModal(true);
    };


    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmBooking = () => {
        setShowModal(false);
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate); // Khoảng cách thời gian bằng milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Chuyển đổi sang số ngày
        return diffDays;
    };

    // Hàm tính tổng tiền
    const calculateTotalPrice = (donGia, start, end) => {
        const days = calculateDays(start, end);
        return donGia * days;
    };
    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để tránh vấn đề chênh lệch múi giờ
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const handleRemoveRoom = (roomIndex) => {
        setSelectedRooms((prevRooms) =>
            prevRooms.filter((_, index) => index !== roomIndex)
        );
    };    
    return (
        <div className="booking-form-container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="formStartDate">Ngày Check-in</label>
                        <input
                            type="date"
                            id="formStartDate"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                if (e.target.value > endDate) {
                                    setEndDate(e.target.value); // Cập nhật ngày kết thúc nếu trước ngày bắt đầu
                                }
                            }}
                            min={getTodayDate()} // Đảm bảo lấy đúng ngày hiện tại theo múi giờ người dùng
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="formEndDate">Ngày Check-out</label>
                        <input
                            type="date"
                            id="formEndDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate} // Ngày kết thúc không được trước ngày bắt đầu
                            required
                            className="form-control"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="formGuests">Số Người</label>
                        <div className="dropdown">
                            <button type="button" className="dropdown-toggle">
                                Người lớn: {adults}, Trẻ em: {children}
                            </button>
                            <div className="dropdown-menu">
                                <div className="dropdown-item">
                                    <span>Người lớn:</span>
                                    <div className="quantity-control">
                                        <button
                                            className="round-button"
                                            onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
                                        >
                                            -
                                        </button>
                                        <span>{adults}</span>
                                        <button
                                            className="round-button"
                                            onClick={() => setAdults(adults + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="dropdown-item">
                                    <span>Trẻ em:</span>
                                    <div className="quantity-control">
                                        <button
                                            className="round-button"
                                            onClick={() => setChildren(children > 0 ? children - 1 : 0)}
                                        >
                                            -
                                        </button>
                                        <span>{children}</span>
                                        <button
                                            className="round-button"
                                            onClick={() => setChildren(children + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group action-buttons">
                        <button type="submit" className="search-btn">
                            Tìm Kiếm
                        </button>
                    </div>
                    <div className="form-group action-buttons">
                        <button type="button" className="cart-btn" onClick={handleOpenModal}>
                            Giỏ
                        </button>
                    </div>
                </div>
            </form>


            <div className="room-list">
                {loaiPhongKhaDung.map((lp) => (
                    <div key={lp.id} className="room-item">
                        <div className="room-info">
                            <h4 className="room-title">{lp.tenLoaiPhong}</h4>
                            <div className="details">
                                <div className="detail-item">
                                    <span>Diện tích: </span>
                                    <strong>{lp.dienTich} m²</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Sức chứa: </span>
                                    <strong>{lp.soKhachToiDa} khách</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Số phòng thực tế: </span>
                                    <strong>{lp.soLuongPhong}</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Số phòng khả dụng: </span>
                                    <strong>{lp.soPhongKhaDung}</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Đơn giá: </span>
                                    <strong>{lp.donGia.toLocaleString()} VND</strong>
                                </div>
                            </div>
                            <p className="description">Mô tả: {lp.moTa}</p>
                            <p className="total-price">
                                Thành tiền: <strong>{calculateTotalPrice(lp.donGia, startDate, endDate).toLocaleString()} VND</strong>
                            </p>
                        </div>
                        <div className="room-actions">
                            <button className="primary-btn" onClick={() => handleCreateBooking(lp)}>
                                Đặt Phòng
                            </button>
                            <button className="secondary-btn">Xem Chi Tiết</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                    Trang trước
                </button>

                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                    Trang sau
                </button>
            </div>

            {showModal && (
                <div className="XNDP-modal-backdrop-x">
                    <div className="XNDP-modal-body">
                        <XacNhanDatPhong
                            showModal={showModal}
                            handleCloseModal={handleCloseModal}
                            handleConfirmBooking={handleConfirmBooking}
                            selectedRooms={selectedRooms}
                            startDate={startDate}
                            endDate={endDate}
                            children={children}
                            adults={adults}
                            handleRemoveRoom = {handleRemoveRoom}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookingForm;
