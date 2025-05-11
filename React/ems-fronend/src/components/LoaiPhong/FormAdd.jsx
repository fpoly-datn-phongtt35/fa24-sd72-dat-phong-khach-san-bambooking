import React, { useState } from 'react';
import { addLoaiPhong } from '../../services/LoaiPhongService';
import Swal from 'sweetalert2';

const FormAdd = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        tenLoaiPhong: '',
        maLoaiPhong: '',
        dienTich: '',
        soKhachToiDa: '',
        donGia: '',
        moTa: '',
        donGiaPhuThu: '',
        trangThai: 'Hoạt động',
    });

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['donGia', 'dienTich', 'donGiaPhuThu', 'soKhachToiDa'].includes(name)) {
            // Chỉ cho phép số không âm hoặc chuỗi rỗng
            if (value >= 0 || value === '') {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra các trường không được nhỏ hơn 0 hoặc rỗng
        if (formData.donGia === '' || formData.donGia < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Đơn giá phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.dienTich === '' || formData.dienTich < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Diện tích phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.donGiaPhuThu === '' || formData.donGiaPhuThu < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Đơn giá phụ thu phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.soKhachToiDa === '' || formData.soKhachToiDa < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Số khách tối đa phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Tạo object mới để không thay đổi formData gốc
        const updatedFormData = {
            ...formData,
            trangThai: formData.trangThai === 'Hoạt động'
        };

        Swal.fire({
            title: 'Xác nhận thêm mới',
            text: 'Bạn có chắc chắn muốn thêm loại phòng mới?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                addLoaiPhong(updatedFormData)
                    .then(response => {
                        console.log("Thêm mới thành công:", response.data);
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Loại phòng mới đã được thêm.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        handleClose();
                    })
                    .catch(error => {
                        console.error("Lỗi khi thêm mới:", error);
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể thêm loại phòng. Vui lòng thử lại sau!',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm loại phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="tenLoaiPhong" className="form-label">Tên Loại Phòng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tenLoaiPhong"
                                    name="tenLoaiPhong"
                                    value={formData.tenLoaiPhong}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="maLoaiPhong" className="form-label">Mã Loại Phòng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="maLoaiPhong"
                                    name="maLoaiPhong"
                                    value={formData.maLoaiPhong}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dienTich" className="form-label">Diện tích</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="dienTich"
                                    name="dienTich"
                                    value={formData.dienTich}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="soKhachToiDa" className="form-label">Số khách tối đa</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="soKhachToiDa"
                                    name="soKhachToiDa"
                                    value={formData.soKhachToiDa}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="donGia" className="form-label">Đơn giá</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="donGia"
                                    name="donGia"
                                    value={formData.donGia}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="donGiaPhuThu" className="form-label">Đơn giá phụ thu</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="donGiaPhuThu"
                                    name="donGiaPhuThu"
                                    value={formData.donGiaPhuThu}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="moTa" className="form-label">Mô tả</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="moTa"
                                    name="moTa"
                                    value={formData.moTa}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng thái</label>
                                <select
                                    className="form-control"
                                    id="trangThai"
                                    name="trangThai"
                                    value={formData.trangThai}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
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