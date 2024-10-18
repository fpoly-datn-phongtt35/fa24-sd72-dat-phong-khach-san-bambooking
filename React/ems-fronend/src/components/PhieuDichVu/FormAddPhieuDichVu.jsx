import React, { useState, useEffect } from 'react';
import { ThemPhieuDichVu, DanhSachDichVu, DanhSachThongTinDatPhong } from '../../services/PhieuDichVuService';

const FormAddPhieuDichVu = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        dichVu: null,
        thongTinDatPhong: null,
        soLuongSuDung: 1,
        ngayBatDau: '',
        ngayKetThuc: '',
        giaSuDung: 0,
        trangThai: 'Hoạt động',
    });

    const [dichVuList, setDichVuList] = useState([]);
    const [thongTinDatPhongList, setThongTinDatPhongList] = useState([]);

    useEffect(() => {
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        DanhSachThongTinDatPhong()
            .then(response => {
                setThongTinDatPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách thông tin đặt phòng:", error);
            });
    }, []);

    const handleDichVuChange = (e) => {
        const selectedDichVu = dichVuList.find(dv => dv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            dichVu: selectedDichVu
        });
    };

    const handleThongTinDatPhongChange = (e) => {
        const selectedThongTinDatPhong = thongTinDatPhongList.find(tp => tp.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            thongTinDatPhong: selectedThongTinDatPhong
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        ThemPhieuDichVu(formData)
            .then(response => {
                console.log("Phiếu dịch vụ đã được thêm thành công:", response.data);
                setFormData({
                    dichVu: null,
                    thongTinDatPhong: null,
                    soLuongSuDung: 1,
                    ngayBatDau: '',
                    ngayKetThuc: '',
                    giaSuDung: 0,
                    trangThai: 'Hoạt động',
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

                            {/* Thông Tin Đặt Phòng */}
                            <div className="mb-3">
                                <label htmlFor="thongTinDatPhong" className="form-label">Thông Tin Đặt Phòng</label>
                                <select className="form-select" id="thongTinDatPhong" name="thongTinDatPhong" value={formData.thongTinDatPhong?.id || ''} onChange={handleThongTinDatPhongChange} required>
                                    <option value="">Chọn thông tin đặt phòng</option>
                                    {thongTinDatPhongList.map(tp => (
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

                            {/* Ngày Bắt Đầu
                            <div className="mb-3">
                                <label htmlFor="ngayBatDau" className="form-label">Ngày Bắt Đầu</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="ngayBatDau"
                                    name="ngayBatDau"
                                    value={formData.ngayBatDau}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div> */}

                            {/* Ngày Kết Thúc */}
                            {/* <div className="mb-3">
                                <label htmlFor="ngayKetThuc" className="form-label">Ngày Kết Thúc</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="ngayKetThuc"
                                    name="ngayKetThuc"
                                    value={formData.ngayKetThuc}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div> */}

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
                                <select className="form-select" id="trangThai" name="trangThai" value={formData.trangThai} onChange={handleInputChange} required>
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

export default FormAddPhieuDichVu;
