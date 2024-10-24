import React, { useEffect, useState } from 'react';
import { DatPhongDetail, CapNhatDatPhong } from '../../services/DatPhong'; // Import hàm cập nhật
import './DetailDatPhong.scss';

const ChiTietDatPhong = ({ bookingId, handleClose, show }) => {
    const [datPhong, setDatPhong] = useState(null); // Dữ liệu chi tiết đặt phòng
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [updating, setUpdating] = useState(false); // Trạng thái cập nhật

    useEffect(() => {
        if (bookingId) {
            setLoading(true);
            DatPhongDetail(bookingId)
                .then(response => {
                    const data = response.data;
                    if (data.ngayDat) {
                        // Chuyển đổi giá trị ngày từ định dạng `03:14 SA 30-9-2024` sang `YYYY-MM-DD`
                        data.ngayDat = convertDateTimeToISOFormat(data.ngayDat);
                    }
                    setDatPhong(data); // Lưu dữ liệu đặt phòng vào state
                    setLoading(false); // Dừng trạng thái tải
                })
                .catch(error => {
                    console.error('Lỗi khi lấy chi tiết đặt phòng:', error);
                    setLoading(false); // Dừng trạng thái tải
                });
        }
    }, [bookingId]);
    const convertDateTimeToISOFormat = (dateTimeString) => {
        // Tách phần thời gian và phần ngày
        const [time, period, dateString] = dateTimeString.split(' ');
        
        // Tách ngày, tháng, năm từ chuỗi ngày
        const [day, month, year] = dateString.split('-');
    
        // Chuyển đổi giờ về định dạng 24 giờ nếu cần thiết (giả sử đầu vào có 'SA' hoặc 'CH')
        let [hour, minute] = time.split(':');
        if (period === 'SA' && hour === '12') {
            hour = '00'; // Chuyển 12AM thành 00 giờ
        }
        if (period === 'CH' && hour !== '12') {
            hour = String(parseInt(hour) + 12); // Chuyển PM thành giờ 24
        }
    
        // Đảm bảo ngày và tháng có 2 chữ số
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };
    





    // Hàm xử lý cập nhật
    const handleUpdate = () => {
        if (datPhong) {
            setUpdating(true);
            CapNhatDatPhong(bookingId, datPhong)
                .then(response => {
                    alert('Cập nhật thành công!');
                    setUpdating(false);
                })
                .catch(error => {
                    console.error('Lỗi khi cập nhật đặt phòng:', error);
                    setUpdating(false);
                });
        }
    };




    const convertDateToISOFormat = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Khi người dùng thay đổi giá trị:



    // Xử lý khi dữ liệu đang được tải
    if (loading) {
        return (
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Đang tải...</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không có dữ liệu
    if (!datPhong) {
        return null;
    }

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi Tiết Đặt Phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>

                    <div className="modal-body">
                        {/* Mã đặt phòng */}
                        <div className="mb-3">
                            <label htmlFor="maDatPhong" className="form-label">Mã Đặt Phòng</label>
                            <input
                                type="text"
                                id="maDatPhong"
                                value={datPhong.maDatPhong || 'N/A'}
                                onChange={(e) => setDatPhong({ ...datPhong, maDatPhong: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        {/* Nhân viên */}
                        <div className="mb-3">
                            <label htmlFor="nhanVien" className="form-label">Nhân Viên</label>
                            <input
                                type="text"
                                id="nhanVien"
                                value={datPhong.tenNhanVien}
                                onChange={(e) => setDatPhong({ ...datPhong, tenNhanVien: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        {/* Khách hàng */}
                        <div className="mb-3">
                            <label htmlFor="khachHang" className="form-label">Khách Hàng</label>
                            <input
                                type="text"
                                id="khachHang"
                                value={datPhong.tenKhachHang}
                                onChange={(e) => setDatPhong({ ...datPhong, tenKhachHang: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        {/* Ngày đặt */}
                        <div className="mb-3">
                            <label htmlFor="ngayDat" className="form-label">Ngày Đặt</label>
                            <input
                                type="datetime-local"
                                id="ngayDat"
                                value={datPhong.ngayDat || ''} // Hiển thị giá trị đã chuyển đổi
                                onChange={(e) => setDatPhong({ ...datPhong, ngayDat: convertDateToISOFormat(e.target.value) })}
                                className="form-control"
                            />



                        </div>

                        {/* Ghi chú */}
                        <div className="mb-3">
                            <label htmlFor="ghiChu" className="form-label">Ghi Chú</label>
                            <input
                                type="text"
                                id="ghiChu"
                                value={datPhong.ghiChu}
                                onChange={(e) => setDatPhong({ ...datPhong, ghiChu: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="mb-3">
                            <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                            <input
                                type="text"
                                id="trangThai"
                                value={datPhong.trangThai}
                                onChange={(e) => setDatPhong({ ...datPhong, trangThai: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={handleUpdate} disabled={updating}>
                            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                        <button type="button" className="btn btn-warning">Trạng thái</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChiTietDatPhong;
