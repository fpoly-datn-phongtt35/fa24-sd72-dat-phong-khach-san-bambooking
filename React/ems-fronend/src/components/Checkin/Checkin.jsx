import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { checkIn, phongDaXep } from '../../services/XepPhongService';
import { ThemPhuThu } from '../../services/PhuThuService';

const Checkin = ({ show, handleClose, thongTinDatPhong }) => {
    const [ngayNhanPhong, setNgayNhanPhong] = useState('');
    const [ngayTraPhong, setNgayTraPhong] = useState('');
    const [ngayNhanPhongTime, setNgayNhanPhongTime] = useState('');
    const [ngayTraPhongTime, setNgayTraPhongTime] = useState('');
    const navigate = useNavigate();
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

            // Lấy thông tin loại phòng
            const loaiPhong = xepPhong.phong.loaiPhong;
            console.log("Loại phòng: ", loaiPhong);

            // Cập nhật thông tin xếp phòng
            const xepPhongRequest = {
                id: xepPhong.id,
                phong: xepPhong.phong,
                thongTinDatPhong: xepPhong.thongTinDatPhong,
                ngayNhanPhong: ngayNhanPhong, // Giờ được chọn từ input
                ngayTraPhong: ngayTraPhong,
                trangThai: xepPhong.trangThai,
            };
            console.log('Đang thực hiện check-in với:', xepPhongRequest);
            await checkIn(xepPhongRequest);
            alert('Check-in thành công!');

            // Lấy lại dữ liệu phòng sau khi cập nhật
            xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
            console.log('Phòng sau khi check-in:', xepPhong);

            const ngayNhanPhongXepPhong = new Date(xepPhong.ngayNhanPhong);
            console.log('Ngày nhận phòng sau cập nhật:', ngayNhanPhongXepPhong);
            const ngayTraPhongXepPhong = new Date(xepPhong.ngayTraPhong);
            console.log('Ngày trả phòng sau cập nhật:', ngayTraPhongXepPhong);

            // Thiết lập 14h00 chiều
            const gio14Chieu = new Date(ngayNhanPhongXepPhong);
            gio14Chieu.setHours(14, 0, 0, 0);

            // Kiểm tra nếu ngày nhận phòng < 14h00 chiều (nhận phòng sớm)
            if (ngayNhanPhongXepPhong < gio14Chieu) {
                const phuThuRequest = {
                    xepPhong: { id: xepPhong.id },
                    tenPhuThu: 'Phụ thu do nhận phòng sớm',
                    tienPhuThu: 50000,
                    soLuong: 1,
                    trangThai: true,
                };
                console.log('Đang thêm phụ thu:', phuThuRequest);
                const phuThuResponse = await ThemPhuThu(phuThuRequest);
                console.log('Phụ thu được thêm:', phuThuResponse.data);
                alert('Phụ thu do nhận phòng sớm đã được thêm.');
            } else {
                console.log('Không cần phụ thu: nhận phòng sau 14h.');
            }

            // Kiểm tra nếu số người vượt quá số khách tối đa của loại phòng
            if (thongTinDatPhong.soNguoi > loaiPhong.soKhachToiDa) {
                const soNguoiVuot = thongTinDatPhong.soNguoi - loaiPhong.soKhachToiDa;
                const tienPhuThuThem = soNguoiVuot * loaiPhong.donGiaPhuThu; // Giả sử đây là mức phụ thu trên mỗi người vượt

                const phuThuThemRequest = {
                    xepPhong: { id: xepPhong.id },
                    tenPhuThu: `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người)`,
                    tienPhuThu: tienPhuThuThem,
                    soLuong: 1,
                    trangThai: true,
                };
                console.log('Đang thêm phụ thu do vượt số khách tối đa:', phuThuThemRequest);
                const phuThuThemResponse = await ThemPhuThu(phuThuThemRequest);
                console.log('Phụ thu do vượt số khách tối đa đã được thêm:', phuThuThemResponse.data);
                alert(`Phụ thu do vượt số khách tối đa (${soNguoiVuot} người) đã được thêm.`);
            }

        } catch (error) {
            console.error('Lỗi xảy ra:', error);
            alert('Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng kiểm tra lại.');
        }
    };


    // Xử lý thay đổi thời gian nhận phòng
    const handleNgayNhanPhongTimeChange = (event) => {
        const timeValue = event.target.value; // Ví dụ: "08:30"
        setNgayNhanPhongTime(timeValue);
        // Giả sử thongTinDatPhong.getNgayNhanPhong() trả về phần date, ví dụ "2025-02-12"
        const datePart = thongTinDatPhong.ngayNhanPhong;
        const combined = `${datePart}T${timeValue}`;
        setNgayNhanPhong(combined);
    };


    // Xử lý thay đổi thời gian trả phòng
    const handleNgayTraPhongTimeChange = (event) => {
        const timeValue = event.target.value;
        setNgayTraPhongTime(timeValue);
        const datePart = thongTinDatPhong.ngayTraPhong;
        const combined = `${datePart}T${timeValue}`;
        setNgayTraPhong(combined);
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Checkin</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Ngày nhận phòng
                    </Typography>
                    <TextField
                        id="ngayNhanPhong"
                        type="time"
                        value={ngayNhanPhongTime}
                        onChange={handleNgayNhanPhongTimeChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Ngày trả phòng
                    </Typography>
                    <TextField
                        id="ngayTraPhong"
                        type="time"
                        value={ngayTraPhongTime}
                        onChange={handleNgayTraPhongTimeChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleCheckin} color="primary" variant="contained">
                    Checkin
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Checkin;
