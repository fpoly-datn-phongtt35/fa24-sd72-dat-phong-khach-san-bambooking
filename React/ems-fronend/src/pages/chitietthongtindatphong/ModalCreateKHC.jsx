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
import { useNavigate } from "react-router-dom";
import UploadQR from "../../components/UploadQR";

const ModalCreateKHC = ({
  isOpen,
  onClose,
  thongTinDatPhong,
  onKhachHangAdded,
  initialData,
}) => {
  const navigate = useNavigate();
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;

  const [formData, setFormData] = useState({
    cccd: "",
    ho: "",
    ten: "",
    gioiTinh: "",
    diaChi: "",
    sdt: "",
    email: "",
    trangThai: false,
  });

  // Xử lý dữ liệu từ QR hoặc initialData
  const parseQRData = (data) => {
    const fields = data.split("|");
    if (fields.length >= 6) {
      const nameParts = fields[2].split(" ");
      return {
        cccd: fields[0],
        ho: nameParts[0],
        ten: nameParts.slice(1).join(" "),
        gioiTinh: fields[4],
        diaChi: fields[5],
        sdt: "",
        email: "",
        trangThai: true,
      };
    }
    return formData; // Trả về dữ liệu hiện tại nếu không phân tích được
  };

  // Điền dữ liệu từ initialData khi modal mở
  useEffect(() => {
    if (initialData) {
      // Nếu initialData có hoTen, tách thành ho và ten
      const hoTen = initialData.hoTen || "";
      const nameParts = hoTen.split(" ");
      const ho = nameParts[0] || "";
      const ten = nameParts.slice(1).join(" ") || "";

      setFormData({
        cccd: initialData.cmnd || "",
        ho: ho,
        ten: ten,
        gioiTinh: initialData.gioiTinh || "",
        diaChi: initialData.diaChi || "",
        sdt: "",
        email: "",
        trangThai: true,
      });
    }
  }, [initialData]);

  // Điền dữ liệu từ QR khi quét trong modal
  useEffect(() => {
    if (qrData) {
      const parsedData = parseQRData(qrData);
      setFormData(parsedData);
      closeQRScanner();
    }
  }, [qrData]);

  const openQRScanner = () => {
    setQRData("");
    setQRModalOpen(true);
  };

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
  };

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
        if (onKhachHangAdded) {
          onKhachHangAdded();
        }
        onClose();
        navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
      }
    } catch (e) {
      console.error("Lỗi khi thêm khách hàng:", e);
    }
  };

  const resetForm = () => {
    setFormData({
      cccd: "",
      ho: "",
      ten: "",
      gioiTinh: "",
      diaChi: "",
      sdt: "",
      email: "",
      trangThai: false,
    });
  };

  // Reset form khi đóng modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} fullWidth>
        <DialogTitle>Thêm Khách Hàng</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  onClick={openQRScanner}
                  variant="outlined"
                  color="primary"
                >
                  Quét QR
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ"
                  name="ho"
                  value={formData.ho}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CCCD"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                  fullWidth
                  required
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
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
