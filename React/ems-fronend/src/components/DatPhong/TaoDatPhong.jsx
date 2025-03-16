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
  getThongTinDatPhong, updateThongTinDatPhong,deleteThongTinDatPhong
} from "../../services/TTDP";

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
  // Lấy dữ liệu từ location.state (nếu có)
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

  // State cho danh sách phòng đã chọn
  const [selectData, setSelectData] = useState(initialSelectData || []);

  // State lưu thông tin đặt phòng được lấy từ API theo id datPhong
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
  // roomToEdit: nếu null => chế độ thêm mới, nếu có giá trị => chỉnh sửa
  const [roomToEdit, setRoomToEdit] = useState(null);

  // BookingData (giả sử bạn sử dụng giá trị này cho đặt phòng)
  const [bookingData, setBookingData] = useState({
    ngayNhanPhong: ngayNhanPhong ? parseToDayjs(ngayNhanPhong) : dayjs(),
    ngayTraPhong: ngayTraPhong ? parseToDayjs(ngayTraPhong) : dayjs().add(1, "day"),
    soNguoi: soNguoi || 1,
    soPhong: soPhong || 1,
  });

  // Hàm fetch lấy thông tin đặt phòng theo id của datPhong
  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      setTtdpData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      alert("Lỗi khi lấy thông tin đặt phòng");
    }
  };

  // Nếu có datPhong từ location.state, gọi fetch để cập nhật thông tin mới
  useEffect(() => {
    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    }
  }, [datPhong]);

  // Khi nhấn nút Edit, mở dialog và truyền phòng cần sửa
  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setShowDialog(true);
  };

  // Nút "Thêm phòng" mở dialog ở chế độ thêm mới (không truyền dữ liệu)
  const openDialog = () => {
    setRoomToEdit(null);
    setShowDialog(true);
  };

  // Khi nhấn lưu trong dialog: nếu chỉnh sửa thì cập nhật, nếu thêm mới thì thêm vào selectData
  const handleSaveRoom = (updatedRoom) => {
    if (roomToEdit) {
      // Edit mode: cập nhật dựa trên selectedRooms.id
      const updatedSelectData = selectData.map((item) =>
        item.selectedRooms.id === updatedRoom.loaiPhongResponse.id
          ? {
              ...item,
              selectedRooms: updatedRoom.loaiPhongResponse,
            }
          : item
      );
      setSelectData(updatedSelectData);
    } else {
      // Add mode: "bọc" dữ liệu trả về theo cấu trúc mong muốn
      const newData = {
        selectedRooms: updatedRoom.loaiPhongResponse,
        ngayNhanPhong: bookingData.ngayNhanPhong.toISOString(),
        ngayTraPhong: bookingData.ngayTraPhong.toISOString(),
        soNguoi: bookingData.soNguoi,
        soPhong: bookingData.soPhong,
      };
      setSelectData([...selectData, newData]);
    }
    setShowDialog(false);
    setRoomToEdit(null);
  };

  const handleRemoveRoom = async (room) => {
    try {
      await huyTTDP(room.maThongTinDatPhong);
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
        soNguoi: thongTinDatPhong.reduce((total, room) => total + room.soNguoi,0),
        soPhong: thongTinDatPhong.length,
        ngayDat: datPhong ? datPhong.ngayDat : new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chờ xác nhận",
      };
      datPhongResponse = await CapNhatDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }
      const thongTinDatPhongRequestList = [];
      thongTinDatPhong.forEach((room) => {
        for (let i = 0; i < bookingData.soPhong; i++) {
          console.log("room 123:", room);
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
        console.log("thongTinDatPhong:", thongTinDatPhong);
        const response = await updateThongTinDatPhong(thongTinDatPhong);
        if (!response || !response.data) {
          throw new Error("Không thể tạo thông tin đặt phòng.");
        }
      }
      alert("Đặt phòng thành công!");
      navigate("/quan-ly-dat-phong");
    } catch (error) {
          console.error("Lỗi khi đặt phòng:", error);
          // Rollback: nếu có thông tin đặt phòng đã được tạo, xóa chúng
          if (thongTinDatPhongResponseList.length > 0) {
            for (const ttdp of thongTinDatPhongResponseList) {
              try {
                await deleteThongTinDatPhong(ttdp.id);
              } catch (err) {
                console.error("Lỗi khi rollback thongTinDatPhong:", err);
              }
            }
          }
          // Rollback: nếu đặt phòng đã được tạo, xóa nó
          if (datPhongResponse && datPhongResponse.data) {
            try {
              await XoaDatPhong(datPhongResponse.data.id);
            } catch (err) {
              console.error("Lỗi khi rollback datPhong:", err);
            }
          }
          // Rollback: nếu khách hàng đã được tạo, xóa nó
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
      const days = calculateBookingDays(
        room.ngayNhanPhong,
        room.ngayTraPhong
      );
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
          {/* Thông Tin Người Đặt */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông Tin Người Đặt
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    id="ho"
                    value={formData.ho}
                    onChange={(e) =>
                      setFormData({ ...formData, ho: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, ten: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, sdt: e.target.value })
                    }
                    error={!!formErrors.sdt}
                    helperText={formErrors.sdt}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Chi Tiết Phòng Đã Chọn */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chi Tiết Phòng Đã Chọn ({ttdpData.length})
              </Typography>
              <Button variant="outlined" onClick={openDialog}>
                Thêm phòng
              </Button>
              <TableContainer sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
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
                      <TableRow key={index}>
                        <TableCell>
                          {room.loaiPhong.tenLoaiPhong}
                        </TableCell>
                        <TableCell>{formatDateTime(room.ngayNhanPhong)}</TableCell>
                        <TableCell>{formatDateTime(room.ngayTraPhong)}</TableCell>
                        <TableCell>
                          {room.loaiPhong.donGia.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {calculateBookingDays(
                            room.ngayNhanPhong,
                            room.ngayTraPhong
                          )}
                        </TableCell>
                        <TableCell>{room.soNguoi}</TableCell>
                        <TableCell>
                          {(
                            calculateBookingDays(
                              room.ngayNhanPhong,
                              room.ngayTraPhong
                            ) * room.loaiPhong.donGia
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditRoom(room)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveRoom(room)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
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
      {/* Dialog Chỉnh Sửa/Thêm Phòng */}
      <ChinhSuaPhongDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        roomToEdit={roomToEdit}
        onSave={handleSaveRoom}
      />
    </Container>
  );
};

export default TaoDatPhong;
