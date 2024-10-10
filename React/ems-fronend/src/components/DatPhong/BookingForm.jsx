import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap';
import './BookingForm.css'; // Import file CSS
import { PhongKhaDung } from '../../services/DatPhong';

const BookingForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [phongKhaDung, setPhongKhaDung] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Giá trị mặc định cho ngayNhanPhong và ngayTraPhong
    const defaultNgayNhanPhong = '2024-10-10T14:30:45'; // Hoặc giá trị khác bạn muốn
    const defaultNgayTraPhong = '2024-10-12T14:30:45'; // Hoặc giá trị khác bạn muốn

    // Hàm lấy dữ liệu phòng khả dụng
    const getPhongKhaDung = (ngayNhanPhong = defaultNgayNhanPhong, ngayTraPhong = defaultNgayTraPhong) => {
        PhongKhaDung(ngayNhanPhong, ngayTraPhong, { page: currentPage, size: 5 })
            .then((response) => {
                console.log(response.data.content);
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

    // Hàm xử lý tìm kiếm với các giá trị người dùng nhập
    const handleSearch = (e) => {
        e.preventDefault();
        // Gọi API với các giá trị startDate và endDate mà người dùng chọn
        getPhongKhaDung(startDate, endDate);
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
    return (
        <div className="booking-form-container">
            <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                    <Col md={3}>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Ngày Check-in</Form.Label>
                            <Form.Control
                                type="date"
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
                                type="date"
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
                    </Col>
                </Row>
            </Form>

            {/* Hiển thị danh sách phòng */}
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
                                <Button variant="primary" className="mb-2 action-btn">Đặt Phòng</Button>
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
        </div>
    );
};

export default BookingForm;
