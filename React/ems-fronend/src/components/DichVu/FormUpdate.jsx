import React, { useState, useEffect } from 'react';
import { CapNhatDichVu } from '../../services/DichVuService';
import Swal from 'sweetalert2'; // down npm install sweetalert2

const FormUpdate = ({ show, handleClose, refreshData, dichVu }) => {
    const [tenDichVu, setTenDichVu] = useState('');
    const [donGia, setDonGia] = useState('');
    const [moTa, setMoTa] = useState('');
    const [hinhAnh, setHinhAnh] = useState(null); // State để lưu hình ảnh
    const [trangThai, setTrangThai] = useState(true); // Mặc định là true (Hoạt động)

    // Sử dụng useEffect để cập nhật state khi dichVu thay đổi
    useEffect(() => {
        if (dichVu) {
            setTenDichVu(dichVu.tenDichVu);
            setDonGia(dichVu.donGia);
            setMoTa(dichVu.moTa);
            setHinhAnh(dichVu.hinhAnh); // Cập nhật hình ảnh từ dichVu
            setTrangThai(dichVu.trangThai); // Giá trị boolean từ dichVu
        }
    }, [dichVu]);

    // Hàm xử lý khi submit form cập nhật dịch vụ
    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', dichVu.id); // Thêm ID dịch vụ vào formData
        formData.append('tenDichVu', tenDichVu);
        formData.append('donGia', donGia);
        formData.append('moTa', moTa);
        formData.append('trangThai', trangThai);

        // Chỉ thêm hình ảnh mới nếu người dùng chọn một hình ảnh mới
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files[0]) {
            formData.append('hinhAnh', fileInput.files[0]); // Thêm hình ảnh mới
        } else {
            // Nếu không có hình ảnh mới, giữ lại hình ảnh hiện tại
            formData.append('hinhAnh', dichVu.hinhAnh); // Sử dụng đường dẫn hình ảnh hiện tại
        }

        // Gọi API cập nhật dịch vụ
        CapNhatDichVu(formData)
            .then(() => {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Dịch vụ đã được cập nhật.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                refreshData(); // Tải lại danh sách dịch vụ
                handleClose(); // Đóng form
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật dịch vụ:", error);
            });
    };



    // Hàm xử lý khi chọn hình ảnh
    const handleImageChange = (e) => {
        setHinhAnh(e.target.files[0]); // Lưu tệp hình ảnh
    };

    if (!show) return null; // Không hiển thị nếu không có yêu cầu

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cập Nhật Dịch Vụ</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleUpdate}>
                            {/* Tên dịch vụ */}
                            <div className="mb-3">
                                <label className="form-label">Tên Dịch Vụ</label>
                                <input type="text" className="form-control" value={tenDichVu} onChange={(e) => setTenDichVu(e.target.value)} required />
                            </div>

                            {/* Giá dịch vụ */}
                            <div className="mb-3">
                                <label className="form-label">Giá</label>
                                <input type="number" className="form-control" value={donGia} onChange={(e) => setDonGia(e.target.value)} required />
                            </div>

                            {/* Mô tả */}
                            <div className="mb-3">
                                <label className="form-label">Mô Tả</label>
                                <textarea className="form-control" value={moTa} onChange={(e) => setMoTa(e.target.value)} required></textarea>
                            </div>

                            {/* Hình ảnh */}
                            <div className="mb-3">
                                <label className="form-label">Chọn Hình Ảnh</label>
                                <input type="file" className="form-control-file" accept="image/*" onChange={handleImageChange} />
                                {dichVu.hinhAnh && (
                                    <img src={dichVu.hinhAnh} alt="Hình ảnh dịch vụ" className="img-fluid mt-2 rounded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                )}
                            </div>

                            {/* Trạng thái */}
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
    );
};

export default FormUpdate;
