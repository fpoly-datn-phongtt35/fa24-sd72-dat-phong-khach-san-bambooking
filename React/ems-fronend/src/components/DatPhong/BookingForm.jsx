import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import './BookingForm.scss'; // Import file CSS
import { PhongKhaDung } from '../../services/DatPhong';
import XacNhanDatPhong from './XacNhanDatPhong'; // Import the new modal component

const BookingForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [phongKhaDung, setPhongKhaDung] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false); // State to handle modal visibility
    const [selectedRooms, setSelectedRooms] = useState([]); // Mảng chứa các phòng đã chọn
    const [multipleBookings, setMultipleBookings] = useState(false); // State to manage multiple bookings

    const navigate = useNavigate();

    const getPhongKhaDung = (ngayNhanPhong, ngayTraPhong, adults, children) => {
        PhongKhaDung(ngayNhanPhong, ngayTraPhong, adults, children, { page: currentPage })
            .then((response) => {
                setPhongKhaDung(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getPhongKhaDung();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        getPhongKhaDung(startDate, endDate, adults, children);
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

    const handleCreateBooking = (room) => {
        setSelectedRooms((prevRooms) => [...prevRooms, room]); // Thêm phòng vào mảng các phòng đã chọn
        setShowModal(true); // Hiển thị modal
        console.log(startDate);
        console.log(endDate);
        console.log(children);
        console.log(adults);

    };


    const handleOpenModal = () => {
        setShowModal(true);
        console.log(showModal)
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide modal
    };

    const handleConfirmBooking = () => {
        navigate('/form-tao', { state: { room: selectedRooms, startDate, endDate, multipleBookings } });
        setShowModal(false);
    };

    const handleAdditionalRoom = (e) => {
        setMultipleBookings(e.target.checked); // Set multiple bookings state based on checkbox
    };

    return (
        <div className="booking-form-container">
            <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                    <Col md={3}>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Ngày Check-in</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>Ngày Check-out</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group controlId="formGuests">
                            <Form.Label>Số Người</Form.Label>
                            <DropdownButton
                                title={`Người lớn: ${adults}, Trẻ em: ${children}`}
                                variant="outline-secondary"
                                className="w-100 dropdown-toggle"
                            >
                                <Dropdown.Item>
                                    <span>Người lớn:</span>
                                    <div>
                                        <Button
                                            className="round-button"
                                            onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
                                        >
                                            -
                                        </Button>
                                        {adults}
                                        <Button
                                            className="round-button"
                                            onClick={() => setAdults(adults + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                    <span>Trẻ em:</span>
                                    <div>
                                        <Button
                                            className="round-button"
                                            onClick={() => setChildren(children > 0 ? children - 1 : 0)}
                                        >
                                            -
                                        </Button>
                                        {children}
                                        <Button
                                            className="round-button"
                                            onClick={() => setChildren(children + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                    </Col>

                    <Col md={3} className="text-right">
                        <Button type="submit" className="custom-search-btn">
                            Tìm Kiếm
                        </Button>
                        <Button onClick={() => handleOpenModal()} className="custom-cart-btn">
                            Giỏ
                        </Button>

                    </Col>
                </Row>
            </Form>

            <div className="room-list">
                {phongKhaDung.map((p) => (
                    <Card className="room-card" key={p.id}>
                        <Row className="align-items-center">
                            <Col md={4}>
                                {p.duongDanAnh ? (
                                    <img
                                        src={p.duongDanAnh}
                                        alt={p.tenPhong}
                                        className="room-image"
                                    />
                                ) : (
                                    <div className="no-image">
                                        <span>Không có hình ảnh</span>
                                    </div>
                                )}
                            </Col>
                            <Col md={5}>
                                <h4 className="room-title">{p.tenLoaiPhong}</h4>
                                <h5 className="room-code">{p.maPhong}</h5>
                                <p className="room-name">{p.tenPhong}</p>
                                <strong className="room-price">Giá: {p.giaPhong} VND</strong>
                            </Col>
                            <Col md={3} className="text-right">
                                <Button variant="primary" className="mb-2 action-btn" onClick={() => handleCreateBooking(p)}>Đặt Phòng</Button>
                                <Button variant="outline-secondary" className="action-btn">Xem Chi Tiết</Button>
                            </Col>
                        </Row>
                    </Card>
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

            {/* Use the new XacNhanDatPhong component */}

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
                            children = {children}
                            adults = {adults}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookingForm;
