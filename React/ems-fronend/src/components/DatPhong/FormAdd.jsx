import React, { useState, useEffect } from 'react';
import { ThemMoiDatPhong, DanhSachKhachHang, DanhSachNhanVien } from '../../services/DatPhong';

const FormAdd = () => {
    const [formData, setFormData] = useState({
        maDatPhong: '',
        nhanVien: null,
        khachHang: null,
        ngayDat: '',
        ghiChu: '',
        trangThai: 'processing' // Giá trị mặc định
    });

    const [nhanVienList, setNhanVienList] = useState([]);
    const [khachHangList, setKhachHangList] = useState([]);

    // Lấy danh sách nhân viên và khách hàng khi component render
    useEffect(() => {
        DanhSachNhanVien()
            .then(response => setNhanVienList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách nhân viên:", error));

        DanhSachKhachHang()
            .then(response => setKhachHangList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách khách hàng:", error));
    }, []);

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Xử lý thay đổi nhân viên và khách hàng
    const handleNhanVienChange = (e) => {
        const selectedNhanVien = nhanVienList.find(nv => nv.id === parseInt(e.target.value));
        setFormData({ ...formData, nhanVien: selectedNhanVien });
    };

    const handleKhachHangChange = (e) => {
        const selectedKhachHang = khachHangList.find(kh => kh.id === parseInt(e.target.value));
        setFormData({ ...formData, khachHang: selectedKhachHang });
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        ThemMoiDatPhong(formData)
            .then(response => {
                console.log("Thêm mới đặt phòng thành công:", response.data);
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới đặt phòng:", error);
            });
    };

    return (
        <div>
            <div>
                <h3>Thêm mới đặt phòng</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="maDatPhong" className="form-label">Mã Đặt Phòng</label>
                        <input type="text" id="maDatPhong" name="maDatPhong" value={formData.maDatPhong} onChange={handleInputChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="nhanVien" className="form-label">Nhân Viên</label>
                        <select id="nhanVien" name="nhanVien" value={formData.nhanVien?.id || ''} onChange={handleNhanVienChange} required>
                            <option value="">Chọn nhân viên</option>
                            {nhanVienList.map(nv => (
                                <option key={nv.id} value={nv.id}>{nv.ho + " " + nv.ten}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="khachHang" className="form-label">Khách Hàng</label>
                        <select id="khachHang" name="khachHang" value={formData.khachHang?.id || ''} onChange={handleKhachHangChange} required>
                            <option value="">Chọn khách hàng</option>
                            {khachHangList.map(kh => (
                                <option key={kh.id} value={kh.id}>{kh.ho + " " + kh.ten}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="ngayDat" className="form-label">Ngày Đặt</label>
                        <input type="datetime-local" id="ngayDat" name="ngayDat" value={formData.ngayDat} onChange={handleInputChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="ghiChu" className="form-label">Ghi Chú</label>
                        <textarea id="ghiChu" name="ghiChu" rows={3} value={formData.ghiChu} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="btn btn-primary">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAdd;
