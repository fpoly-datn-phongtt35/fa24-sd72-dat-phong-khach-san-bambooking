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

  // Lấy thông tin từ state truyền vào
  const { ngayNhanPhong, ngayTraPhong, soNguoi } = location.state || {};

  const validNgayNhanPhong = dayjs(ngayNhanPhong.$d).format("DD/MM/YYYY HH:mm");
  const validNgayTraPhong = dayjs(ngayTraPhong.$d).format("DD/MM/YYYY HH:mm");
  console.log(validNgayTraPhong);
  const [selectedRooms, setSelectedRooms] = useState(
    location.state?.selectedRooms || []
  );

  const [formData, setFormData] = useState({
    ho: "",
    ten: "",
    email: "",
    sdt: "",
  });

  const handleRemoveRoom = (roomIndex) => {
    setSelectedRooms((prevRooms) =>
      prevRooms.filter((_, index) => index !== roomIndex)
    );
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const calculateTotalAmount = () => {
    if (!validNgayNhanPhong || !validNgayTraPhong) return 0;
  
    // Chuyển đổi chuỗi ngày tháng sang đối tượng Date
    const ngayNhan = dayjs(stringToISO(validNgayNhanPhong));
    const ngayTra = dayjs(stringToISO(validNgayTraPhong));
  
    // Tính tổng số ngày (nếu bằng 0 thì đặt thành 1)
    const totalDays = Math.max(ngayTra.diff(ngayNhan, 'day'), 1);
  
    // Tính tổng tiền
    return selectedRooms.reduce(
      (total, room) => total + room.donGia * totalDays,
      0
    );
  };
  

  const isFormValid = () => {
    return formData.ho && formData.ten && formData.email && formData.sdt;
  };

  const dateToISO = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("Input không phải là đối tượng Date hợp lệ.");
    }

    // Chuyển đổi sang định dạng ISO
    return date.toISOString();
  };

  const stringToISO = (dateTimeString) => {
    // Tách ngày và giờ từ chuỗi
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Tạo đối tượng Date
    const date = new Date(year, month - 1, day, hour, minute);

    // Kiểm tra tính hợp lệ của Date
    if (isNaN(date)) {
      throw new Error("Chuỗi ngày giờ không hợp lệ.");
    }

    // Trả về chuỗi ISO
    return date.toISOString();
  };

  const handleConfirmBooking = async () => {
    if (!isFormValid()) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    let khachHangResponse = null;
    let datPhongResponse = null;
  
    try {
      // Bước 1: Tạo khách hàng
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
  
      // Bước 2: Tạo đặt phòng
      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + Date.now(),
        soNguoi: soNguoi,
        soPhong: selectedRooms.length,
        ngayDat: dateToISO(new Date()),
        tongTien: calculateTotalAmount(),
        datCoc: 0,
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chờ xử lý",
      };
  
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
  
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }
  
      // Bước 3: Tạo thông tin đặt phòng
      const dp = datPhongResponse.data;
      const thongTinDatPhongRequestList = selectedRooms.map((room) => ({
        datPhong: dp,
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
  
      // Nếu mọi thứ thành công
      alert("Đặt phòng thành công!");
      navigate("/quan-ly-dat-phong");
  
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      // Xử lý rollback (hủy dữ liệu đã tạo trước đó nếu cần)
      if (datPhongResponse && datPhongResponse.data) {
        alert("Hủy đặt phòng:", datPhongResponse.data);
        const test   = await XoaDatPhong(datPhongResponse.data.id);
        alert(test);
        alert("Đã xảy ra lỗi trong quá trình đặt phòng. Vui lòng thử lại.");
      }
  
      if (khachHangResponse && khachHangResponse.data) {
        console.log("Hủy khách hàng:", khachHangResponse.data);
        // Gọi API để xóa khách hàng nếu cần
        // await XoaKhachHang(khachHangResponse.data.id);
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
                    error={!formData.ho}
                    helperText={!formData.ho ? "Vui lòng nhập họ" : ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    id="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    error={!formData.ten}
                    helperText={!formData.ten ? "Vui lòng nhập tên" : ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!formData.email}
                    helperText={!formData.email ? "Vui lòng nhập email" : ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    id="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    error={!formData.sdt}
                    helperText={
                      !formData.sdt ? "Vui lòng nhập số điện thoại" : ""
                    }
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
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Chi Tiết Phòng Đã Chọn ({selectedRooms.length})
              </Typography>
              <Typography>
                Thời gian: từ {validNgayNhanPhong} đến {validNgayTraPhong}
              </Typography>
              {selectedRooms.length > 0 ? (
                selectedRooms.map((room, index) => (
                  <Card key={`${room.id}-${index}`} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography>Loại phòng: {room.tenLoaiPhong}</Typography>
                      <Typography>Số người: {soNguoi}</Typography>
                      <Typography>
                        Giá mỗi đêm: {room.donGia.toLocaleString()} VND
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
              <Typography variant="h6" sx={{ mt: 2 }}>
                Tổng tiền: {calculateTotalAmount().toLocaleString()} VND
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
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
