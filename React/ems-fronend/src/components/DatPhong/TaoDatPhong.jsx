import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";

import {
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  XoaDatPhong,
  XoaKhachHangDatPhong,
} from "../../services/DatPhong";
import { addThongTinDatPhong } from "../../services/TTDP";

// Hàm chuyển đổi giá trị đầu vào thành đối tượng dayjs hợp lệ
const parseToDayjs = (value) => {
  if (!value) return dayjs();
  try {
    const d = dayjs(value);
    return d.isValid() ? d : dayjs();
  } catch (error) {
    return dayjs();
  }
};

const TaoDatPhong = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ngayNhanPhong, ngayTraPhong, soNguoi, soPhong } =
    location.state || {};

  // Chuyển đổi giá trị nhận từ location.state thành dayjs object
  const initialNgayNhanPhong = ngayNhanPhong
    ? parseToDayjs(ngayNhanPhong)
    : dayjs();
  const initialNgayTraPhong = ngayTraPhong
    ? parseToDayjs(ngayTraPhong)
    : dayjs().add(1, "day");

  const [bookingData, setBookingData] = useState({
    ngayNhanPhong: initialNgayNhanPhong,
    ngayTraPhong: initialNgayTraPhong,
    soNguoi: soNguoi || 1,
    soPhong: soPhong || 1,
  });

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

  // State để mở dialog chỉnh sửa thông tin phòng
  // Lưu trữ: { index: số thứ tự, data: đối tượng phòng }
  const [roomToEdit, setRoomToEdit] = useState(null);
  // State chứa dữ liệu chỉnh sửa của phòng hiện tại
  const [editRoomData, setEditRoomData] = useState({
    tenLoaiPhong: "",
    donGia: 0,
  });

  useEffect(() => {
    if (roomToEdit) {
      setEditRoomData(roomToEdit.data);
    }
  }, [roomToEdit]);

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
    const start = parseToDayjs(bookingData.ngayNhanPhong);
    const end = parseToDayjs(bookingData.ngayTraPhong);
    const diffMs = end.valueOf() - start.valueOf();
    // Tính số ngày, nếu diffMs <= 0 thì mặc định là 1 ngày
    const totalDays =
      diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 1;
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

  // Hàm mở dialog chỉnh sửa cho phòng được chọn
  const handleEditRoom = (room, index) => {
    setRoomToEdit({ index, data: room });
  };

  // Xử lý thay đổi dữ liệu trong form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRoomData((prev) => ({
      ...prev,
      [name]: name === "donGia" ? Number(value) : value,
    }));
  };

  // Lưu lại thông tin chỉnh sửa của phòng
  const handleSaveEditedRoom = () => {
    if (roomToEdit !== null) {
      const updatedRooms = [...selectedRooms];
      updatedRooms[roomToEdit.index] = {
        ...updatedRooms[roomToEdit.index],
        ...editRoomData,
      };
      setSelectedRooms(updatedRooms);
      setRoomToEdit(null);
    }
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

      const thongTinDatPhongRequestList = [];
      selectedRooms.forEach((room) => {
        for (let i = 0; i < bookingData.soPhong; i++) {
          thongTinDatPhongRequestList.push({
            datPhong: datPhongResponse.data,
            idLoaiPhong: room.id,
            maThongTinDatPhong: "",
            ngayNhanPhong: bookingData.ngayNhanPhong.toISOString(),
            ngayTraPhong: bookingData.ngayTraPhong.toISOString(),
            soNguoi: bookingData.soNguoi,
            giaDat: room.donGia,
            trangThai: "Chua xep",
          });
        }
      });

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
    <Container sx={{ minWidth: "1300px", padding: 2 }}>
      <Paper elevation={1} sx={{ mt: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tạo Đặt Phòng
        </Typography>

        {showError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            Vui lòng điền đầy đủ thông tin trước khi xác nhận đặt phòng.
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Thông Tin Người Đặt & Chỉnh sửa Thông Tin Đặt Phòng */}
          <Grid item xs={12} md={12}>
            <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông Tin Người Đặt
              </Typography>
              <Grid container spacing={2}>
                {/* Hai input trong một dòng */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    id="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    error={!!formErrors.ho}
                    helperText={formErrors.ho}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    id="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    error={!!formErrors.ten}
                    helperText={formErrors.ten}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    id="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    error={!!formErrors.sdt}
                    helperText={formErrors.sdt}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Chi Tiết Phòng Đã Chọn */}
          <Grid item xs={12} md={12}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chi Tiết Phòng Đã Chọn ({selectedRooms.length})
              </Typography>
              <TableContainer sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày nhận phòng</TableCell>
                      <TableCell>Ngày trả phòng</TableCell>
                      <TableCell>Loại phòng</TableCell>
                      <TableCell>Số phòng</TableCell>
                      <TableCell>Số người</TableCell>
                      <TableCell>Giá mỗi đêm (VND)</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRooms.length > 0 ? (
                      selectedRooms.map((room, index) => (
                        <TableRow key={room.id + "-" + index}>
                          <TableCell>
                            {bookingData.ngayNhanPhong.format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>
                            {bookingData.ngayTraPhong.format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>{room.tenLoaiPhong}</TableCell>
                          <TableCell>{bookingData.soPhong}</TableCell>
                          <TableCell>{bookingData.soNguoi}</TableCell>
                          <TableCell>{room.donGia.toLocaleString()}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleEditRoom(room, index)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleRemoveRoom(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          Không có phòng nào được chọn
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ textAlign: "right", mb: 2 }}>
                <strong>Tổng tiền:</strong>{" "}
                {calculateTotalAmount().toLocaleString()} VND
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConfirmBooking}
              >
                Xác nhận đặt phòng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog chỉnh sửa thông tin phòng */}
      <Dialog open={roomToEdit !== null} onClose={() => setRoomToEdit(null)}>
        <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Loại phòng"
            name="tenLoaiPhong"
            fullWidth
            value={editRoomData.tenLoaiPhong}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Giá mỗi đêm"
            name="donGia"
            type="number"
            fullWidth
            value={editRoomData.donGia}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoomToEdit(null)}>Hủy</Button>
          <Button onClick={handleSaveEditedRoom} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaoDatPhong;
