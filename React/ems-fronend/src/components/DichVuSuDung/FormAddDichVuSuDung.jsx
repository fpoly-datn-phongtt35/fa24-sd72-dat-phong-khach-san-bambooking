import React, { useState, useEffect } from 'react';
import { ThemDichVuSuDung, DanhSachDichVu, DanhSachXepPhong } from '../../services/DichVuSuDungService';

const FormAddDichVuSuDung = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        dichVu: null,
        xepPhong: null,
        soLuongSuDung: 1,
        ngayBatDau: '',
        ngayKetThuc: '',
        giaSuDung: 0,
        trangThai: true, // Set initial state to boolean
    });

    const [dichVuList, setDichVuList] = useState([]);
    const [xepPhongList, setXepPhongList] = useState([]);

    useEffect(() => {
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        DanhSachXepPhong()
            .then(response => {
                setXepPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách xếp phòng:", error);
            });
    }, []);

    const handleDichVuChange = (e) => {
        const selectedDichVu = dichVuList.find(dv => dv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            dichVu: selectedDichVu
        });
    };

    const handleXepPhongChange = (e) => {
        const selectedXepPhong = xepPhongList.find(tp => tp.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            xepPhong: selectedXepPhong
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTrangThaiChange = (e) => {
        // Convert the string value from the dropdown to boolean
        const isActive = e.target.value === 'true'; // 'true' is converted to true, 'false' to false
        setFormData({
            ...formData,
            trangThai: isActive
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        ThemDichVuSuDung(formData)
            .then(response => {
                console.log("Phiếu dịch vụ đã được thêm thành công:", response.data);
                setFormData({
                    dichVu: null,
                    xepPhong: null,
                    soLuongSuDung: 1,
                    ngayBatDau: '',
                    ngayKetThuc: '',
                    giaSuDung: 0,
                    trangThai: true, // Reset to boolean
                });

                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi thêm phiếu dịch vụ:", error);
            });
    };

    if (!show) return null;

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Phiếu Dịch Vụ Mới</h5>
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

                            {/* Xếp Phòng */}
                            <div className="mb-3">
                                <label htmlFor="xepPhong" className="form-label">Xếp Phòng</label>
                                <select className="form-select" id="xepPhong" name="xepPhong" value={formData.xepPhong?.id || ''} onChange={handleXepPhongChange} required>
                                    <option value="">Chọn xếp phòng</option>
                                    {xepPhongList.map(tp => (
                                        <option key={tp.id} value={tp.id}>{tp.id}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Số Lượng Sử Dụng */}
                            <div className="mb-3">
                                <label htmlFor="soLuongSuDung" className="form-label">Số Lượng Sử Dụng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="soLuongSuDung"
                                    name="soLuongSuDung"
                                    value={formData.soLuongSuDung}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Giá Sử Dụng */}
                            <div className="mb-3">
                                <label htmlFor="giaSuDung" className="form-label">Giá Sử Dụng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="giaSuDung"
                                    name="giaSuDung"
                                    value={formData.giaSuDung}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* Trạng Thái */}
                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <select className="form-select" id="trangThai" name="trangThai" value={formData.trangThai} onChange={handleTrangThaiChange} required>
                                    <option value={true}>Hoạt động</option>
                                    <option value={false}>Ngừng hoạt động</option>
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

export default FormAddDichVuSuDung;
