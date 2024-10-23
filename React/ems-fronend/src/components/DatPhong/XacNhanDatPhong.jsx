import React, { useState, useEffect } from 'react';
import { getThongTinDatPhong } from '../../services/TTDP';
import "./XacNhanDatPhong.scss";
const XacNhanDatPhong = ({
    showModal,
    handleCloseModal,
    handleConfirmBooking,
    selectedRooms = [], // Mảng chứa các phòng đã chọn
    startDate,
    endDate,
    children,
    adults,
    datPhong,
    ttdpList = []
}) => {
    const [ttdp, setTTDP] = useState([]);
    const hienThi = (datPhong) => {
        getThongTinDatPhong(datPhong.id)
            .then((response) => {
                setTTDP(response.data.content);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    useEffect(() => {
        if (ttdpList.length > 0) {
            setTTDP(ttdpList);
        }
        console.log(ttdp);
    }, [ttdpList]);

    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Rooms ({selectedRooms.length})</h2>
                <h2>Mã đặt phòng: {datPhong.maDatPhong} </h2>
                {ttdp.length > 0 ? (
                    ttdp.map((ttdp, index) => (
                        <div key={index} className="ttdp-card">
                            <p>Mã thông tin đặt phòng: {ttdp.maThongTinDatPhong}</p>
                            <p>Thời gian: {ttdp.ngayNhanPhong} - {ttdp.ngayTraPhong}</p>
                            <p>Phòng: {ttdp.phong.maPhong}</p>
                            <p>Giá đặt: {ttdp.giaDat}</p>
                            <p>Số người: {ttdp.soNguoi}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có thông tin đặt phòng nào</p>
                )}

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                    <button className="confirm-btn" onClick={handleConfirmBooking}>Create</button>
                </div>
            </div>
        </div>
    );
};

export default XacNhanDatPhong;
