import React from 'react';

const DetailDichVuSuDung = ({ dichVuSuDung, handleClose }) => {
    if (!dichVuSuDung) return null; // Không hiển thị nếu không có thông tin dịch vụ sử dụng

    // Convert boolean status to human-readable form
    const trangThaiReadable = dichVuSuDung.trangThai ? "Hoạt động" : "Ngừng hoạt động";

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Chi Tiết Dịch Vụ Sử Dụng</h2>
                <p><strong>Tên Dịch Vụ:</strong> {dichVuSuDung.dichVu.tenDichVu}</p>
                <p><strong>Giá Dịch Vụ:</strong> {dichVuSuDung.dichVu.donGia}</p>
                <p><strong>Số Lượng Sử Dụng:</strong> {dichVuSuDung.soLuongSuDung}</p>
                <p><strong>Ngày Bắt Đầu:</strong> {new Date(dichVuSuDung.ngayBatDau).toLocaleDateString()}</p>
                <p><strong>Ngày Kết Thúc:</strong> {new Date(dichVuSuDung.ngayKetThuc).toLocaleDateString()}</p>
                <p><strong>Giá Sử Dụng:</strong> {dichVuSuDung.giaSuDung}</p>
                <p><strong>Trạng Thái:</strong> {trangThaiReadable}</p> {/* Updated line */}

                {/* Hiển thị thông tin xếp phòng */}
                {dichVuSuDung.xepPhong && ( // Cập nhật để sử dụng `thongTinXepPhong`
                    <>
                        <h3>Thông Tin Xếp Phòng</h3>
                        <p><strong>ID:</strong> {dichVuSuDung.xepPhong.id}</p>
                        <p><strong>ID Phòng:</strong> {dichVuSuDung.xepPhong.phong.id}</p>
                        <p><strong>ID Thông Tin Đặt Phòng:</strong> {dichVuSuDung.xepPhong.thongTinDatPhong.id}</p>
                        <p><strong>Ngày Nhận Phòng:</strong> {new Date(dichVuSuDung.xepPhong.ngayNhanPhong).toLocaleDateString()}</p>
                        <p><strong>Ngày Trả Phòng:</strong> {new Date(dichVuSuDung.xepPhong.ngayTraPhong).toLocaleDateString()}</p>
                        <p><strong>Trạng Thái:</strong> {dichVuSuDung.xepPhong.trang_thai ? "Hoạt động" : "Ngừng hoạt động"}</p> {/* Updated line */}
                    </>
                )}

                <button onClick={handleClose}>Đóng</button>
            </div>
        </div>
    );
};

export default DetailDichVuSuDung;
