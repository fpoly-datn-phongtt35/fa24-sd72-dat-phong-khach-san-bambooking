import React, { useState } from 'react';
import { addLoaiPhong} from '../../services/LoaiPhongService';

const FormAdd = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        tenLoaiPhong: '', 
        dienTich: '',   
        sucChuaLon: '',   
        sucChuaNho: '',   
        moTa: '',   
        trangThai: '',   
    });


    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API thêm mới tiện ích với formData, trong đó hinhAnh chỉ là tên file
        addLoaiPhong(formData)
            .then(response => {
                console.log("Thêm mới thành công:", response.data);
                handleClose(); // Đóng modal sau khi thêm thành công
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới:", error);
            });
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
                                <label htmlFor="tenLoaiPhong" className="form-label">Tên Loại Phòng</label>
                                <input type="text" className="form-control" id="tenLoaiPhong" name="tenLoaiPhong" value={formData.tenLoaiPhong} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dienTich" className="form-label">Diện tích</label>
                                <input type="text" className="form-control" id="dienTich" name="dienTich" value={formData.dienTich} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="sucChuaLon" className="form-label">Sức chứa lớn</label>
                                <input type="text" className="form-control" id="sucChuaLon" name="sucChuaLon" value={formData.sucChuaLon} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="sucChuaNho" className="form-label">Sức chứa nhỏ</label>
                                <input type="text" className="form-control" id="sucChuaNho" name="sucChuaNho" value={formData.sucChuaNho} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="moTa" className="form-label">Mô tả</label>
                                <input type="text" className="form-control" id="moTa" name="moTa" value={formData.moTa} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng thái</label>
                                <input type="text" className="form-control" id="trangThai" name="trangThai" value={formData.trangThai} onChange={handleInputChange} required />
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
