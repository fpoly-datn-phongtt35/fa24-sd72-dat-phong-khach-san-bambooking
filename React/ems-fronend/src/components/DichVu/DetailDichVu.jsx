import React from 'react';

const DetailDichVu = ({ dichVu, handleClose }) => {
    if (!dichVu) return null; // Không hiển thị nếu không có thông tin dịch vụ

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Chi Tiết Dịch Vụ</h2>
                <p><strong>Tên Dịch Vụ:</strong> {dichVu.tenDichVu}</p>
                <p><strong>Giá:</strong> {dichVu.donGia}</p>
                <p><strong>Mô Tả:</strong> {dichVu.moTa}</p>
                <p><strong>Trạng Thái:</strong> {dichVu.trangThai}</p>
                <button onClick={handleClose}>Đóng</button>
            </div>
        </div>
    );
};

export default DetailDichVu;
