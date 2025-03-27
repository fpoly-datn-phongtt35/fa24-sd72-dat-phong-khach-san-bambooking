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
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import {
  XoaDatPhong,
  XoaKhachHangDatPhong,
  CapNhatDatPhong,
  SuaKhachHangDatPhong,
} from "../../services/DatPhong";
import {
  huyTTDP,
  getThongTinDatPhong,
  updateThongTinDatPhong,
} from "../../services/TTDP";

const TaoDatPhong = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { datPhong, khachHang, thongTinDatPhong } = location.state || {};
  const [ttdpData, setTtdpData] = useState([]);
  const [TTDP, setTTDP] = useState([]);
  const [formData, setFormData] = useState({
    ho: "",
    ten: "",
    email: "",
    sdt: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomCount, setNewRoomCount] = useState("");

  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      const numberedRooms = groupAndNumberRooms(response.data);
      console.log("numberedRooms", numberedRooms);
      setTtdpData(numberedRooms);
      setTTDP(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      alert("Lỗi khi lấy thông tin đặt phòng");
    }
  };

  useEffect(() => {
    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    } else if (thongTinDatPhong) {
      const numberedRooms = groupAndNumberRooms(thongTinDatPhong);
      setTtdpData(numberedRooms);
      setTTDP(thongTinDatPhong);
    }
  }, [datPhong, thongTinDatPhong]);

  const handleChoseRoom = (room) => {
    setSelectedRoom(room);
    setNewRoomCount(room.soPhong);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setNewRoomCount("");
  };

  const handleUpdateRoomCount = async () => {
    if (!selectedRoom) return;

    const newCount = parseInt(newRoomCount, 10);
    const oldCount = selectedRoom.soPhong;

    if (isNaN(newCount) || newCount < 0 || newCount > oldCount) {
      alert(`Số phòng mới phải từ 0 đến ${oldCount}`);
      return;
    }

    if (newCount === oldCount) {
      handleCloseDialog();
      return;
    }

    try {
      const matchingRooms = TTDP.filter(
        (item) =>
          item.loaiPhong.id === selectedRoom.loaiPhong.id &&
          item.ngayNhanPhong === selectedRoom.ngayNhanPhong &&
          item.ngayTraPhong === selectedRoom.ngayTraPhong &&
          item.soNguoi === selectedRoom.soNguoi
      );

      const roomsToRemove = oldCount - newCount;
      for (let i = 0; i < roomsToRemove; i++) {
        const roomToRemove = matchingRooms[i];
        console.log("Hủy phòng:", roomToRemove);
        await huyTTDP(roomToRemove.maThongTinDatPhong);
      }

      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi cập nhật số phòng:", error);
      alert("Có lỗi xảy ra khi cập nhật số phòng. Vui lòng thử lại.");
    }
  };

  const handleRemoveRoom = async (room) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này không?");
    if (!confirmDelete) return;

    try {
      await huyTTDP(room.maThongTinDatPhong);
      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      alert("Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.");
    }
  };

  const handleRemoveAllRooms = async (room) => {
    const confirmDeleteAll = window.confirm(
      "Bạn có chắc chắn muốn hủy tất cả các phòng giống nhau không?"
    );
    if (!confirmDeleteAll) return;

    try {
      const matchingRooms = TTDP.filter(
        (item) =>
          item.loaiPhong.id === room.loaiPhong.id &&
          item.ngayNhanPhong === room.ngayNhanPhong &&
          item.ngayTraPhong === room.ngayTraPhong &&
          item.soNguoi === room.soNguoi
      );
      for (const matchingRoom of matchingRooms) {
        console.log("Hủy phòng:", matchingRoom);
        await huyTTDP(matchingRoom.maThongTinDatPhong);
      }
      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
    } catch (error) {
      console.error("Lỗi khi hủy tất cả phòng:", error);
      alert("Có lỗi xảy ra khi hủy tất cả phòng. Vui lòng thử lại.");
    }
  };

  const handleConfirmBooking = async () => {
    if (ttdpData.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng trước khi xác nhận đặt phòng.");
      navigate("/dat-phong");
      return;
    }
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
        soNguoi: ttdpData.reduce((total, room) => total + room.soNguoi * room.soPhong, 0),
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
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
        console.log("room", room);
        for (let i = 0; i < room.soPhong; i++) {
          console.log(i);
          console.log(room.soPhong);
          thongTinDatPhongRequestList.push({
            id: room.id + i,
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
      return total + room.loaiPhong.donGia * days * room.soPhong;
    }, 0);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ho.trim()) errors.ho = "Vui lòng nhập họ";
    if (!formData.ten.trim()) errors.ten = "Vui lòng nhập tên";
    if (!formData.email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email không hợp lệ";
    if (!formData.sdt.trim()) errors.sdt = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10}$/.test(formData.sdt)) errors.sdt = "Số điện thoại phải có 10 chữ số";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Xóa lỗi và ẩn thông báo khi người dùng nhập lại
    setFormErrors({});
    setShowError(false);
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

  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room) => {
      const key = `${room.loaiPhong.id}-${room.ngayNhanPhong}-${room.ngayTraPhong}-${room.soNguoi}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(room);
    });

    const result = [];
    Object.values(grouped).forEach((group) => {
      const representativeRoom = { ...group[0] };
      representativeRoom.soPhong = group.length;
      result.push(representativeRoom);
    });

    return result;
  };

  return (
    <Container sx={{ minWidth: "1300px", py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {showError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            <AlertTitle>Lỗi</AlertTitle>
            Vui lòng điền đầy đủ và đúng thông tin trước khi xác nhận đặt phòng.
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông Tin Người Đặt
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    value={formData.ho}
                    onChange={(e) => handleInputChange("ho", e.target.value)}
                    error={!!formErrors.ho}
                    helperText={formErrors.ho}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    value={formData.ten}
                    onChange={(e) => handleInputChange("ten", e.target.value)}
                    error={!!formErrors.ten}
                    helperText={formErrors.ten}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    value={formData.sdt}
                    onChange={(e) => handleInputChange("sdt", e.target.value)}
                    error={!!formErrors.sdt}
                    helperText={formErrors.sdt}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">
                  Chi Tiết Phòng Đã Chọn ({ttdpData.reduce((total, room) => total + room.soPhong, 0)})
                </Typography>
              </Box>
              <TableContainer sx={{ mb: 2, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại phòng</TableCell>
                      <TableCell>Ngày nhận phòng</TableCell>
                      <TableCell>Ngày trả phòng</TableCell>
                      <TableCell>Giá mỗi đêm</TableCell>
                      <TableCell>Số đêm</TableCell>
                      <TableCell>Số người</TableCell>
                      <TableCell>Số phòng</TableCell>
                      <TableCell>Thành tiền</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ttdpData.map((room, index) => (
                      <TableRow key={index}>
                        <TableCell>{room.loaiPhong.tenLoaiPhong}</TableCell>
                        <TableCell>{formatDateTime(room.ngayNhanPhong)}</TableCell>
                        <TableCell>{formatDateTime(room.ngayTraPhong)}</TableCell>
                        <TableCell>{room.loaiPhong.donGia.toLocaleString()}</TableCell>
                        <TableCell>{calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong)}</TableCell>
                        <TableCell>{room.soNguoi}</TableCell>
                        <TableCell>{room.soPhong}</TableCell>
                        <TableCell>
                          {(calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong) * room.loaiPhong.donGia * room.soPhong).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleChoseRoom(room)} title="Chọn số phòng">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="warning" onClick={() => handleRemoveRoom(room)} title="Hủy phòng này">
                            <RemoveIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleRemoveAllRooms(room)} title="Hủy tất cả phòng giống nhau">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ textAlign: "right", mb: 3 }}>
                <strong>Tổng tiền:</strong> {calculateTotalAmount().toLocaleString()} VND
              </Typography>
              <Button variant="contained" color="primary" fullWidth onClick={handleConfirmBooking}>
                Xác nhận đặt phòng
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog chọn số phòng */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{ "& .MuiDialog-paper": { width: "500px", maxWidth: "none" } }}
        >
          <DialogTitle>Chọn số phòng</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Số phòng"
              type="number"
              fullWidth
              value={newRoomCount}
              onChange={(e) => setNewRoomCount(e.target.value)}
              inputProps={{ min: 0, max: selectedRoom?.soPhong }}
            />
            <Typography variant="caption">
              Số phòng tối đa: {selectedRoom?.soPhong}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleUpdateRoomCount} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default TaoDatPhong;