import React, { useState, useEffect } from 'react';
import './XepPhong.scss'; // Đảm bảo bạn đã cài đặt SCSS và cấu hình Webpack nếu cần
import { getPhongKhaDung } from '../../services/PhongService';

function XepPhong({ show, handleClose, loaiPhong }) {
    const [listPhong, setListPhong] = useState([]);
    const [selectedPhong, setSelectedPhong] = useState('');

    // Hàm lấy danh sách phòng khả dụng
    const phongKhaDung = (idLoaiPhong) => {
        getPhongKhaDung(idLoaiPhong)
            .then((response) => {
                console.log(response.data);
                setListPhong(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy phòng khả dụng:", error);
            });
    };

    // Gọi API khi `show` là true và `loaiPhong` có giá trị
    useEffect(() => {
        if (show && loaiPhong) {
            phongKhaDung(loaiPhong.id); // Gọi API với `idLoaiPhong`
        }
    }, [show, loaiPhong]);

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-container ${show ? 'show' : ''}`}>
                <div className="modal-header">
                    <h2>Assign Room</h2>
                    <button className="close-button" onClick={handleClose}>✕</button>
                </div>
                <div className="modal-body">
                    <p>Loại phòng: {loaiPhong.tenLoaiPhong}</p>
                    
                    {/* Dropdown (Select) cho phòng khả dụng */}
                    <label htmlFor="phongSelect">Chọn phòng khả dụng:</label>
                    <select
                        id="phongSelect"
                        value={selectedPhong}
                        onChange={(e) => setSelectedPhong(e.target.value)}
                    >
                        <option value="">Chọn phòng</option>
                        {listPhong.map((phong) => (
                            <option key={phong.id} value={phong.id}>
                                {phong.maPhong} - {phong.tenPhong}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-footer">
                    <button className="footer-button cancel-button" onClick={handleClose}>Cancel</button>
                    <button className="footer-button save-button">Save</button>
                </div>
            </div>
        </div>
    );
}

export default XepPhong;
