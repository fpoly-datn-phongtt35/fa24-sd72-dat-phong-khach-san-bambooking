import React, { useState } from 'react';
import { addTienIch } from '../../services/TienIchService';


const FormAdd = ({ show, handleClose }) => {
    const [tenTienIch, setTenTienIch] = useState('');
    const [file, setFile] = useState(null);

    // const [formData, setFormData] = useState({
    //     tenTienIch: '',  // Giá trị ban đầu là rỗng
    //     hinhAnh: '',     // Giá trị ban đầu là rỗng
    // });
    // const [imagePreview, setImagePreview] = useState(''); // State để lưu URL tạm thời của ảnh

    // Hàm xử lý thay đổi giá trị input
    const handleTenTienIchChange = (e) => {
        setTenTienIch(e.target.value);
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenTienIch', tenTienIch);
        // Gọi API thêm mới tiện ích với formData, trong đó hinhAnh chỉ là tên file
        addTienIch(formData)
            .then(response => {
                console.log("Thêm mới thành công:", response.data);
                // setTenTienIch('');
                // setFile(null);
                handleClose(); // Đóng modal sau khi thêm thành công
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới:", error);
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
                        <h5 className="modal-title">Thêm tiện ích</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Tên tiện ích */}
                            <div className="mb-3">
                                <label htmlFor="tenTienIch" className="form-label">Tên tiện ích</label>
                                <input type="text" className="form-control" id="tenTienIch" name="tenTienIch" value={tenTienIch} onChange={handleTenTienIchChange} required />
                            </div>

                            {/* Hình ảnh (chỉ lấy tên file) */}
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

                            {/* Hiển thị hình ảnh đã chọn */}
                            {/* {imagePreview && (
                                <div className="mb-3">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                </div>
                            )} */}

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
