import React, { useState } from 'react'
import './Checkin.scss';
import { checkIn, phongDaXep } from '../../services/XepPhongService';
import { ThemPhuThu } from '../../services/PhuThuService';

const Checkin = ({ show, handleClose, thongTinDatPhong }) => {
    const [ngayNhanPhong, setNgayNhanPhong] = useState('');
    const [ngayTraPhong, setNgayTraPhong] = useState('');

    const handleCheckin = async () => {
        console.log(thongTinDatPhong);

        try {
            // Gọi API để lấy thông tin phòng đã xếp
            let xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
            console.log('Phòng trước khi check-in:', xepPhong);

            if (!xepPhong) {
                alert('Không tìm thấy phòng đã xếp.');
                return;
            }

            // Cập nhật thông tin xếp phòng trước
            const xepPhongRequest = {
                id: xepPhong.id,
                phong: xepPhong.phong,
                thongTinDatPhong: xepPhong.thongTinDatPhong,
                ngayNhanPhong: ngayNhanPhong, // Giờ được chọn từ input
                ngayTraPhong: ngayTraPhong,
                trangThai: xepPhong.trangThai,
            };

            console.log('Đang thực hiện xếp phòng:', xepPhongRequest);

            // Thực hiện check-in (cập nhật thông tin trong DB)
            await checkIn(xepPhongRequest);
            alert('Xếp phòng thành công!');

            // Gọi lại API để lấy dữ liệu phòng sau khi cập nhật
            xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
            console.log('Phòng sau khi check-in:', xepPhong);

            // Ngày nhận phòng từ XepPhong (sau khi cập nhật)
            const ngayNhanPhongXepPhong = new Date(xepPhong.ngayNhanPhong);
            console.log('Ngày nhận phòng sau cập nhật:', ngayNhanPhongXepPhong);

            // Thiết lập 14h00 chiều
            const gio14Chieu = new Date(ngayNhanPhongXepPhong);
            gio14Chieu.setHours(14, 0, 0, 0);

            // Kiểm tra nếu ngày nhận phòng > 14h00 chiều
            if (ngayNhanPhongXepPhong > gio14Chieu) {
                const phuThuRequest = {
                    xepPhong: { id: xepPhong.id },
                    tenPhuThu: 'Phụ thu do nhận phòng trễ',
                    tienPhuThu: 50000,
                    soLuong: 1,
                    trangThai: true,
                };

                console.log('Đang thêm phụ thu do nhận phòng trễ:', phuThuRequest);

                // Thực hiện thêm phụ thu
                const phuThuResponse = await ThemPhuThu(phuThuRequest);
                console.log('Phụ thu do nhận phòng trễ thành công:', phuThuResponse.data);
                alert('Phụ thu do nhận phòng trễ đã được thêm.');
            } else {
                console.log('Không cần phụ thu: Ngày nhận phòng trước 14h chiều.');
            }
        } catch (error) {
            console.error('Lỗi xảy ra:', error);
            alert('Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng kiểm tra lại.');
        }
    };




    const handleNgayNhanPhongChange = (event) => {
        // Retrieve the date part from thongTinDatPhong
        // const ngayNhanPhongDate = thongTinDatPhong.getNgayNhanPhong();

        // Retrieve the time part from the event target value
        // const timeValue = event.target.value; // Assuming time is in "HH:mm:ss" or "HH:mm" format

        // Combine date and time into a single LocalDateTime string
        // const combinedDateTime = `${ngayNhanPhongDate}T${timeValue}`;

        // Update state with the combined LocalDateTime
        //setNgayNhanPhong(combinedDateTime);
        setNgayNhanPhong(event.target.value);
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
                            type="local-datetime"
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