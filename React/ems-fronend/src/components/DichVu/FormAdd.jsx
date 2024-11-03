import React, { useState } from 'react';
import './FormAdd.css'; // CSS cho modal
import { ThemDichVu } from '../../services/DichVuService'; // Import API service

const FormAdd = ({ show, handleClose, refreshData }) => {
    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        tenDichVu: '',
        donGia: '',
        moTa: '',
        hinhAnh: null, // Chứa file hình ảnh
        trangThai: true, // Dùng boolean, mặc định là true (Hoạt động)
    });

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Nếu là select của trangThai, chuyển đổi giá trị từ chuỗi thành boolean
        if (name === "trangThai") {
            setFormData({
                ...formData,
                [name]: value === 'true',  // Chuyển đổi chuỗi 'true' hoặc 'false' thành boolean
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,  // Cập nhật formData dựa trên thuộc tính name của input
            });
        }
    };

    // Hàm xử lý khi chọn file hình ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên
        setFormData({
            ...formData,
            hinhAnh: file, // Lưu file hình ảnh vào state
        });
    };

    // Hàm xử lý khi nhấn nút lưu
    const handleSubmit = (e) => {
        e.preventDefault();

        // Tạo FormData để gửi file hình ảnh cùng với các dữ liệu khác
        const data = new FormData();
        data.append('tenDichVu', formData.tenDichVu);
        data.append('donGia', formData.donGia);
        data.append('moTa', formData.moTa);
        data.append('hinhAnh', formData.hinhAnh);
        data.append('trangThai', formData.trangThai);

        // Gọi API ThemDichVu để thêm dịch vụ
        ThemDichVu(data)
            .then(response => {
                console.log("Dịch vụ đã được thêm thành công:", response.data);
                // Reset form sau khi thêm thành công
                setFormData({
                    tenDichVu: '',
                    donGia: '',
                    moTa: '',
                    hinhAnh: null, // Reset về null
                    trangThai: true, // Reset về trạng thái hoạt động
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
                            name="tenDichVu"
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
                            name="donGia"
                            value={formData.donGia}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="moTa">Mô Tả:</label>
                        <textarea
                            id="moTa"
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hinhAnh">Chọn Hình Ảnh:</label>
                        <input
                            type="file"
                            id="hinhAnh"
                            name="hinhAnh"
                            accept="image/*" // Chỉ cho phép chọn hình ảnh
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="trangThai">Trạng Thái:</label>
                        <select
                            id="trangThai"
                            name="trangThai"
                            value={formData.trangThai}
                            onChange={handleInputChange}
                        >
                            <option value={true}>Hoạt động</option>
                            <option value={false}>Ngừng hoạt động</option>
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
