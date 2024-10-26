import React from 'react';

const DetailDichVuDiKem = ({ dichVuDiKem, handleClose }) => {
    if (!dichVuDiKem) return null; // Không hiển thị nếu không có thông tin dịch vụ đi kèm

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Chi Tiết Dịch Vụ Đi Kèm</h2>
                <p><strong>Tên Dịch Vụ:</strong> {dichVuDiKem.dichVu.tenDichVu}</p>
                <p><strong>Giá Dịch Vụ:</strong> {dichVuDiKem.dichVu.donGia}</p>
                <p><strong>Mô tả Dịch Vụ:</strong> {dichVuDiKem.dichVu.moTa}</p>
                <p><strong>Tên loại phòng:</strong> {dichVuDiKem.loaiPhong.tenLoaiPhong}</p>
                <p><strong>Diện tích phòng:</strong> {dichVuDiKem.loaiPhong.dienTich}</p>
                <p><strong>Trạng Thái:</strong> {dichVuDiKem.trangThai}</p>
                <button onClick={handleClose}>Đóng</button>
            </div>
        </div>
    );
};

export default DetailDichVuDiKem;
