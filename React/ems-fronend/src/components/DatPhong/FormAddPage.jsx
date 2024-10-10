import React from 'react';
import FormAdd from './FormAdd';
import './FormAddPage.css'; // Để định kiểu cho giao diện
import BookingForm from './BookingForm';
const FormAddPage = () => {
    return (
        <div className="form-add-page">
            <div className="form-container">
                <FormAdd show={true} handleClose={() => {}} /> {/* Form luôn hiển thị */}
            </div>
            <div className="empty-space">
                {/* Phần còn lại của màn hình, có thể để trống hoặc hiển thị nội dung khác */}
                <BookingForm />
            </div>
        </div>
    );
};

export default FormAddPage;
