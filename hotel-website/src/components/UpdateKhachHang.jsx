import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
  Container,
  TextField,
  Rating,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { UpdateKH,GuiEmailXacNhanDPSauUDKH } from "../services/DatPhong.js";

export default function UpdateKhachHang() {
  const { id,iddp } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ho: "",
    ten: "",
    sdt: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await UpdateKH({
        id,
        ...formData,
      });
      await GuiEmailXacNhanDPSauUDKH(iddp)
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật khách hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cập nhật thông tin khách hàng
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Họ"
          name="ho"
          value={formData.ho}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Tên"
          name="ten"
          value={formData.ten}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Số điện thoại"
          name="sdt"
          value={formData.sdt}
          onChange={handleChange}
          margin="normal"
          required
          type="tel"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          type="email"
        />
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </Box>
      </Box>

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mt: 2 }}
        >
          <AlertTitle>Thành công</AlertTitle>
          Cập nhật thông tin khách hàng thành công!
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mt: 2 }}
        >
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
      )}
    </Container>
  );
}