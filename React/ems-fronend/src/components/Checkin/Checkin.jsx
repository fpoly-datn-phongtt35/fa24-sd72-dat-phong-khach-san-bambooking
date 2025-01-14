import React, { useState } from 'react'
import './Checkin.scss';
import { checkIn, phongDaXep } from '../../services/XepPhongService';
const Checkin = ({ show, handleClose, thongTinDatPhong }) => {
    const [ngayNhanPhong, setNgayNhanPhong] = useState('');
    const [ngayTraPhong, setNgayTraPhong] = useState('');
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
    const handleNgayNhanPhongChange = (event) => {
        // Retrieve the date part from thongTinDatPhong
        const ngayNhanPhongDate = thongTinDatPhong.getNgayNhanPhong();
    
        // Retrieve the time part from the event target value
        const timeValue = event.target.value; // Assuming time is in "HH:mm:ss" or "HH:mm" format
    
        // Combine date and time into a single LocalDateTime string
        const combinedDateTime = `${ngayNhanPhongDate}T${timeValue}`;
    
        // Update state with the combined LocalDateTime
        setNgayNhanPhong(combinedDateTime);
    };

    const handleNgayTraPhongChange = (event) => {
        const ngayNhanPhongDate = thongTinDatPhong.getNgayTraPhong();
    
        // Retrieve the time part from the event target value
        const timeValue = event.target.value; // Assuming time is in "HH:mm:ss" or "HH:mm" format
    
        // Combine date and time into a single LocalDateTime string
        const combinedDateTime = `${ngayNhanPhongDate}T${timeValue}`;

        setNgayTraPhong(combinedDateTime);
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
                            type="datetime-local"
                            id="ngayNhanPhong"
                            value={ngayNhanPhong}
                            onChange={handleNgayNhanPhongChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ngayTraPhong">Ngày trả phòng</label>
                        <input
                            type="localdate-time"
                            id="ngayTraPhong"
                            value={ngayTraPhong}
                            onChange={handleNgayTraPhongChange}
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