import React, { useState, useEffect } from 'react';
import { CapNhatDichVu } from '../../services/DichVuService'; 

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
        
        // Nếu có hình ảnh mới, thêm vào formData
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files[0]) {
            formData.append('hinhAnh', fileInput.files[0]);
        }
    
        // Gọi API cập nhật dịch vụ
        CapNhatDichVu(formData)
            .then(() => {
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
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Cập Nhật Dịch Vụ</h2>
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Tên Dịch Vụ:</label>
                        <input 
                            type="text" 
                            value={tenDichVu} 
                            onChange={(e) => setTenDichVu(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label>Giá:</label>
                        <input 
                            type="number" 
                            value={donGia} 
                            onChange={(e) => setDonGia(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label>Mô Tả:</label>
                        <textarea 
                            value={moTa} 
                            onChange={(e) => setMoTa(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label>Hình Ảnh Hiện Tại:</label>
                        {dichVu && dichVu.hinhAnh && (
                            <img 
                                src={dichVu.hinhAnh} // Đường dẫn tới hình ảnh hiện tại
                                alt="Hình ảnh dịch vụ" 
                                style={{ width: '200px', height: 'auto', marginBottom: '10px' }} // Kích thước hình ảnh
                            />
                        )}
                        <input 
                            type="file" 
                            accept="image/*" // Chỉ chấp nhận tệp hình ảnh
                            onChange={handleImageChange} // Xử lý sự kiện khi chọn tệp
                        />
                    </div>
                    <div>
                        <label>Trạng Thái:</label>
                        <select 
                            value={trangThai} 
                            onChange={(e) => setTrangThai(e.target.value === 'true')}>
                            <option value={true}>Hoạt Động</option>
                            <option value={false}>Ngừng Hoạt Động</option>
                        </select>
                    </div>
                    <button type="submit">Cập Nhật</button>
                    <button type="button" onClick={handleClose}>Đóng</button>
                </form>
            </div>
        </div>
    );
};

export default FormUpdate;
