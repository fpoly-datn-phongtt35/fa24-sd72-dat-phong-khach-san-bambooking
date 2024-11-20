import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCheckOut, checkOut } from '../../services/HoaDonDat';
import './Demo.scss';  // Import tập tin SCSS tùy chỉnh

const Demo = () => {
    const [key, setKey] = useState('');
    const [traPhong, setTraPhong] = useState([]);
    const navigate = useNavigate(); // Khai báo useNavigate để điều hướng

    const FindCheckOut = (key) => {
        findCheckOut(key)
            .then(response => {
                console.log(response.data);
                setTraPhong(response.data);
            })
            .catch(error => {
                console.log("Lỗi khi tìm kiếm thông tin phòng", error);
            });
    };

    const CheckOut = () => {
        traPhong.forEach((item) => {
            checkOut(item.id)
                .then(response => {
                    console.log(`Checkout thành công cho phòng ID: ${item.id}`);
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(`Lỗi khi checkout phòng ID: ${item.id}`, error);
                });
        });

        // Lưu danh sách traPhong vào localStorage
        localStorage.setItem('traPhong', JSON.stringify(traPhong));
        // Điều hướng sang trang demo-tao-hoa-don
        navigate('/demo-tao-hoa-don');
    };

    const removeTraPhong = (id) => {
        setTraPhong(traPhong.filter((item) => item.id !== id));
    };

    return (
        <div className="demo-container">
            <div className="card">
                <div className="card-body">
                    <h5>Demo</h5>
                    <div className="input-section">
                        <input
                            type="text"
                            className="input-field"
                            id="key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <button
                            className="checkout-button"
                            onClick={() => FindCheckOut(key)}
                        >
                            Tìm thông tin phòng
                        </button>
                    </div>

                    {traPhong.length > 0 && (
                        <div className="room-info">
                            <h5>Thông tin trả phòng</h5>
                            <div className="card-list">
                                {traPhong.map((item, index) => (
                                    <div className="room-card" key={index}>
                                        <div className="card-content">
                                            <button className="remove-button" onClick={() => removeTraPhong(item.id)}>
                                                &times;
                                            </button>
                                            <h6 className="room-title">Phòng: {item.xepPhong.phong.tenPhong}</h6>
                                            <p className="room-details">
                                                <strong>Ngày checkin:</strong> {item.xepPhong.ngayNhanPhong}<br />
                                                <strong>Ngày checkout:</strong> {item.ngayTraThucTe}<br />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {traPhong.length > 0 && (
                <div className="checkout-section">
                    <button className="confirm-checkout-button" onClick={CheckOut}>
                        Xác nhận Checkout và xuất hóa đơn
                    </button>
                </div>
            )}
        </div>
    );
};

export default Demo;
