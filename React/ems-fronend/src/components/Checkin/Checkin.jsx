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

      // Cập nhật thông tin xếp phòng
      const xepPhongRequest = {
        id: xepPhong.id,
        phong: xepPhong.phong,
        thongTinDatPhong: xepPhong.thongTinDatPhong,
        ngayNhanPhong: ngayNhanPhong, // Ngày nhận phòng đã kết hợp (date + time)
        ngayTraPhong: ngayTraPhong,   // Ngày trả phòng đã kết hợp
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

      // Thiết lập mốc thời gian 14:00 chiều cùng ngày
      const gio14Chieu = new Date(ngayNhanPhongXepPhong);
      gio14Chieu.setHours(14, 0, 0, 0);

      // Nếu nhận phòng trước 14:00 chiều thì thêm phụ thu
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
    const datePart = thongTinDatPhong.getNgayNhanPhong();
    const combined = `${datePart}T${timeValue}`;
    setNgayNhanPhong(combined);
  };

  // Xử lý thay đổi thời gian trả phòng
  const handleNgayTraPhongTimeChange = (event) => {
    const timeValue = event.target.value;
    setNgayTraPhongTime(timeValue);
    const datePart = thongTinDatPhong.getNgayTraPhong();
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
