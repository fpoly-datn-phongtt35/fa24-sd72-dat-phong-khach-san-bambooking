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
  Paper,
  Divider,
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

  const { ngayNhanPhong, ngayTraPhong, soNguoi, soPhong } = location.state || {};

  // Khởi tạo bookingData với định dạng ngày "YYYY-MM-DD" cho input type="date"
  const [bookingData, setBookingData] = useState({
    ngayNhanPhong: ngayNhanPhong ? dayjs(ngayNhanPhong.$d).format("YYYY-MM-DD") : "",
    ngayTraPhong: ngayTraPhong ? dayjs(ngayTraPhong.$d).format("YYYY-MM-DD") : "",
    soNguoi: soNguoi || 1,
    soPhong: soPhong || 1,
  });

  const [selectedRooms, setSelectedRooms] = useState(location.state?.selectedRooms || []);

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
    if (!bookingData.ngayNhanPhong || !bookingData.ngayTraPhong) return 0;
    const ngayNhan = dayjs(bookingData.ngayNhanPhong);
    const ngayTra = dayjs(bookingData.ngayTraPhong);
    const totalDays = Math.max(ngayTra.diff(ngayNhan, "day"), 1);
    // Với mỗi loại phòng được chọn, số tiền = giá mỗi đêm * số ngày * số phòng đặt (bookingData.soPhong)
    return selectedRooms.reduce(
      (total, room) => total + room.donGia * totalDays * bookingData.soPhong,
      0
    );
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
        trangThai: false,
      };

      khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }

      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + Date.now(),
        soNguoi: bookingData.soNguoi,
        soPhong: bookingData.soPhong,
        ngayDat: new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chờ xử lý",
      };

      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Tạo thông tin đặt phòng: Với mỗi loại phòng đã chọn, tạo booking detail theo số lượng phòng (bookingData.soPhong)
      const thongTinDatPhongRequestList = [];
      selectedRooms.forEach((room) => {
        for (let i = 0; i < bookingData.soPhong; i++) {
          thongTinDatPhongRequestList.push({
            datPhong: datPhongResponse.data,
            idLoaiPhong: room.id,
            maThongTinDatPhong: "",
            ngayNhanPhong: new Date(bookingData.ngayNhanPhong).toISOString(),
            ngayTraPhong: new Date(bookingData.ngayTraPhong).toISOString(),
            soNguoi: bookingData.soNguoi,
            giaDat: room.donGia,
            trangThai: "Chua xep",
          });
        }
      });

      // Gửi yêu cầu tạo thông tin đặt phòng cho từng record
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

  // Hiển thị ngày theo định dạng DD/MM/YYYY cho giao diện
  const displayNgayNhan = bookingData.ngayNhanPhong
    ? dayjs(bookingData.ngayNhanPhong).format("DD/MM/YYYY")
    : "";
  const displayNgayTra = bookingData.ngayTraPhong
    ? dayjs(bookingData.ngayTraPhong).format("DD/MM/YYYY")
    : "";

  return (
    <Container sx={{ minWidth: "1300px" }}>
      <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tạo Đặt Phòng
        </Typography>

        {showError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            Vui lòng điền đầy đủ thông tin trước khi xác nhận đặt phòng.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Thông Tin Người Đặt */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
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
            </Paper>
          </Grid>

          {/* Chi Tiết Phòng Đã Chọn & Chỉnh sửa thông tin đặt phòng */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chi Tiết Phòng Đã Chọn ({selectedRooms.length})
              </Typography>
              {/* Phần chỉnh sửa thông tin đặt phòng */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Chỉnh sửa thông tin đặt phòng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Ngày Nhận Phòng"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={bookingData.ngayNhanPhong}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          ngayNhanPhong: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Ngày Trả Phòng"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={bookingData.ngayTraPhong}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          ngayTraPhong: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Số Người"
                      type="number"
                      fullWidth
                      value={bookingData.soNguoi}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          soNguoi: Number(e.target.value),
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Số Phòng"
                      type="number"
                      fullWidth
                      value={bookingData.soPhong}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          soPhong: Number(e.target.value),
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
              <Typography variant="body2" gutterBottom>
                <strong>Thời gian:</strong> từ {displayNgayNhan} đến {displayNgayTra}
              </Typography>
              {selectedRooms.length > 0 ? (
                selectedRooms.map((room, index) => (
                  <Card
                    key={`${room.id}-${index}`}
                    sx={{
                      display: "flex",
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
                        <strong>Số phòng:</strong> {bookingData.soPhong}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Số người:</strong> {bookingData.soNguoi}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Giá mỗi đêm:</strong> {room.donGia.toLocaleString()} VND
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => handleRemoveRoom(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="body2">Không có phòng nào được chọn</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ textAlign: "right" }}>
                <strong>Tổng tiền:</strong> {calculateTotalAmount().toLocaleString()} VND
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleConfirmBooking}>
                Xác nhận đặt phòng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TaoDatPhong;
