import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoaiPhongKhaDung } from '../../services/TTDP';
import ModalSelectedRoom from './ModalSelectedRoom';
import './BookingForm.scss';

const BookingForm = () => {
    const [datPhong, setDatPhong] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const navigate = useNavigate();

    const pageSize = 5; // Số lượng phần tử mỗi trang

    // Gọi API lấy loại phòng khả dụng
    const fetchLoaiPhongKhaDung = (ngayNhanPhong, ngayTraPhong, soNguoi, page) => {
        getLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi, { page, size: pageSize })
            .then((response) => {
                setLoaiPhongKhaDung(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Gọi API khi tìm kiếm hoặc khi `currentPage` thay đổi
    useEffect(() => {
        if (startDate && endDate && adults) {
            fetchLoaiPhongKhaDung(startDate, endDate, adults, currentPage);
        }
    }, [startDate, endDate, adults, currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm mới
        fetchLoaiPhongKhaDung(startDate, endDate, adults, 0);
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

    const handleAddSelectedRooms = (room) => {
        const selectedRoomInfo = {
            ...room,
            adults: adults,
            startDate: startDate,
            endDate: endDate
        };
        setSelectedRooms((prevRooms) => [...prevRooms, selectedRoomInfo]);
        setShowModal(true);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const calculateTotalPrice = (donGia, start, end) => {
        const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)));
        return donGia * days;
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
                                    setEndDate(e.target.value);
                                }
                            }}
                            min={new Date().toISOString().split('T')[0]}
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
                            min={startDate}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="formGuests">Số Người</label>
                        <div className="dropdown">
                            <button type="button" className="dropdown-toggle">
                                Số người: {adults}
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
                <ModalSelectedRoom
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    selectedRooms={selectedRooms}
                    startDate={startDate}
                    endDate={endDate}
                    adults={adults}
                />
            )}
        </div>
    );
};

export default BookingForm;
