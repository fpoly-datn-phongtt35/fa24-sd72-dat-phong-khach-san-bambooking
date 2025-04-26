import React, { useState } from 'react';
import { addVatTu } from '../../services/VatTuService';
import Swal from 'sweetalert2';

const FormAdd = ({ show, handleClose }) => {
    const [tenVatTu, setTenVatTu] = useState('');
    const [gia, setGia] = useState('');
    const [file, setFile] = useState(null);

    // Hàm xử lý thay đổi giá trị input
    const handleTenVatTuChange = (e) => {
        setTenVatTu(e.target.value);
    };

    const handleGiaChange = (e) => {
        const value = e.target.value;
        // Chỉ cho phép số không âm
        if (value >= 0 || value === '') {
            setGia(value);
        }
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra giá trước khi submit
        if (gia < 0 || gia === '') {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Giá phải là số không âm!',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenVatTu', tenVatTu);
        formData.append('gia', gia);
        
        // Gọi API thêm mới vật tư với formData
        addVatTu(formData)
            .then(response => {
                console.log("Thêm mới thành công:", response.data);
    
                // Hiển thị thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Vật tư đã được thêm mới thành công!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    handleClose(); // Đóng modal sau khi thêm thành công
                });
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới:", error);
    
                // Hiển thị thông báo lỗi
                Swal.fire({
                    icon: 'error',
                    title: 'Thất bại',
                    text: 'Đã xảy ra lỗi khi thêm mới vật tư. Vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
            });
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm vật tư</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Tên vật tư */}
                            <div className="mb-3">
                                <label htmlFor="tenVatTu" className="form-label">Tên vật tư</label>
                                <input type="text" className="form-control" id="tenVatTu" name="tenVatTu" value={tenVatTu} onChange={handleTenVatTuChange} required />
                            </div>

                            {/* Giá */}
                            <div className="mb-3">
                                <label htmlFor="gia" className="form-label">Giá</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="gia" 
                                    name="gia" 
                                    value={gia} 
                                    onChange={handleGiaChange} 
                                    required 
                                    min="0"
                                />
                            </div>

                            {/* Hình ảnh */}
                            <div className="form-group mb-3">
                                <label className='form-label'>Chọn Ảnh:</label>
                                <div className="mb-3">
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
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