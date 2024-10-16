import React, { useState, useEffect } from 'react';
import { ThemDichVuDiKem, DanhSachDichVu, DanhSachLoaiPhong } from '../../services/DichVuDiKemService'; // Import API service

const FormAddDichVuDiKem = ({ show, handleClose, refreshData }) => {
    // State để lưu trữ dữ liệu form, chứa đối tượng dịch vụ và loại phòng thay vì chỉ ID
    const [formData, setFormData] = useState({
        dichVu: null, // Chứa đối tượng dịch vụ thay vì chỉ ID
        loaiPhong: null, // Chứa đối tượng loại phòng thay vì chỉ ID
        trangThai: 'Hoạt động', // Đảm bảo giá trị mặc định không null
    });

    const [dichVuList, setDichVuList] = useState([]); // State để lưu danh sách dịch vụ
    const [loaiPhongList, setLoaiPhongList] = useState([]); // State để lưu danh sách loại phòng

    // Lấy danh sách dịch vụ và loại phòng khi component render
    useEffect(() => {
        // Gọi API để lấy danh sách dịch vụ
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        // Gọi API để lấy danh sách loại phòng
        DanhSachLoaiPhong()
            .then(response => {
                setLoaiPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách loại phòng:", error);
            });
    }, []); // Chỉ chạy một lần khi component render lần đầu

    // Hàm xử lý khi chọn dịch vụ
    const handleDichVuChange = (e) => {
        const selectedDichVu = dichVuList.find(dv => dv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            dichVu: selectedDichVu // Lưu toàn bộ đối tượng dịch vụ
        });
    };

    // Hàm xử lý khi chọn loại phòng
    const handleLoaiPhongChange = (e) => {
        const selectedLoaiPhong = loaiPhongList.find(lp => lp.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            loaiPhong: selectedLoaiPhong // Lưu toàn bộ đối tượng loại phòng
        });
    };

    // Hàm xử lý khi nhấn nút lưu
    const handleSubmit = (e) => {
        e.preventDefault();

        // Gọi API ThemDichVuDiKem để thêm dịch vụ đi kèm
        ThemDichVuDiKem(formData)
            .then(response => {
                console.log("Dịch vụ đi kèm đã được thêm thành công:", response.data);
                // Reset form sau khi thêm thành công
                setFormData({
                    dichVu: null,
                    loaiPhong: null,
                    trangThai: 'Hoạt động',
                });

                refreshData(); // Gọi callback để load lại dữ liệu bảng
                handleClose(); // Đóng modal sau khi lưu
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
            });
    };

    if (!show) return null; // Không hiển thị modal nếu không mở

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Dịch Vụ Đi Kèm Mới</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Dịch Vụ */}
                            <div className="mb-3">
                                <label htmlFor="dichVu" className="form-label">Dịch Vụ</label>
                                <select className="form-select" id="dichVu" name="dichVu" value={formData.dichVu?.id || ''} onChange={handleDichVuChange} required>
                                    <option value="">Chọn dịch vụ</option>
                                    {dichVuList.map(dv => (
                                        <option key={dv.id} value={dv.id}>{dv.tenDichVu}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Loại Phòng */}
                            <div className="mb-3">
                                <label htmlFor="loaiPhong" className="form-label">Loại Phòng</label>
                                <select className="form-select" id="loaiPhong" name="loaiPhong" value={formData.loaiPhong?.id || ''} onChange={handleLoaiPhongChange} required>
                                    <option value="">Chọn loại phòng</option>
                                    {loaiPhongList.map(lp => (
                                        <option key={lp.id} value={lp.id}>{lp.tenLoaiPhong}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Trạng Thái */}
                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <select className="form-select" id="trangThai" name="trangThai" value={formData.trangThai} onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}>
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                                </select>
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

export default FormAddDichVuDiKem;
