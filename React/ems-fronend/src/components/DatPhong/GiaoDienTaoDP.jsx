import React from 'react';
import './GiaoDienTaoDP.scss'; // Để định kiểu cho giao diện
import BookingForm from './BookingForm';
import NavLocLoaiPhong from './NavLocLoaiPhong';
const GiaoDienTaoDP = () => {
    return (
        <div className="form-add-page">
            {/* <div className="form-container">
                <NavLocLoaiPhong />
            </div> */}
            <div className="empty-space">
                <BookingForm />
            </div>
        </div>
    );
};

export default GiaoDienTaoDP;
