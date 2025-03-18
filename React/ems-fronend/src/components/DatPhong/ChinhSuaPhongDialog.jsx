import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const ChinhSuaPhongDialog = ({ open, onClose, thongTinDatPhong, onSave }) => {
  // Initialize states with default values or passed props
  const [loaiPhong, setLoaiPhong] = useState(thongTinDatPhong?.loaiPhong || "Phòng đơn");
  const [ngayNhanPhong, setNgayNhanPhong] = useState(
    dayjs(thongTinDatPhong?.ngayNhanPhong || new Date())
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    dayjs(thongTinDatPhong?.ngayTraPhong || new Date())
  );
  const [giaDat, setGiaDat] = useState(thongTinDatPhong?.giaDat || "");
  const [soNguoi, setSoNguoi] = useState(thongTinDatPhong?.soNguoi || 1);

  // Handle save logic with validation
  const handleSave = () => {
    if (!giaDat || !soNguoi) {
      alert("Vui lòng nhập đầy đủ thông tin giá phòng và số người.");
      return;
    }

    if (ngayTraPhong.isBefore(ngayNhanPhong)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    const updatedBooking = {
      loaiPhong,
      ngayNhanPhong: ngayNhanPhong.format(),
      ngayTraPhong: ngayTraPhong.format(),
      giaDat,
      soNguoi,
    };

    // Pass the updated booking to the parent component and close the dialog
    onSave(updatedBooking);
    onClose();
  };

  // Update form states when thongTinDatPhong changes
  useEffect(() => {
    if (thongTinDatPhong) {
      setLoaiPhong(thongTinDatPhong.loaiPhong);
      setNgayNhanPhong(dayjs(thongTinDatPhong.ngayNhanPhong));
      setNgayTraPhong(dayjs(thongTinDatPhong.ngayTraPhong));
      setGiaDat(thongTinDatPhong.giaDat);
      setSoNguoi(thongTinDatPhong.soNguoi);
    }
  }, [thongTinDatPhong]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa thông tin đặt phòng</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Loại phòng</InputLabel>
              <Select
                value={loaiPhong}
                onChange={(e) => setLoaiPhong(e.target.value)}
              >
                <MenuItem value="">Phòng</MenuItem>
                {/* Add more room types if needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày nhận phòng"
                value={ngayNhanPhong}
                onChange={(newValue) => setNgayNhanPhong(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày trả phòng"
                value={ngayTraPhong}
                onChange={(newValue) => setNgayTraPhong(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá mỗi đêm"
              value={giaDat}
              onChange={(e) => setGiaDat(e.target.value)}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: <span>₫</span>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số người"
              value={soNguoi}
              onChange={(e) => setSoNguoi(e.target.value)}
              fullWidth
              type="number"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSave} color="primary">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChinhSuaPhongDialog;
