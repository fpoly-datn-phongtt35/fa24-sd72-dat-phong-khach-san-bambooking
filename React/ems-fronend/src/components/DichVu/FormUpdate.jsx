import React, { useState, useEffect } from 'react';
import { CapNhatDichVu } from '../../services/DichVuService'; 

const FormUpdate = ({ show, handleClose, refreshData, dichVu }) => {
    const [tenDichVu, setTenDichVu] = useState('');
    const [donGia, setDonGia] = useState('');
    const [moTa, setMoTa] = useState('');
    const [trangThai, setTrangThai] = useState(true); // Mặc định là true (Hoạt động)

    // Sử dụng useEffect để cập nhật state khi dichVu thay đổi
    useEffect(() => {
        if (dichVu) {
            setTenDichVu(dichVu.tenDichVu);
            setDonGia(dichVu.donGia);
            setMoTa(dichVu.moTa);
            setTrangThai(dichVu.trangThai); // Giá trị boolean từ dichVu
        }
    }, [dichVu]);

    // Hàm xử lý khi submit form cập nhật dịch vụ
    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedDichVu = {
            ...dichVu,
            tenDichVu,
            donGia,
            moTa,
            trangThai, // Boolean lưu vào
        };

        // Gọi API cập nhật dịch vụ
        CapNhatDichVu(updatedDichVu)
            .then(() => {
                refreshData(); // Tải lại danh sách dịch vụ
                handleClose(); // Đóng form
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật dịch vụ:", error);
            });
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
