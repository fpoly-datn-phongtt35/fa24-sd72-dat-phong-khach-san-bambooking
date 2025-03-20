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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import ChinhSuaPhongDialog from "./ChinhSuaPhongDialog";

import {
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  XoaDatPhong,
  XoaKhachHangDatPhong,
  CapNhatDatPhong,
  SuaKhachHangDatPhong,
} from "../../services/DatPhong";
import {
  addThongTinDatPhong,
  huyTTDP,
  getThongTinDatPhong,
  updateThongTinDatPhong,
  deleteThongTinDatPhong,
} from "../../services/TTDP";

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
  const {
    ngayNhanPhong,
    ngayTraPhong,
    soNguoi,
    soPhong,
    selectData: initialSelectData,
    datPhong,
    khachHang,
    thongTinDatPhong,
  } = location.state || {};

  const [selectData, setSelectData] = useState(initialSelectData || []);
  const [ttdpData, setTtdpData] = useState(thongTinDatPhong || []);
  const [formData, setFormData] = useState({
    ho: "",
    ten: "",
    email: "",
    sdt: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [bookingData, setBookingData] = useState({
    ngayNhanPhong: ngayNhanPhong ? parseToDayjs(ngayNhanPhong) : dayjs(),
    ngayTraPhong: ngayTraPhong ? parseToDayjs(ngayTraPhong) : dayjs().add(1, "day"),
    soNguoi: soNguoi || 1,
    soPhong: soPhong || 1,
  });

  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      setTtdpData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      alert("Lỗi khi lấy thông tin đặt phòng");
    }
  };

  useEffect(() => {
    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    }
  }, [datPhong]);

  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setShowDialog(true);
  };

  const openDialog = () => {
    setRoomToEdit(null);
    setShowDialog(true);
  };

  // const handleSaveRoom = (updatedRoom) => {
  //   if (roomToEdit) {
  //     const updatedSelectData = selectData.map((item) =>
  //       item.selectedRooms.id === updatedRoom.loaiPhongResponse.id
  //         ? { ...item, selectedRooms: updatedRoom.loaiPhongResponse }
  //         : item
  //     );
  //     setSelectData(updatedSelectData);
  //   } else {
  //     const newData = {
  //       selectedRooms: updatedRoom.loaiPhongResponse,
  //       ngayNhanPhong: bookingData.ngayNhanPhong.toISOString(),
  //       ngayTraPhong: bookingData.ngayTraPhong.toISOString(),
  //       soNguoi: bookingData.soNguoi,
  //       soPhong: bookingData.soPhong,
  //     };
  //     setSelectData([...selectData, newData]);
  //   }
  //   setShowDialog(false);
  //   setRoomToEdit(null);
  // };

  const handleRemoveRoom = async (room) => {
    try {
      await huyTTDP(room.maThongTinDatPhong);
      const updatedThongTinDatPhong = thongTinDatPhong.filter(
        (item) => item.maThongTinDatPhong !== room.maThongTinDatPhong
      );
      setTtdpData(updatedThongTinDatPhong);
      fetchThongTinDatPhongById(datPhong.id);
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      alert("Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.");
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
        id: khachHang ? khachHang.id : null,
        ho: formData.ho,
        ten: formData.ten,
        email: formData.email,
        sdt: formData.sdt,
        trangThai: false,
      };
      khachHangResponse = await SuaKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }
      const datPhongRequest = {
        id: datPhong ? datPhong.id : null,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong ? datPhong.maDatPhong : "",
        soNguoi: thongTinDatPhong.reduce((total, room) => total + room.soNguoi, 0),
        soPhong: thongTinDatPhong.length,
        ngayDat: datPhong ? datPhong.ngayDat : new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Đã xác nhận",
      };
      datPhongResponse = await CapNhatDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }
      const thongTinDatPhongRequestList = [];
      ttdpData.forEach((room) => {
        for (let i = 0; i < bookingData.soPhong; i++) {
          thongTinDatPhongRequestList.push({
            id: room.id,
            datPhong: datPhongResponse.data,
            idLoaiPhong: room.loaiPhong.id,
            maThongTinDatPhong: room.maThongTinDatPhong,
            ngayNhanPhong: room.ngayNhanPhong,
            ngayTraPhong: room.ngayTraPhong,
            soNguoi: room.soNguoi,
            giaDat: room.giaDat,
            trangThai: "Chua xep",
          });
        }
      });
      for (const thongTinDatPhong of thongTinDatPhongRequestList) {
        const response = await updateThongTinDatPhong(thongTinDatPhong);
        if (!response || !response.data) {
          throw new Error("Không thể tạo thông tin đặt phòng.");
        }
      }
      alert("Đặt phòng thành công!");
      navigate("/thong-tin-dat-phong-search");
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      if (datPhongResponse && datPhongResponse.data) {
        try {
          await XoaDatPhong(datPhongResponse.data.id);
        } catch (err) {
          console.error("Lỗi khi rollback datPhong:", err);
        }
      }
      if (khachHangResponse && khachHangResponse.data) {
        try {
          await XoaKhachHangDatPhong(khachHangResponse.data);
        } catch (err) {
          console.error("Lỗi khi rollback khachHang:", err);
        }
      }
      alert("Đã xảy ra lỗi trong quá trình đặt phòng. Vui lòng thử lại.");
    }
  };

  const calculateTotalAmount = () => {
    return ttdpData.reduce((total, room) => {
      const days = calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong);
      return total + room.loaiPhong.donGia * days;
    }, 0);
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

  const calculateBookingDays = (ngayNhanPhong, ngayTraPhong) => {
    const start = dayjs(ngayNhanPhong);
    const end = dayjs(ngayTraPhong);
    const diffDays = end.diff(start, "day");
    return diffDays > 0 ? diffDays : 1;
  };

  const formatDateTime = (dateTimeValue) => {
    return dayjs(dateTimeValue).format("DD/MM/YYYY");
  };

  return (
    <Container sx={{ minWidth: "1300px", py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          '&:hover': { boxShadow: "0 6px 25px rgba(0,0,0,0.15)" },
          transition: "box-shadow 0.3s ease-in-out"
        }}
      >
        {showError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 1,
              bgcolor: "#ffebee",
              '& .MuiAlert-icon': { color: "#d32f2f" }
            }}
          >
            <AlertTitle sx={{ fontWeight: "bold" }}>Lỗi</AlertTitle>
            Vui lòng điền đầy đủ thông tin trước khi xác nhận đặt phòng.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Thông Tin Người Đặt */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: "#f5f5f5",
                border: "1px solid #e0e0e0"
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: "#1e3c72", fontWeight: 600 }}
              >
                Thông Tin Người Đặt
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    id="ho"
                    value={formData.ho}
                    onChange={(e) => setFormData({ ...formData, ho: e.target.value })}
                    error={!!formErrors.ho}
                    helperText={formErrors.ho}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-root': { 
                        borderRadius: 1,
                        backgroundColor: "#fff"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    id="ten"
                    value={formData.ten}
                    onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                    error={!!formErrors.ten}
                    helperText={formErrors.ten}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-root': { 
                        borderRadius: 1,
                        backgroundColor: "#fff"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-root': { 
                        borderRadius: 1,
                        backgroundColor: "#fff"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    id="sdt"
                    value={formData.sdt}
                    onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                    error={!!formErrors.sdt}
                    helperText={formErrors.sdt}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        borderRadius: 1,
                        backgroundColor: "#fff"
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Chi Tiết Phòng Đã Chọn */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: "#f5f5f5",
                border: "1px solid #e0e0e0"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ color: "#1e3c72", fontWeight: 600 }}
                >
                  Chi Tiết Phòng Đã Chọn ({ttdpData.length})
                </Typography>
                {/* <Button 
                  variant="outlined" 
                  onClick={openDialog}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    color: "#1976d2",
                    borderColor: "#1976d2",
                    '&:hover': {
                      bgcolor: "rgba(25, 118, 210, 0.04)",
                      borderColor: "#115293"
                    }
                  }}
                >
                  Thêm phòng
                </Button> */}
              </Box>

              <TableContainer sx={{ mb: 2, borderRadius: 2, bgcolor: "#fff" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: "#e0e0e0", color: "#1e3c72", fontWeight: 600 } }}>
                      <TableCell>Loại phòng</TableCell>
                      <TableCell>Ngày nhận phòng</TableCell>
                      <TableCell>Ngày trả phòng</TableCell>
                      <TableCell>Giá mỗi đêm</TableCell>
                      <TableCell>Số đêm</TableCell>
                      <TableCell>Số người</TableCell>
                      <TableCell>Thành tiền</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ttdpData.map((room, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: "#f8f9fa",
                            transition: "background-color 0.2s"
                          }
                        }}
                      >
                        <TableCell>{room.loaiPhong.tenLoaiPhong}</TableCell>
                        <TableCell>{formatDateTime(room.ngayNhanPhong)}</TableCell>
                        <TableCell>{formatDateTime(room.ngayTraPhong)}</TableCell>
                        <TableCell>{room.loaiPhong.donGia.toLocaleString()}</TableCell>
                        <TableCell>{calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong)}</TableCell>
                        <TableCell>{room.soNguoi}</TableCell>
                        <TableCell>
                          {(calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong) * room.loaiPhong.donGia).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditRoom(room)}
                            sx={{ '&:hover': { bgcolor: "rgba(25, 118, 210, 0.1)" } }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveRoom(room)}
                            sx={{ '&:hover': { bgcolor: "rgba(211, 47, 47, 0.1)" } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2, borderColor: "#e0e0e0" }} />

              <Typography 
                variant="h6" 
                sx={{ textAlign: "right", mb: 3, color: "#1e3c72" }}
              >
                <strong>Tổng tiền:</strong> {calculateTotalAmount().toLocaleString()} VND
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConfirmBooking}
                sx={{
                  borderRadius: 1,
                  py: 1.5,
                  bgcolor: "#1976d2",
                  '&:hover': { bgcolor: "#115293" },
                  textTransform: "none",
                  fontWeight: "bold"
                }}
              >
                Xác nhận đặt phòng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* <ChinhSuaPhongDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        thongTinDatPhong={roomToEdit}
        onSave={handleSaveRoom}
      /> */}
    </Container>
  );
};

export default TaoDatPhong;
