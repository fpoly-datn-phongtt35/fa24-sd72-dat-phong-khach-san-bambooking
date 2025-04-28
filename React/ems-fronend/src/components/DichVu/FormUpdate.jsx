import React, { useState, useEffect } from 'react';
import { CapNhatDichVu } from '../../services/DichVuService';
import Swal from 'sweetalert2';

const FormUpdate = ({ show, handleClose, refreshData, dichVu }) => {
    const [tenDichVu, setTenDichVu] = useState('');
    const [donGia, setDonGia] = useState('');
    const [moTa, setMoTa] = useState('');
    const [hinhAnh, setHinhAnh] = useState(null);
    const [trangThai, setTrangThai] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (dichVu) {
            setTenDichVu(dichVu.tenDichVu || '');
            setDonGia(dichVu.donGia || '');
            setMoTa(dichVu.moTa || '');
            setHinhAnh(dichVu.hinhAnh || '');
            setTrangThai(dichVu.trangThai);
        }
    }, [dichVu]);

    const validateForm = () => {
        let errors = {};
        if (!tenDichVu.trim()) errors.tenDichVu = "Tên dịch vụ không được để trống!";
        if (donGia === '' || donGia === null) errors.donGia = "Đơn giá không được để trống!";
        else if (donGia < 0) errors.donGia = "Đơn giá phải là số không âm!";
        if (!moTa.trim()) errors.moTa = "Mô tả không được để trống!";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDonGiaChange = (e) => {
        const value = e.target.value;
        if (value >= 0 || value === '') {
            setDonGia(value);
            setErrors((prevErrors) => ({ ...prevErrors, donGia: '' }));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('id', dichVu.id);
        formData.append('tenDichVu', tenDichVu);
        formData.append('donGia', donGia);
        formData.append('moTa', moTa);
        formData.append('trangThai', trangThai);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files[0]) {
            formData.append('hinhAnh', fileInput.files[0]);
        } else {
            formData.append('hinhAnh', dichVu.hinhAnh);
        }

        CapNhatDichVu(formData)
            .then(() => {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Dịch vụ đã được cập nhật.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật dịch vụ:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể cập nhật dịch vụ. Vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
            });
    };

    return show ? (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cập Nhật Dịch Vụ</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Tên Dịch Vụ</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.tenDichVu ? 'is-invalid' : ''}`}
                                    value={tenDichVu}
                                    onChange={(e) => setTenDichVu(e.target.value)}
                                />
                                {errors.tenDichVu && <div className="invalid-feedback">{errors.tenDichVu}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Giá</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.donGia ? 'is-invalid' : ''}`}
                                    value={donGia}
                                    onChange={handleDonGiaChange}
                                    min="0"
                                />
                                {errors.donGia && <div className="invalid-feedback">{errors.donGia}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Mô Tả</label>
                                <textarea
                                    className={`form-control ${errors.moTa ? 'is-invalid' : ''}`}
                                    value={moTa}
                                    onChange={(e) => setMoTa(e.target.value)}
                                ></textarea>
                                {errors.moTa && <div className="invalid-feedback">{errors.moTa}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Chọn Hình Ảnh</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    accept="image/*"
                                    onChange={(e) => setHinhAnh(e.target.files[0])}
                                />
                                {dichVu?.hinhAnh && (
                                    <img
                                        src={dichVu.hinhAnh}
                                        alt="Hình ảnh dịch vụ"
                                        className="img-fluid mt-2 rounded"
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                    />
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Trạng Thái</label>
                                <select className="form-control" value={trangThai} onChange={(e) => setTrangThai(e.target.value === 'true')}>
                                    <option value={true}>Hoạt Động</option>
                                    <option value={false}>Ngừng Hoạt Động</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                                <button type="submit" className="btn btn-primary">Cập Nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default FormUpdate;