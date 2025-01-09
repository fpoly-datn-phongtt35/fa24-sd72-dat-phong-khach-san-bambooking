import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Row, Col, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import './BookingForm.scss'; // Import file CSS
import ModalSelectedRoom from './ModalSelectedRoom'; // Import the new modal component
import { addThongTinDatPhong, getLoaiPhongKhaDung } from '../../services/TTDP';
import TaoDatPhong from './TaoDatPhong';

const BookingForm = () => {
    const [datPhong, setDatPhong] = useState(null);
    const [ngayNhanPhong, setngayNhanPhong] = useState('');
    const [ngayTraPhong, setngayTraPhong] = useState('');
    const [soPhong, setSoPhong] = useState('');
    const [soNguoi, setsoNguoi] = useState(2);
    const [children, setChildren] = useState(0);
    const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false); // State to handle modal visibility
    const [selectedRooms, setSelectedRooms] = useState([]); // Mảng chứa các phòng đã chọn
    const navigate = useNavigate();

    const LoaiPhongKhaDung = (ngayNhanPhong, ngayTraPhong, soNguoi,soPhong) => {
        getLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi,soPhong ,{ page: currentPage })
            .then((response) => {
                setLoaiPhongKhaDung(response.data.content);
                console.log(response.data);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        LoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi,soPhong);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => {
                const newPage = prevPage + 1;
                return newPage;
            });
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => {
                const newPage = prevPage - 1;
                return newPage;
            });
        }
    };

    useEffect(() => {
        if (ngayNhanPhong && ngayTraPhong) { 
            LoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi, soPhong);
        }
    }, [currentPage]);

    const handleAddSelectedRooms = (room) => {
        const selectedRoomInfo = {
            ...room,
            soNguoi: soNguoi,
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong
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

    const calculateDays = (start, end) => {
        const ngayNhanPhong = new Date(start);
        const ngayTraPhong = new Date(end);
        const diffTime = Math.abs(ngayTraPhong - ngayNhanPhong); // Khoảng cách thời gian bằng milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi sang số ngày
        return diffDays === 0 ? 1 : diffDays; // Đảm bảo ít nhất là 1 ngày
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
    const handleCreateBooking = (room) => {
        const selectedRoomInfo = {
            ...room,
            soNguoi,
            ngayNhanPhong,
            ngayTraPhong,
        };
        setSelectedRooms((prevRooms) => {
            const updatedRooms = [...prevRooms, selectedRoomInfo];
            // Điều hướng sang TaoDatPhong với toàn bộ danh sách phòng
            navigate('/tao-dat-phong', { state: { selectedRooms: updatedRooms, ngayNhanPhong, ngayTraPhong, soNguoi } });
            return updatedRooms;
        });
    };
    const getMinMaxDates = () => {
        if (selectedRooms.length === 0) return { minDate: '', maxDate: '' };
    
        const dates = selectedRooms.map(room => ({
            start: new Date(room.ngayNhanPhong),
            end: new Date(room.ngayTraPhong)
        }));
    
        const minDate = new Date(Math.min(...dates.map(date => date.start)));
        const maxDate = new Date(Math.max(...dates.map(date => date.end)));
    
        return {
            minDate: minDate.toISOString().split('T')[0], // Định dạng lại nếu cần
            maxDate: maxDate.toISOString().split('T')[0]
        };
    };
    
    const { minDate, maxDate } = getMinMaxDates();
    
    return (
        <div className="booking-form-container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="formngayNhanPhong">Ngày Check-in</label>
                        <input
                            type="date"
                            id="formngayNhanPhong"
                            value={ngayNhanPhong}
                            onChange={(e) => {
                                setngayNhanPhong(e.target.value);
                                if (e.target.value > ngayTraPhong) {
                                    setngayTraPhong(e.target.value); // Cập nhật ngày kết thúc nếu trước ngày bắt đầu
                                }
                            }}
                            min={getTodayDate()} // Đảm bảo lấy đúng ngày hiện tại theo múi giờ người dùng
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="formngayTraPhong">Ngày Check-out</label>
                        <input
                            type="date"
                            id="formngayTraPhong"
                            value={ngayTraPhong}
                            onChange={(e) => setngayTraPhong(e.target.value)}
                            min={ngayNhanPhong} // Ngày kết thúc không được trước ngày bắt đầu
                            required
                            className="form-control"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="formGuests">Số Người</label>
                        <div className="dropdown">
                            <button type="button" className="dropdown-toggle">
                                Số người: {soNguoi}
                            </button>
                            <div className="dropdown-menu">
                                <div className="dropdown-item">
                                    <span>Người lớn:</span>
                                    <div className="quantity-control">
                                        <button
                                            className="round-button"
                                            onClick={() => setsoNguoi(soNguoi > 1 ? soNguoi - 1 : 1)}
                                        >
                                            -
                                        </button>
                                        <span>{soNguoi}</span>
                                        <button
                                            className="round-button"
                                            onClick={() => setsoNguoi(soNguoi + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="formngayTraPhong">Số phòng</label>
                        <input
                            type="number"
                            id="soPhong"
                            value={soPhong}
                            onChange={(e) => setSoPhong(e.target.value)}
                            min={1}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group action-buttons">
                        <button type="submit" className="search-btn">
                            Tìm Kiếm
                        </button>
                    </div>
                    <div className="form-group action-buttons">
                        <button type="button" className="cart-btn" onClick={handleOpenModal}>
                            Phòng đã chọn
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
                                Thành tiền: <strong>{calculateTotalPrice(lp.donGia, ngayNhanPhong, ngayTraPhong).toLocaleString()} VND</strong>
                            </p>
                        </div>
                        <div className="room-actions">
                            <button className="secondary-btn" onClick={() => handleCreateBooking(lp)}>
                                Đặt ngay
                            </button>
                            <button className="primary-btn" onClick={() => handleAddSelectedRooms(lp)}>
                                Thêm phòng
                            </button>
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
                        <ModalSelectedRoom
                            showModal={showModal}
                            handleCloseModal={handleCloseModal}
                            selectedRooms={selectedRooms}
                            ngayNhanPhong={minDate}
                            ngayTraPhong={maxDate}
                            soNguoi={soNguoi}
                            handleRemoveRoom = {handleRemoveRoom}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookingForm;
