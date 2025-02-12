import React, { useState, useEffect } from "react";
import "./ModalDoiNgay.scss";
import { updateThongTinDatPhong } from "../../services/TTDP";
import { useNavigate } from "react-router-dom";

const ModalDoiNgay = ({ isOpen, onClose, thongTinDatPhong }) => {
    const [newArrival, setNewArrival] = useState("");
    const [newDeparture, setNewDeparture] = useState("");
    const [newNight, setNewNight] = useState(0);
    const navigate = useNavigate();
    
    const calculateNights = (arrival, departure) => {
        if (!arrival || !departure) return 0;
        const start = new Date(arrival);
        const end = new Date(departure);
        const diffInMs = end.getTime() - start.getTime();
        return diffInMs > 0 ? diffInMs / (1000 * 60 * 60 * 24) : 0;
    };

    useEffect(() => {
        setNewNight(calculateNights(newArrival, newDeparture));
    }, [newArrival, newDeparture]);

    useEffect(() => {
        if (thongTinDatPhong) {
            setNewNight(calculateNights(thongTinDatPhong.ngayNhanPhong, thongTinDatPhong.ngayTraPhong));
        }
    }, [thongTinDatPhong]);

    const handleUpdate = () => {
        if (!newArrival || !newDeparture || newNight <= 0) {
            alert("Please provide valid new dates.");
            return;
        }

        const TTDPRequest = {
            id: thongTinDatPhong.id,
            datPhong: thongTinDatPhong.datPhong,
            idLoaiPhong: thongTinDatPhong.loaiPhong.id,
            maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong,
            ngayNhanPhong: newArrival,
            ngayTraPhong: newDeparture,
            soNguoi: thongTinDatPhong.soNguoi,
            giaDat: thongTinDatPhong.giaDat,
            ghiChu: thongTinDatPhong.ghiChu,
            trangThai: thongTinDatPhong.trangThai,
        };

        updateThongTinDatPhong(TTDPRequest)
            .then((response) => {
                console.log(response.data);
                onClose();
                const maThongTinDatPhong = TTDPRequest.maThongTinDatPhong;
                navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-doingay-overlay">
            <div className="modal-doingay-content">
                <div className="form-section"> 
                    <div className="form-group">
                        <label>Ngày hiện tại</label>
                        <div className="form-row">
                            <div>
                                <span>Ngày nhận phòng</span>
                                <input type="text" value={thongTinDatPhong.ngayNhanPhong} disabled />
                            </div>
                            <div>
                                <span>Ngày trả phòng</span>
                                <input type="text" value={thongTinDatPhong.ngayTraPhong} disabled />
                            </div>
                            <div>
                                <span>Số đêm</span>
                                <input type="number" value={calculateNights(thongTinDatPhong.ngayNhanPhong, thongTinDatPhong.ngayTraPhong)} disabled />
                            </div>
                        </div>
                    </div> 
                    <div className="form-group">
                        <label>Ngày mới</label>
                        <div className="form-row">
                            <div>
                                <span>Ngày nhận phòng</span>
                                <input
                                    type="date"
                                    value={newArrival}
                                    onChange={(e) => setNewArrival(e.target.value)}
                                />
                            </div>
                            <div>
                                <span>Ngày trả phòng</span>
                                <input
                                    type="date"
                                    value={newDeparture}
                                    onChange={(e) => setNewDeparture(e.target.value)}
                                />
                            </div>
                            <div>
                                <span>Số đêm</span>
                                <input type="number" value={newNight} disabled />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-button">
                        Hủy
                    </button>
                    <button onClick={handleUpdate} className="confirm-button">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDoiNgay;
