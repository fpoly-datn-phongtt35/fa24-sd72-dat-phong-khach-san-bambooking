import React, { useState } from 'react';
import './FormAdd.css'; // CSS cho modal
import { ThemDichVu } from '../../services/DichVuService'; // Import API service

const FormAdd = ({ show, handleClose, refreshData }) => {
    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        tenDichVu: '',
        donGia: '',
        moTa: '',
        //hinhAnh: '',
        trangThai: 'active', // Đảm bảo giá trị mặc định không null
    });

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,  // Cập nhật formData dựa trên thuộc tính name của input
        });
    };

    // Hàm xử lý khi nhấn nút lưu
    const handleSubmit = (e) => {
        e.preventDefault();

        // Gọi API ThemDichVu để thêm dịch vụ
        ThemDichVu(formData)
            .then(response => {
                console.log("Dịch vụ đã được thêm thành công:", response.data);
                // Reset form sau khi thêm thành công
                setFormData({
                    tenDichVu: '',
                    donGia: '',
                    moTa: '',
                    //hinhAnh: '',
                    trangThai: 'active',
                });

                refreshData(); // Gọi callback để load lại dữ liệu bảng
                handleClose(); // Đóng modal sau khi lưu
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ:", error);
            });
    };

    if (!show) return null; // Không hiển thị modal nếu không mở

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Thêm Dịch Vụ Mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tenDichVu">Tên Dịch Vụ:</label>
                        <input
                            type="text"
                            id="tenDichVu"
                            name="tenDichVu"  // Đảm bảo name khớp với formData
                            value={formData.tenDichVu}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="donGia">Giá:</label>
                        <input
                            type="number"
                            id="donGia"
                            name="donGia"  // Đảm bảo name khớp với formData
                            value={formData.donGia}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="moTa">Mô Tả:</label>
                        <textarea
                            id="moTa"
                            name="moTa"  // Đảm bảo name khớp với formData
                            value={formData.moTa}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="hinhAnh">Link Hình Ảnh:</label>
                        <input
                            type="text"
                            id="hinhAnh"
                            name="hinhAnh"  // Đảm bảo name khớp với formData
                            value={formData.hinhAnh}
                            onChange={handleInputChange}
                            required
                        />
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="trangThai">Trạng Thái:</label>
                        <select
                            id="trangThai"
                            name="trangThai"  // Đảm bảo name khớp với formData
                            value={formData.trangThai}
                            onChange={handleInputChange}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={handleClose}>Đóng</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAdd;
