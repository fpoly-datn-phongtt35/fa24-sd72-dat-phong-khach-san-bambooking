import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

import {
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  XoaDatPhong,
  XoaKhachHangDatPhong,
} from "../../services/DatPhong";
import { addThongTinDatPhong } from "../../services/TTDP";

const TaoDatPhong = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ngayNhanPhong, ngayTraPhong, soNguoi } = location.state || {};
  const validNgayNhanPhong = dayjs(ngayNhanPhong.$d).format("DD/MM/YYYY HH:mm");
  const validNgayTraPhong = dayjs(ngayTraPhong.$d).format("DD/MM/YYYY HH:mm");
  const [selectedRooms, setSelectedRooms] = useState(
    location.state?.selectedRooms || []
  );

  const [formData, setFormData] = useState({
    ho: "",
    ten: "",
    email: "",
    sdt: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ho) errors.ho = "Vui lòng nhập họ";
    if (!formData.ten) errors.ten = "Vui lòng nhập tên";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.sdt) errors.sdt = "Vui lòng nhập số điện thoại";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalAmount = () => {
    if (!validNgayNhanPhong || !validNgayTraPhong) return 0;
    const ngayNhan = dayjs(stringToISO(validNgayNhanPhong));
    const ngayTra = dayjs(stringToISO(validNgayTraPhong));
    const totalDays = Math.max(ngayTra.diff(ngayNhan, "day"), 1);
    return selectedRooms.reduce((total, room) => total + room.donGia * totalDays, 0);
  };

  const stringToISO = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    const date = new Date(year, month - 1, day, hour, minute);
    if (isNaN(date)) throw new Error("Chuỗi ngày giờ không hợp lệ.");
    return date.toISOString();
  };

  const handleRemoveRoom = (roomIndex) => {
    setSelectedRooms((prevRooms) =>
      prevRooms.filter((_, index) => index !== roomIndex)
    );
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    setShowError(false);

    let khachHangResponse = null;
    let datPhongResponse = null;

    try {
      const khachHangRequest = {
        ho: formData.ho,
        ten: formData.ten,
        email: formData.email,
        sdt: formData.sdt,
        matKhau: "",
        trangThai: false,
      };

      khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }

      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + Date.now(),
        soNguoi: soNguoi,
        soPhong: selectedRooms.length,
        ngayDat: new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        datCoc: 0,
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chờ xử lý",
      };

      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      const thongTinDatPhongRequestList = selectedRooms.map((room) => ({
        datPhong: datPhongResponse.data,
        idLoaiPhong: room.id,
        maThongTinDatPhong: "",
        ngayNhanPhong: stringToISO(validNgayNhanPhong),
        ngayTraPhong: stringToISO(validNgayTraPhong),
        soNguoi,
        giaDat: room.donGia,
        trangThai: "Chua xep",
      }));

      for (const thongTinDatPhong of thongTinDatPhongRequestList) {
        const response = await addThongTinDatPhong(thongTinDatPhong);
        if (!response || !response.data) {
          throw new Error("Không thể tạo thông tin đặt phòng.");
        }
      }

      alert("Đặt phòng thành công!");
      navigate("/quan-ly-dat-phong");
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      if (datPhongResponse && datPhongResponse.data) {
        await XoaDatPhong(datPhongResponse.data.id);
      }
      if (khachHangResponse && khachHangResponse.data) {
        await XoaKhachHangDatPhong(khachHangResponse.data);
      }
      alert("Đã xảy ra lỗi trong quá trình đặt phòng. Vui lòng thử lại.");
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Tạo Đặt Phòng
        </Typography>

        {showError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            Vui lòng điền đầy đủ thông tin trước khi xác nhận đặt phòng.
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Thông Tin Người Đặt
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    id="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    error={!!formErrors.ho}
                    helperText={formErrors.ho || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    id="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    error={!!formErrors.ten}
                    helperText={formErrors.ten || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    id="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    error={!!formErrors.sdt}
                    helperText={formErrors.sdt || ""}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#ffffff",
                border: "1px solid #ddd",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Chi Tiết Phòng Đã Chọn ({selectedRooms.length})
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Thời gian:</strong> từ {validNgayNhanPhong} đến {validNgayTraPhong}
              </Typography>
              {selectedRooms.length > 0 ? (
                selectedRooms.map((room, index) => (
                  <Card
                    key={`${room.id}-${index}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      border: "1px solid #ddd",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">
                        <strong>Loại phòng:</strong> {room.tenLoaiPhong}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Số người:</strong> {soNguoi}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Giá mỗi đêm:</strong> {room.donGia.toLocaleString()} VND
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleRemoveRoom(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography>Không có phòng nào được chọn</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 3, textAlign: "right" }}>
                <strong>Tổng tiền:</strong> {calculateTotalAmount().toLocaleString()} VND
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleConfirmBooking}
              >
                Xác nhận đặt phòng
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TaoDatPhong;
