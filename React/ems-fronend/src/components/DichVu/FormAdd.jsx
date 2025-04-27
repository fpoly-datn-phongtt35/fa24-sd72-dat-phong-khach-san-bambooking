import React, { useState } from 'react';
import { ThemDichVu } from '../../services/DichVuService';
import Swal from 'sweetalert2';

const FormAdd = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        tenDichVu: '',
        donGia: '',
        moTa: '',
        hinhAnh: null,
        trangThai: true,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'donGia') {
            // Chỉ cho phép số không âm hoặc chuỗi rỗng
            if (value >= 0 || value === '') {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: name === "trangThai" ? value === 'true' : value,
            });
        }

        // Xóa lỗi khi người dùng nhập lại
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            hinhAnh: file,
        });

        setErrors((prevErrors) => ({ ...prevErrors, hinhAnh: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        // Kiểm tra các trường bắt buộc
        if (!formData.tenDichVu.trim()) newErrors.tenDichVu = 'Vui lòng nhập tên dịch vụ!';
        if (formData.donGia === '') newErrors.donGia = 'Vui lòng nhập giá!';
        else if (formData.donGia < 0) newErrors.donGia = 'Giá phải là số không âm!';
        if (!formData.moTa.trim()) newErrors.moTa = 'Vui lòng nhập mô tả!';
        if (!formData.hinhAnh) newErrors.hinhAnh = 'Vui lòng chọn hình ảnh!';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = new FormData();
        data.append('tenDichVu', formData.tenDichVu);
        data.append('donGia', formData.donGia);
        data.append('moTa', formData.moTa);
        data.append('hinhAnh', formData.hinhAnh);
        data.append('trangThai', formData.trangThai);

        ThemDichVu(data)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm thành công',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#6a5acd'
                });

                setFormData({
                    tenDichVu: '',
                    donGia: '',
                    moTa: '',
                    hinhAnh: null,
                    trangThai: true,
                });

                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể thêm dịch vụ. Vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
            });
    };

    if (!show) return null;

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Dịch Vụ</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="tenDichVu" className="form-label">Tên Dịch Vụ</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.tenDichVu ? 'is-invalid' : ''}`} 
                                    id="tenDichVu" 
                                    name="tenDichVu" 
                                    value={formData.tenDichVu} 
                                    onChange={handleInputChange} 
                                />
                                {errors.tenDichVu && <div className="invalid-feedback">{errors.tenDichVu}</div>}                            
                            </div>

                            <div className="mb-3">
                                <label htmlFor="donGia" className="form-label">Giá</label>
                                <input 
                                    type="number" 
                                    className={`form-control ${errors.donGia ? 'is-invalid' : ''}`} 
                                    id="donGia" 
                                    name="donGia" 
                                    value={formData.donGia} 
                                    onChange={handleInputChange} 
                                    min="0"
                                />
                                {errors.donGia && <div className="invalid-feedback">{errors.donGia}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="moTa" className="form-label">Mô Tả</label>
                                <textarea 
                                    className={`form-control ${errors.moTa ? 'is-invalid' : ''}`} 
                                    id="moTa" 
                                    name="moTa" 
                                    value={formData.moTa} 
                                    onChange={handleInputChange}
                                ></textarea>
                                {errors.moTa && <div className="invalid-feedback">{errors.moTa}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Chọn Hình Ảnh</label>
                                <input 
                                    type="file" 
                                    className={`form-control-file ${errors.hinhAnh ? 'is-invalid' : ''}`} 
                                    id="file" 
                                    onChange={handleFileChange} 
                                />
                                {errors.hinhAnh && <div className="text-danger">{errors.hinhAnh}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <select 
                                    className="form-control" 
                                    id="trangThai" 
                                    name="trangThai" 
                                    value={formData.trangThai} 
                                    onChange={handleInputChange}
                                >
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

export default FormAdd;