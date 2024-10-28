import React, { useState, useEffect } from 'react';
import { updateTienIch, deleteTienIch } from '../../services/TienIchService';

const FormDetail = ({ show, handleClose, data }) => {
    // const [formData, setFormData] = useState({
    //     id: data?.id || '',
    //     tenTienIch: data?.tenTienIch || '',
    //     hinhAnh: data?.hinhAnh || '',
    // });
    const [imagePreview, setImagePreview] = useState(''); // State để lưu URL hình ảnh đã chọn
    const [tenTienIch, setTenTienIch] = useState('');
    const [idTienIch, setIdTienIch] = useState('');
    const [file, setFile] = useState('');
    // Cập nhật formData và imagePreview khi prop data thay đổi
    useEffect(() => {
        if (data) {
            // setFormData({
            //     id: data.id,
            //     tenTienIch: data.tenTienIch || '', 
            //     hinhAnh: data.hinhAnh || '',
            // });
            setFile(data.hinhAnh );
            setImagePreview(data.hinhAnh); // Cập nhật hình ảnh
            setIdTienIch(data.id);
            setTenTienIch(data.tenTienIch);
        }
    }, []);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTenTienIchChange = (e) => {
        setTenTienIch(e.target.value);
        
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', idTienIch);
        formData.append('tenTienIch', tenTienIch);
        if (file) {
            formData.append('file', file);
        }else{
            setFile(data?.hinhAnh);
            formData.append('file', file);
        }
        console.log("Form data:", formData.get("id"), formData.get("file"), formData.get("tenTienIch")); // Kiểm tra dữ liệu
    
        updateTienIch(formData)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật:", error);
            });
    };

    // Xử lý xóa tiện ích
    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tiện ích này không?")) {
            deleteTienIch(formData.id)
                .then(response => {
                    console.log("Xóa thành công:", response.data);
                    handleClose();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa:", error);
                });
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết tiện ích phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">ID</label>
                                <input type="text" className="form-control" id="id" name="id" value={idTienIch} readOnly />
                            </div>
                            {/* Tên tiện ích */}
                            <div className="mb-3">
                                <label htmlFor="tenTienIch" className="form-label">Tên tiện ích</label>
                                <input type="text" className="form-control" id="tenTienIch" name="tenTienIch" value={tenTienIch} onChange={handleTenTienIchChange} required />
                            </div>

                            {/* Hình ảnh (chỉ lấy tên file) */}
                            <div className="mb-3">
                                <label htmlFor="hinhAnh" className="form-label">Hình ảnh</label>
                                <input type="file" className="form-control" id="file" name="file" onChange={handleInputChange} />
                            </div>

                            {/* Hiển thị hình ảnh đã chọn */}
                            {imagePreview && (
                                <div className="mb-3">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Xóa tiện ích</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetail;
