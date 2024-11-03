import React, { useState, useEffect } from 'react';
import './XepPhong.scss';
import { useNavigate} from 'react-router-dom';
import { getPhongKhaDung } from '../../services/PhongService';
import { addXepPhong} from '../../services/XepPhongService';
function XepPhong({ show, handleClose, ttdp }) {
    const [listPhong, setListPhong] = useState([]);
    const [selectedPhong, setSelectedPhong] = useState('');
    const navigate = useNavigate();
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


    useEffect(() => {
        if (show && ttdp) {
            phongKhaDung(ttdp.loaiPhong.id); // Gọi API với `idLoaiPhong`
        }
    }, [show, ttdp]);

    const handleSave = () => {
        // Chuẩn bị dữ liệu để thêm xếp phòng
        const xepPhongRequest = {
            phong: { id: selectedPhong },  // ID của phòng được chọn
            thongTinDatPhong: { id: ttdp.id },  // ID của thông tin đặt phòng
            ngayNhanPhong: '', // Ngày nhận phòng từ thông tin đặt phòng
            ngayTraPhong: '',   // Ngày trả phòng từ thông tin đặt phòng
            trangThai: true                      // Trang thái có thể là true để đánh dấu phòng đã được xếp
        };
        console.log(xepPhongRequest);
        // Gọi API để thêm xếp phòng
        addXepPhong(xepPhongRequest)
            .then(() => {
                alert('Xếp phòng thành công!');
                navigate('/quan-ly-dat-phong');
                handleClose();
            })
            .catch((error) => {
                console.error("Lỗi khi xếp phòng:", error);
                alert('Xếp phòng thất bại!');
            });
    };
    if (!show) return null;

    
    return (
        <div className="modal-overlay">
            <div className={`modal-container ${show ? 'show' : ''}`}>
                <div className="modal-header">
                    <h2>Xếp phòng {ttdp.maTTDP}</h2>
                    <button className="close-button" onClick={handleClose}>✕</button>
                </div>
                <div className="modal-body">
                    <label htmlFor="phongSelect">Chọn phòng khả dụng: {ttdp.loaiPhong.tenLoaiPhong}</label>
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
                    <button className="footer-button save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default XepPhong;
