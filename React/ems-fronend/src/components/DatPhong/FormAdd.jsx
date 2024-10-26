import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './FormAdd.scss';

const FormAdd = () => {
    const location = useLocation();
    const { room, startDate, endDate } = location.state || {}; // Lấy dữ liệu truyền vào
    const [formData, setFormData] = useState({
        ten: '',
        ho: '',
        email: '',
        sdt: '',
        diaChi: '',
        ghiChu: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking information:', formData);
    };
    return (
        <div className="booking-form-container">
            <Row>
                {/* Form thông tin khách hàng */}
                <Col md={8}>
                    <div className="customer-info-container"> {/* Thêm class để áp dụng padding */}
                        <h3>Thông tin khách hàng</h3>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="firstName">
                                        <Form.Label>Tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ten"
                                            value={formData.ten}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="lastName">
                                        <Form.Label>Họ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ho"
                                            value={formData.ho}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phoneNumber">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="sdt"
                                    value={formData.sdt}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="diaChi">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleChange}
                                    required
                                >
                                
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ghiChu">
                                <Form.Label>Ghi chú</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1} 
                                    name="ghiChu"
                                    value={formData.ghiChu}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Lưu
                            </Button>
                        </Form>
                    </div>
                </Col>

                {/* Thông tin phòng bên phải */}
                <Col md={4}>
                    <Card>
                        <Card.Img
                            variant="top"
                            src="https://via.placeholder.com/150" // Link hình ảnh phòng
                            alt="Phòng"
                        />
                        <Card.Body>
                            <Card.Title>{room.tenPhong}</Card.Title>
                            <Card.Text>
                                19 m² | Tối đa: 2 người lớn
                                <br />
                                Khách: 2 người lớn
                                <br />
                                1 giường đôi lớn và 1 giường sofa
                            </Card.Text>
                            <ul>
                                <li>Khuyến mại chớp nhoáng!</li>
                                <li>Phòng cuối cùng ở mức giá này!</li>
                                <li>Bãi đậu xe</li>
                                <li>Nhận phòng nhanh</li>
                                <li>Wi-Fi miễn phí</li>
                                <li>Nước uống</li>
                                <li>Phòng tập</li>
                            </ul>
                            <Button variant="outline-success" className="m-2">
                                Bãi đỗ xe
                            </Button>
                            <Button variant="outline-success">Wi-Fi Miễn Phí</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FormAdd;
