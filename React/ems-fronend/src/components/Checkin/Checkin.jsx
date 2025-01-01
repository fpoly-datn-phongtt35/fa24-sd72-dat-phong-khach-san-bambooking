import React, { useState } from 'react'
import './Checkin.scss';
import { checkIn, phongDaXep } from '../../services/XepPhongService';
const Checkin = ({ show, handleClose, thongTinDatPhong }) => {
    const [ngayNhanPhong, setNgayNhanPhong] = useState('');
    const [ngayTraPhong, setNgayTraPhong] = useState('');
    const [ngayNhanPhongTime, setNgayNhanPhongTime] = useState('');
    const [ngayTraPhongTime, setNgayTraPhongTime] = useState('');
    const handleCheckin = async () => {
        console.log(thongTinDatPhong)
        const xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
        console.log(xepPhong);
        if (!xepPhong) {
            alert('Không tìm thấy phòng đã xếp.');
            return;
        }
        if (xepPhong != null) {
            const xepPhongRequest = {
                id: xepPhong.id,
                phong: xepPhong.phong,
                thongTinDatPhong: xepPhong.thongTinDatPhong,
                ngayNhanPhong: ngayNhanPhong,
                ngayTraPhong: ngayTraPhong,
                trangThai: xepPhong.trangThai
            };
            const response = await checkIn(xepPhongRequest);
            console.log(response.data);

        }

    }
    const handleNgayNhanPhongChange = () => {
        const ngayNhanPhongDate = thongTinDatPhong.ngayNhanPhong;
        const timeValue = ngayNhanPhongTime;
        const combinedDateTime = `${ngayNhanPhongDate}T${timeValue}`;
        setNgayNhanPhong(combinedDateTime);
    };

    const handleNgayTraPhongChange = () => {
        const ngayNhanPhongDate = thongTinDatPhong.ngayTraPhong;
        const timeValue = ngayTraPhongTime;
        const combinedDateTime = `${ngayNhanPhongDate}T${timeValue}`;
        setNgayTraPhong(combinedDateTime);
    };

    const handleNgayNhanPhongTimeChange = (event) => {
        setNgayNhanPhongTime(event.target.value);
        handleNgayNhanPhongChange();
    };

    const handleNgayTraPhongTimeChange = (event) => {
        setNgayTraPhongTime(event.target.value);
        handleNgayTraPhongChange();
    };

    if (!show) return null;
    return (
        <div className="checkin-modal-overlay">
            <div className={`checkin-modal-container ${show ? 'show' : ''}`}>
                <div className="modal-header">
                    <h4>Checkin</h4>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="ngayNhanPhong">Ngày nhận phòng</label>
                        <input
                            type="time"
                            id="ngayNhanPhong"
                            value={ngayNhanPhongTime}
                            onChange={handleNgayNhanPhongTimeChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ngayTraPhong">Ngày trả phòng</label>
                        <input
                            type="time"
                            id="ngayTraPhong"
                            value={ngayTraPhongTime}
                            onChange={handleNgayTraPhongTimeChange}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="footer-button cancel-button" onClick={handleClose}>Cancel</button>
                    <button onClick={handleCheckin}>checkin</button>
                </div>
            </div>
        </div>
    )
}

export default Checkin