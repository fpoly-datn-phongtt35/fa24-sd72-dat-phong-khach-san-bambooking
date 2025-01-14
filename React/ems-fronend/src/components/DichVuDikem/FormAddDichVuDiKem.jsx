import React, { useState, useEffect } from 'react';
import { ThemDichVuDiKem, DanhSachDichVu, DanhSachLoaiPhong } from '../../services/DichVuDiKemService';
import Swal from 'sweetalert2';

const FormAddDichVuDiKem = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        dichVu: null,
        loaiPhong: null,
        trangThai: true,
    });
    const [dichVuList, setDichVuList] = useState([]);
    const [loaiPhongList, setLoaiPhongList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        DanhSachLoaiPhong()
            .then(response => {
                setLoaiPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách loại phòng:", error);
            });
    }, []);

    const handleDichVuChange = (e) => {
        const selectedDichVu = dichVuList.find(dv => dv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            dichVu: selectedDichVu
        });
    };

    const handleLoaiPhongChange = (e) => {
        const selectedLoaiPhong = loaiPhongList.find(lp => lp.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            loaiPhong: selectedLoaiPhong
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        ThemDichVuDiKem(formData)
            .then(response => {
                // Hiển thị thông báo thành công với SweetAlert2
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Dịch vụ đi kèm đã được thêm thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
    
                // Reset form
                setFormData({
                    dichVu: null,
                    loaiPhong: null,
                    trangThai: true,
                });
    
                // Làm mới dữ liệu và đóng modal
                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
    
                let errorMsg = 'Đã xảy ra lỗi, vui lòng thử lại!';
                if (error.response && error.response.data) {
                    errorMsg = error.response.data.message || errorMsg;
                    if (errorMsg.includes('UNIQUE KEY constraint')) {
                        errorMsg = 'Dịch vụ và loại phòng đã tồn tại, vui lòng chọn khác!';
                    }
                }
    
                // Hiển thị thông báo lỗi với SweetAlert2
                Swal.fire({
                    title: 'Lỗi!',
                    text: errorMsg,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };
    

    if (!show) return null;

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Dịch Vụ Đi Kèm Mới</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="error-message text-danger">{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="dichVu" className="form-label">Dịch Vụ</label>
                                <select className="form-select" id="dichVu" name="dichVu" value={formData.dichVu?.id || ''} onChange={handleDichVuChange} required>
                                    <option value="">Chọn dịch vụ</option>
                                    {dichVuList.map(dv => (
                                        <option key={dv.id} value={dv.id}>{dv.tenDichVu}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loaiPhong" className="form-label">Loại Phòng</label>
                                <select className="form-select" id="loaiPhong" name="loaiPhong" value={formData.loaiPhong?.id || ''} onChange={handleLoaiPhongChange} required>
                                    <option value="">Chọn loại phòng</option>
                                    {loaiPhongList.map(lp => (
                                        <option key={lp.id} value={lp.id}>{lp.tenLoaiPhong}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <select
                                    className="form-select"
                                    id="trangThai"
                                    name="trangThai"
                                    value={formData.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}
                                    onChange={(e) => setFormData({ ...formData, trangThai: e.target.value === 'Hoạt động' })}
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAddDichVuDiKem;
