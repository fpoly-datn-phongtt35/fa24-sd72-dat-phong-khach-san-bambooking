import React, { useState, useEffect } from 'react';
import { updateVatTu, deleteVatTu, KiemTraVatTu } from '../../services/VatTuService';
import Swal from 'sweetalert2';


const FormDetail = ({ show, handleClose, data }) => {
    const [imagePreview, setImagePreview] = useState(''); // State để lưu URL hình ảnh đã chọn
    const [tenVatTu, setTenVatTu] = useState('');
    const [gia, setGia] = useState(0);
    const [idVatTu, setIdVatTu] = useState('');
    const [file, setFile] = useState('');
    // Cập nhật formData và imagePreview khi prop data thay đổi
    useEffect(() => {
        if (data) {

            setFile(data.hinhAnh);
            setImagePreview(data.hinhAnh); // Cập nhật hình ảnh
            setIdVatTu(data.id);
            setTenVatTu(data.tenVatTu);
            setGia(data.gia);

        }
    }, []);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTenVatTuChange = (e) => {
        setTenVatTu(e.target.value);

    };
    const handleGiaChange = (e) => {
        setGia(e.target.value);

    };
    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', idVatTu);
        formData.append('tenVatTu', tenVatTu);
        formData.append('gia', gia);
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('file', data?.hinhAnh);
        }

        console.log("Form data:", formData.get("id"), formData.get("file"), formData.get("tenVatTu"), formData.get("gia")); // Kiểm tra dữ liệu

        updateVatTu(formData)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật vật tư thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    handleClose(); // Đóng modal sau khi hiển thị thông báo
                });
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật:", error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Không thể cập nhật vật tư. Vui lòng thử lại sau!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };


    const handleDelete = async () => {
        try {
            if (!idVatTu) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không tìm thấy ID vật tư!',
                    confirmButtonColor: '#d33'
                });
                return;
            }
    
            // Gọi API kiểm tra xem vật tư có đang được sử dụng không
            const response = await KiemTraVatTu(idVatTu);
            console.log("Kết quả kiểm tra:", response.data); // 🛠 Debug API
    
            if (response.data.isUsed) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể xóa',
                    text: 'Vật tư đang được sử dụng!',
                    confirmButtonColor: '#3085d6'
                });
                return; // Dừng lại nếu vật tư đang được sử dụng
            }
    
            // Nếu không có dữ liệu liên quan, hiển thị hộp thoại xác nhận xóa
            Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa vật tư này?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteVatTu(idVatTu)
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Đã xóa!',
                                text: 'Vật tư đã được xóa thành công.',
                                confirmButtonColor: '#6a5acd'
                            });
                            handleClose(); // Đóng modal sau khi xóa
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: 'Không thể xóa vật tư. Vui lòng thử lại!',
                                confirmButtonColor: '#d33'
                            });
                        });
                }
            });
        } catch (error) {
            console.error("Lỗi khi kiểm tra vật tư:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Có lỗi xảy ra, vui lòng thử lại!',
                confirmButtonColor: '#d33'
            });
        }
    };    


    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết vật tư loại phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">ID</label>
                                <input type="text" className="form-control" id="id" name="id" value={idVatTu} readOnly />
                            </div>
                            {/* Tên vật tư */}
                            <div className="mb-3">
                                <label htmlFor="tenVatTu" className="form-label">Tên vật tư</label>
                                <input type="text" className="form-control" id="tenVatTu" name="tenVatTu" value={tenVatTu} onChange={handleTenVatTuChange} required />
                            </div>

                            {/* Giá */}
                            <div className="mb-3">
                                <label htmlFor="gia" className="form-label">Giá</label>
                                <input type="number" className="form-control" id="gia" name="gia" value={gia} onChange={handleGiaChange} required />
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
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Xóa vật tư</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetail;
