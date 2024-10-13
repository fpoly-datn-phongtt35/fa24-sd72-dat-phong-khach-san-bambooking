import React from 'react';

const DetailPhieuDichVu = ({ phieuDichVu, handleClose }) => {
    if (!phieuDichVu) return null; // Không hiển thị nếu không có thông tin phiếu dịch vụ

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Chi Tiết Phiếu Dịch Vụ</h2>
                <p><strong>Tên Dịch Vụ:</strong> {phieuDichVu.dichVu.tenDichVu}</p>
                <p><strong>Giá Dịch Vụ:</strong> {phieuDichVu.dichVu.donGia}</p>
                <p><strong>Số Lượng Sử Dụng:</strong> {phieuDichVu.soLuongSuDung}</p>
                <p><strong>Ngày Bắt Đầu:</strong> {new Date(phieuDichVu.ngayBatDau).toLocaleDateString()}</p>
                <p><strong>Ngày Kết Thúc:</strong> {new Date(phieuDichVu.ngayKetThuc).toLocaleDateString()}</p>
                <p><strong>Giá Sử Dụng:</strong> {phieuDichVu.giaSuDung}</p>
                <p><strong>Trạng Thái:</strong> {phieuDichVu.trangThai}</p>

                {/* Hiển thị thông tin đặt phòng */}
                {phieuDichVu.thongTinDatPhong && (
                    <>
                        <h3>Thông Tin Đặt Phòng</h3>
                        <p><strong>Mã Thông Tin Đặt Phòng:</strong> {phieuDichVu.thongTinDatPhong.ma_thong_tin_dat_phong}</p>
                        <p><strong>Ngày Nhận Phòng:</strong> {phieuDichVu.thongTinDatPhong.ngayNhanPhong}</p>
                        <p><strong>Ngày Trả Phòng:</strong> {phieuDichVu.thongTinDatPhong.ngayTraPhong}</p>
                        <p><strong>Giá Đặt:</strong> {phieuDichVu.thongTinDatPhong.giaDat}</p>
                        <p><strong>Số Người:</strong> {phieuDichVu.thongTinDatPhong.soNguoi}</p>
                        <p><strong>Trạng Thái Đặt Phòng:</strong> {phieuDichVu.thongTinDatPhong.trangThai}</p>
                    </>
                )}

                <button onClick={handleClose}>Đóng</button>
            </div>
        </div>
    );
};

export default DetailPhieuDichVu;
