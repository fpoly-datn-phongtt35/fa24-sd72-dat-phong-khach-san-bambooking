import React, { useState, useEffect } from 'react';
import { ThemMoiDatPhong, DanhSachKhachHang, DanhSachNhanVien } from '../../services/DatPhong';

const FormAdd = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        maDatPhong: '',
        nhanVien: null,  // Chứa đối tượng nhân viên thay vì chỉ ID
        khachHang: null, // Chứa đối tượng khách hàng thay vì chỉ ID
        ngayDat: '',
        ghiChu: '',
        trangThai: 'processing' // Giá trị mặc định là pending
    });

    const [nhanVienList, setNhanVienList] = useState([]); // State để lưu danh sách nhân viên
    const [khachHangList, setKhachHangList] = useState([]); // State để lưu danh sách khách hàng

    // Lấy danh sách nhân viên và khách hàng khi component render
    useEffect(() => {
        // Gọi API để lấy danh sách nhân viên
        DanhSachNhanVien()
            .then(response => {
                setNhanVienList(response.data); // Lưu danh sách nhân viên vào state
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            });

        // Gọi API để lấy danh sách khách hàng
        DanhSachKhachHang()
            .then(response => {
                setKhachHangList(response.data); // Lưu danh sách khách hàng vào state
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách khách hàng:", error);
            });
    }, []); // Chỉ chạy một lần khi component render lần đầu

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm xử lý khi chọn nhân viên
    const handleNhanVienChange = (e) => {
        const selectedNhanVien = nhanVienList.find(nv => nv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            nhanVien: selectedNhanVien // Lưu toàn bộ đối tượng nhân viên
        });
    };

    // Hàm xử lý khi chọn khách hàng
    const handleKhachHangChange = (e) => {
        const selectedKhachHang = khachHangList.find(kh => kh.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            khachHang: selectedKhachHang // Lưu toàn bộ đối tượng khách hàng
        });
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API thêm mới đặt phòng với đối tượng khách hàng và nhân viên
        ThemMoiDatPhong(formData)
            .then(response => {
                console.log("Thêm mới đặt phòng thành công:", response.data);
                handleClose(); // Đóng modal sau khi thêm thành công
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới đặt phòng:", error);
            });
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document"> {/* Sử dụng lớp modal-lg để tăng chiều ngang */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm mới đặt phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Mã đặt phòng */}
                            <div className="mb-3">
                                <label htmlFor="maDatPhong" className="form-label">Mã Đặt Phòng</label>
                                <input type="text" className="form-control" id="maDatPhong" name="maDatPhong" value={formData.maDatPhong} onChange={handleInputChange} required />
                            </div>

                            {/* Nhân viên */}
                            <div className="mb-3">
                                <label htmlFor="nhanVien" className="form-label">Nhân Viên</label>
                                <select className="form-select" id="nhanVien" name="nhanVien" value={formData.nhanVien?.id || ''} onChange={handleNhanVienChange} required>
                                    <option value="">Chọn nhân viên</option>
                                    {nhanVienList.map(nv => (
                                        <option key={nv.id} value={nv.id}>{nv.ho + " " + nv.ten}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Khách hàng */}
                            <div className="mb-3">
                                <label htmlFor="khachHang" className="form-label">Khách Hàng</label>
                                <select className="form-select" id="khachHang" name="khachHang" value={formData.khachHang?.id || ''} onChange={handleKhachHangChange} required>
                                    <option value="">Chọn khách hàng</option>
                                    {khachHangList.map(kh => (
                                        <option key={kh.id} value={kh.id}>{kh.ho + " " + kh.ten}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ngày đặt */}
                            <div className="mb-3">
                                <label htmlFor="ngayDat" className="form-label">Ngày Đặt</label>
                                <input type="datetime-local" className="form-control" id="ngayDat" name="ngayDat" value={formData.ngayDat} onChange={handleInputChange} required />
                            </div>

                            {/* Ghi chú */}
                            <div className="mb-3">
                                <label htmlFor="ghiChu" className="form-label">Ghi Chú</label>
                                <textarea className="form-control" id="ghiChu" name="ghiChu" rows={3} value={formData.ghiChu} onChange={handleInputChange}></textarea>
                            </div>

                        

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAdd;
