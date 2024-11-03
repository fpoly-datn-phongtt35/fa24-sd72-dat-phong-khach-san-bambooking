import React from 'react';

const DetailDichVu = ({ dichVu, handleClose }) => {
    if (!dichVu) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Chi Tiết Dịch Vụ</h2>
                <p><strong>Tên Dịch Vụ:</strong> {dichVu.tenDichVu}</p>
                <p><strong>Giá:</strong> {dichVu.donGia}</p>
                <p><strong>Mô Tả:</strong> {dichVu.moTa}</p>
                {/* Hiển thị hình ảnh dịch vụ */}
                {dichVu.hinhAnh && (
                    <div>
                        <strong>Hình Ảnh:</strong>
                        <img src={dichVu.hinhAnh} alt={dichVu.tenDichVu} style={{ width: '50%', height: 'auto' }} />
                    </div>
                )}
                {/* Hiển thị trạng thái dưới dạng chuỗi dựa trên giá trị boolean */}
                <p><strong>Trạng Thái:</strong> {dichVu.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</p>
                <button onClick={handleClose}>Đóng</button>
            </div>_
        </div>
    );
};

export default DetailDichVu;
