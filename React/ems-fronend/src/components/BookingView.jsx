import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HotelBooking = () => {
    const [rooms, setRooms] = useState([]);
    const [adults, setAdults] = useState(1); // Mặc định 1 người lớn
    const [children, setChildren] = useState(0); // Mặc định 0 trẻ em
    const [showPeopleForm, setShowPeopleForm] = useState(false); // Để hiển thị form chọn người

    const searchRooms = () => {
        // Giả lập tìm phòng (ở đây bạn sẽ gọi API)
        setRooms([
            { id: 1, type: 'Single Room', price: 100, amenities: ['Wifi', 'Breakfast'], image: 'single-room.jpg' },
            { id: 2, type: 'Double Room', price: 150, amenities: ['Wifi', 'Pool'], image: 'double-room.jpg' }
        ]);
    };

    const handleDropdownClick = () => {
        setShowPeopleForm(!showPeopleForm); // Toggle form chọn số người
    };

    const handleSavePeople = () => {
        setShowPeopleForm(false); // Đóng form sau khi chọn xong
    };

    return (
        <div>
            {/* Form đặt phòng */}
            <div className="container mt-4">
                <h2>Đặt phòng khách sạn</h2>
                <form className="row">
                    <div className="form-group col-md-4">
                        <label>Ngày nhận phòng</label>
                        <input type="date" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                        <label>Ngày trả phòng</label>
                        <input type="date" className="form-control" />
                    </div>

                    {/* Dropdown để chọn số lượng người */}
                    <div className="form-group col-md-4 position-relative">
                        <label>Người lớn và Trẻ em</label>
                        <div className="dropdown">
                            <button
                                type="button"
                                className="btn btn-secondary dropdown-toggle"
                                onClick={handleDropdownClick}
                            >
                                {adults} Người lớn, {children} Trẻ em
                            </button>

                            {/* Form chọn người */}
                            {showPeopleForm && (
                                <div
                                    className="position-absolute bg-light border p-3 mt-2"
                                    style={{ zIndex: 1000 }}
                                >
                                    <div className="form-group">
                                        <label>Người lớn</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            value={adults}
                                            onChange={(e) => setAdults(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Trẻ em</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={children}
                                            onChange={(e) => setChildren(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSavePeople}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group col-md-4">
                        <label>Loại phòng</label>
                        <select className="form-control">
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                    </div>

                    <div className="form-group col-md-4 align-self-end">
                        <button type="button" className="btn btn-primary" onClick={searchRooms}>Tìm phòng</button>
                    </div>
                </form>

                {/* Danh sách phòng */}
                <div className="row mt-4">
                    {rooms.map(room => (
                        <div className="col-md-4 mb-3" key={room.id}>
                            <div className="card">
                                <img className="card-img-top" src={room.image} alt={room.type} />
                                <div className="card-body">
                                    <h5 className="card-title">{room.type}</h5>
                                    <p className="card-text">Giá: ${room.price}/đêm</p>
                                    <p className="card-text">Tiện ích: {room.amenities.join(', ')}</p>
                                    <a href="#" className="btn btn-primary">Đặt phòng</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelBooking;
