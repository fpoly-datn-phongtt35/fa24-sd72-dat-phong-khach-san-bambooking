import React, { useState, useEffect } from 'react';
import './XepPhong.scss';
import { useNavigate } from 'react-router-dom';
import { getPhongKhaDung } from '../../services/PhongService';
import { addXepPhong } from '../../services/XepPhongService';

function XepPhong({ show, handleClose, selectedTTDPs }) {
    const [listPhong, setListPhong] = useState({});
    const [selectedPhong, setSelectedPhong] = useState({});
    const navigate = useNavigate();

    const formatToLocalDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19);
    };

    const phongKhaDung = (idLoaiPhong, ngayNhanPhong, ngayTraPhong, ttdpId) => {
        getPhongKhaDung(idLoaiPhong, ngayNhanPhong, ngayTraPhong)
            .then((response) => {
                setListPhong(prevList => ({
                    ...prevList,
                    [ttdpId]: response.data
                }));
            })
            .catch((error) => {
                console.error("Lỗi khi lấy phòng khả dụng:", error);
            });
    };

    useEffect(() => {
        if (show && selectedTTDPs.length > 0) {
            selectedTTDPs.forEach(ttdp => {
                const formattedNgayNhanPhong = formatToLocalDateTime(ttdp.ngayNhanPhong);
                const formattedNgayTraPhong = formatToLocalDateTime(ttdp.ngayTraPhong);
                phongKhaDung(ttdp.loaiPhong.id, formattedNgayNhanPhong, formattedNgayTraPhong, ttdp.id);
            });
        }
    }, [show, selectedTTDPs]);

    const handlePhongChange = (ttdpId, phongId) => {
        setSelectedPhong(prevSelected => ({
            ...prevSelected,
            [ttdpId]: phongId
        }));
    };

    const handleSaveAll = () => {
        const requests = selectedTTDPs.map((ttdp) => {
            const xepPhongRequest = {
                phong: { id: selectedPhong[ttdp.id] },
                thongTinDatPhong: { id: ttdp.id },
                ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong),
                ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong),
                trangThai: true,
            };

            return addXepPhong(xepPhongRequest)
                .then(() => {
                    console.log(`Xếp phòng thành công cho: ${ttdp.maTTDP}`);
                })
                .catch((error) => {
                    console.error(`Lỗi khi xếp phòng cho ${ttdp.maTTDP}:`, error);
                });
        });

        Promise.all(requests)
            .then(() => {
                alert('Xếp phòng thành công cho tất cả các đặt phòng đã chọn!');
                navigate('/quan-ly-dat-phong');
                handleClose();
            })
            .catch(() => {
                alert('Xảy ra lỗi trong quá trình xếp phòng.');
            });
    };

    if (!show) return null;

    return (
        <div className="xp-modal-overlay">
            <div className={`xp-modal-container ${show ? 'show' : ''}`}>
                <div className="modal-header">
                    <h4>Xếp phòng</h4>
                    <button className="close-button" onClick={handleClose}>✕</button>
                </div>
                <div className="modal-body">
                    {selectedTTDPs.map((ttdp) => (
                        <div key={ttdp.id} className="ttdp-item">
                            <h5>Đặt phòng: {ttdp.maTTDP} - {ttdp.tenKhachHang}</h5>
                            <label>Chọn phòng khả dụng:</label>
                            <select
                                id={`phongSelect-${ttdp.id}`}
                                value={selectedPhong[ttdp.id] || ''}
                                onChange={(e) => handlePhongChange(ttdp.id, e.target.value)}
                            >
                                <option value="">Chọn phòng</option>
                                {(listPhong[ttdp.id] || []).map((phong) => (
                                    <option key={phong.id} value={phong.id}>
                                        {phong.maPhong} - {phong.tenPhong}
                                    </option>
                                ))}

                            </select>
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button className="footer-button cancel-button" onClick={handleClose}>Cancel</button>
                    <button
                        className="footer-button save-button"
                        onClick={handleSaveAll}
                        disabled={selectedTTDPs.some(ttdp => !selectedPhong[ttdp.id])} // Disable if any room is not selected
                    >
                        Save All
                    </button>
                </div>
            </div>
        </div>
    );
}

export default XepPhong;
