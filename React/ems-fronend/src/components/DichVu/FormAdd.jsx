import React, { useState } from 'react';
import { ThemDichVu } from '../../services/DichVuService'; // Import API service
import Swal from 'sweetalert2'; // down npm install sweetalert2

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
                 // Hiển thị thông báo thành công khi thêm dịch vụ
                 Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm thành công',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#6a5acd' // Màu nút "OK"
                });

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
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Dịch Vụ</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Tên dịch vụ */}
                            <div className="mb-3">
                                <label htmlFor="tenDichVu" className="form-label">Tên Dịch Vụ</label>
                                <input type="text" className="form-control" id="tenDichVu" name="tenDichVu" value={formData.tenDichVu} onChange={handleInputChange} required />
                            </div>

                            {/* Giá dịch vụ */}
                            <div className="mb-3">
                                <label htmlFor="donGia" className="form-label">Giá</label>
                                <input type="number" className="form-control" id="donGia" name="donGia" value={formData.donGia} onChange={handleInputChange} required />
                            </div>

                            {/* Mô tả */}
                            <div className="mb-3">
                                <label htmlFor="moTa" className="form-label">Mô Tả</label>
                                <textarea className="form-control" id="moTa" name="moTa" value={formData.moTa} onChange={handleInputChange} required></textarea>
                            </div>

                            {/* Hình ảnh */}
                            <div className="mb-3">
                                <label className="form-label">Chọn Hình Ảnh</label>
                                <input type="file" className="form-control-file" id="file" onChange={handleFileChange} required />
                            </div>

                            {/* Trạng thái */}
                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <select className="form-control" id="trangThai" name="trangThai" value={formData.trangThai} onChange={handleInputChange}>
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
