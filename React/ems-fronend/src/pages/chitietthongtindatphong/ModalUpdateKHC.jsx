import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from 'sweetalert2';
import { updateKhachHang } from "../../services/KhachHangService";

const ModalUpdateKHC = ({ isOpen, onClose, khachHang, onKhachHangUpdated }) => {
  const [formData, setFormData] = useState({
    id: "",
    cccd: "",
    ho: "",
    ten: "",
    gioiTinh: "",
    sdt: "",
    email: "",
    diaChi: "",
    trangThai: true,
  });

  const [errors, setErrors] = useState({
    cccd: "",
    ho: "",
    ten: "",
    gioiTinh: "",
    sdt: "",
    email: "",
  });

  // Cập nhật formData khi khachHang thay đổi
  useEffect(() => {
    if (khachHang) {
      setFormData({
        id: khachHang.id || "",
        cccd: khachHang.cmnd || "",
        ho: khachHang.ho || "",
        ten: khachHang.ten || "",
        gioiTinh: khachHang.gioiTinh || "",
        sdt: khachHang.sdt || "",
        email: khachHang.email || "",
        diaChi: khachHang.diaChi || "",
        trangThai: khachHang.trangThai !== undefined ? khachHang.trangThai : true,
      });
    }
  }, [khachHang]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "trangThai" ? value === "true" : value,
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      cccd: "",
      ho: "",
      ten: "",
      gioiTinh: "",
      sdt: "",
      email: "",
    };

    // Validate các trường bắt buộc
    if (!formData.cccd.trim()) {
      newErrors.cccd = "CMND không được để trống";
      isValid = false;
    }
    if (!formData.ho.trim()) {
      newErrors.ho = "Họ không được để trống";
      isValid = false;
    }
    if (!formData.ten.trim()) {
      newErrors.ten = "Tên không được để trống";
      isValid = false;
    }
    if (!formData.gioiTinh.trim()) {
      newErrors.gioiTinh = "Giới tính không được để trống";
      isValid = false;
    }

    // Validate số điện thoại
    if (formData.sdt.trim()) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.sdt)) {
        newErrors.sdt = "Vui lòng nhập số điện thoại đúng định dạng";
        isValid = false;
      }
    }

    // Validate email
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Vui lòng nhập email đúng định dạng";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng kiểm tra lại thông tin nhập vào',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const updatedKhachHang = {
        ...formData,
      };
      await updateKhachHang(updatedKhachHang);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật khách hàng thành công',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6a5acd'
      });
      onKhachHangUpdated();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã có lỗi xảy ra khi cập nhật khách hàng',
        confirmButtonText: 'OK'
      });
    }
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "subj90%", sm: 600 },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h3" gutterBottom>
          Chỉnh sửa thông tin khách hàng
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="CMND"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.cccd}
              helperText={errors.cccd}
            />
            <TextField
              fullWidth
              label="Họ"
              name="ho"
              value={formData.ho}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.ho}
              helperText={errors.ho}
            />
            <TextField
              fullWidth
              label="Tên"
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.ten}
              helperText={errors.ten}
            />
            <TextField
              fullWidth
              label="Giới tính"
              name="gioiTinh"
              value={formData.gioiTinh}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.gioiTinh}
              helperText={errors.gioiTinh}
            />
            <TextField
              fullWidth
              label="SĐT"
              name="sdt"
              value={formData.sdt}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.sdt}
              helperText={errors.sdt}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="trangThai"
                value={formData.trangThai.toString()}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Lưu
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Hủy
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateKHC;