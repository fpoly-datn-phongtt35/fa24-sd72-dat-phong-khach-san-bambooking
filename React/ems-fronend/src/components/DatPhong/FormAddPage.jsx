import React from 'react';
import './FormAddPage.scss'; // Để định kiểu cho giao diện
import BookingForm from './BookingForm';
import NavPhong from './NavPhong';
const FormAddPage = () => {
    return (
        <div className="form-add-page">
            <div className="form-container">
                <NavPhong />
            </div>
            <div className="empty-space">
                {/* Phần còn lại của màn hình, có thể để trống hoặc hiển thị nội dung khác */}
                <BookingForm />
            </div>
        </div>
    );
};

export default FormAddPage;
