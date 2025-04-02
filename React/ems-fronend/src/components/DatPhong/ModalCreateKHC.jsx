import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemKhachHangDatPhong } from "../../services/DatPhong";
import { them } from "../../services/KhachHangCheckin";
import { useNavigate } from "react-router-dom";
import UploadQR from "../UploadQR"; // Đảm bảo đường dẫn đúng

const ModalCreateKHC = ({ isOpen, onClose, thongTinDatPhong }) => {
  const navigate = useNavigate();
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState(""); // Lưu dữ liệu quét được từ QR
  const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;

  const openQRScanner = () => {
    setQRData("");
    setQRModalOpen(true);
  };

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
  };

  const [formData, setFormData] = useState({
    cccd: "",
    ho: "",
    ten: "",
    gioiTinh: "",
    diaChi: "",
    sdt: "",
    email: "",
    trangThai: true,
  });

  // Khi qrData thay đổi, phân tích dữ liệu và cập nhật form.
  // Giả sử qrData có định dạng: "cccd|...|Họ và tên|...|Giới tính|Địa chỉ"
  useEffect(() => {
    if (qrData) {
      const fields = qrData.split("|");
      if (fields.length >= 6) {
        const newCccd = fields[0];
        const nameParts = fields[2].split(" ");
        const newHo = nameParts[0];
        const newTen = nameParts.slice(1).join(" ");
        const newGioiTinh = fields[4]; // Giả sử trường giới tính nằm ở index 4
        const newDiaChi = fields[5];
        setFormData((prev) => ({
          ...prev,
          cccd: newCccd,
          ho: newHo,
          ten: newTen,
          gioiTinh: newGioiTinh,
          diaChi: newDiaChi,
        }));
      }
      closeQRScanner();
    }
  }, [qrData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const khachHangRequest = {
      cccd: formData.cccd,
      ho: formData.ho,
      ten: formData.ten,
      gioiTinh: formData.gioiTinh,
      diaChi: formData.diaChi,
      sdt: formData.sdt,
      email: formData.email,
      trangThai: formData.trangThai,
    };

    try {
      const response = await ThemKhachHangDatPhong(khachHangRequest);
      if (response != null) {
        const KHCRequest = {
          khachHang: response.data,
          thongTinDatPhong: thongTinDatPhong,
          trangThai: true,
        };
        const response2 = await them(KHCRequest);
        console.log("Response create KHC:", response2);
        navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
      }
    } catch (e) {
      console.error("Lỗi khi thêm khách hàng:", e);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogTitle>Thêm Khách Hàng</DialogTitle>
        <form onSubmit={handleSubmit}>
          {/* Nút mở modal quét QR */}
          <Button onClick={openQRScanner} variant="outlined" color="primary">
            QR
          </Button>
          <DialogContent>
            <Grid container spacing={2}>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ"
                  name="ho"
                  value={formData.ho}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CCCD"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="gioiTinh-label">Giới Tính</InputLabel>
                  <Select
                    labelId="gioiTinh-label"
                    label="Giới Tính"
                    name="gioiTinh"
                    value={formData.gioiTinh}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>-- Chọn --</em>
                    </MenuItem>
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Địa Chỉ"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SĐT"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal quét QR */}
      <Dialog open={isQRModalOpen} onClose={closeQRScanner} fullWidth>
        <DialogTitle>Quét QR Code</DialogTitle>
        <DialogContent>
          <UploadQR setQRData={setQRData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQRScanner} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateKHC;
