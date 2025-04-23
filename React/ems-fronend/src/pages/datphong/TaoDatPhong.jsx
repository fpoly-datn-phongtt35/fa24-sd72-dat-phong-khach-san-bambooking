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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
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
  addThongTinDatPhong,
} from "../../services/TTDP";
import {
  getLPKDRL,
  getLoaiPhongKhaDungResponse,
} from "../../services/LoaiPhongService";

const TaoDatPhong = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { datPhong, khachHang, thongTinDatPhong } = location.state || {};
  console.log("datPhong", datPhong);
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
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchForm, setSearchForm] = useState({
    ngayNhanPhong: dayjs().format("YYYY-MM-DD"),
    ngayTraPhong: dayjs().add(1, "day").format("YYYY-MM-DD"),
    soNguoi: 1,
    soPhong: 1,
    idLoaiPhong: null,
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]); // Thêm state cho dropdown
  const [searchErrors, setSearchErrors] = useState({});

  // Lấy danh sách loại phòng khả dụng cho dropdown khi mở dialog
  useEffect(() => {
    if (openSearchDialog) {
      const fetchLoaiPhongs = async () => {
        try {
          const n = dayjs(searchForm.ngayNhanPhong).format("YYYY-MM-DD");
          const t = dayjs(searchForm.ngayTraPhong).format("YYYY-MM-DD");
          const response = await getLoaiPhongKhaDungResponse(
            n,
            t
          );
          setLoaiPhongs(response.data);
          console.log("LoaiPhongs response:", response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách loại phòng:", error);
        }
      };
      fetchLoaiPhongs();
    }
  }, [
    openSearchDialog,
    searchForm.ngayNhanPhong,
    searchForm.ngayTraPhong,
    searchForm.soNguoi,
    searchForm.soPhong,
  ]);

  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      console.log("response fetchThongTinDatPhongById", response.data);
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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa phòng này không?"
    );
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
    console.log("khachHang", khachHang);
    try {
      const khachHangRequest = {
        id: khachHang.id,
        ho: formData.ho,
        ten: formData.ten,
        email: formData.email,
        sdt: formData.sdt,
        trangThai: false,
      };
      khachHangResponse = await SuaKhachHangDatPhong(khachHangRequest);
      console.log("khachHangResponse", khachHangResponse);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }
      console.log(datPhong)
      const datPhongRequest = {
        id: datPhong.id,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong.maDatPhong,
        soNguoi: datPhong.soNguoi,
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong ? datPhong.ngayDat : new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Đã xác nhận",
      };
      console.log("datPhongRequest", datPhongRequest);
      datPhongResponse = await CapNhatDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }
      console.log("datPhongResponse", datPhongResponse.data);
      for (const thongTinDatPhong of TTDP) {
        console.log("id thongTinDatPhong", thongTinDatPhong.id);
        alert(thongTinDatPhong.id);
        const updatedThongTinDatPhong = {
          id: thongTinDatPhong.id,
          datPhong: thongTinDatPhong.datPhong,
          idLoaiPhong: thongTinDatPhong.loaiPhong.id,
          maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong,
          ngayNhanPhong: thongTinDatPhong.ngayNhanPhong,
          ngayTraPhong: thongTinDatPhong.ngayTraPhong,
          soNguoi: thongTinDatPhong.soNguoi,
          giaDat: thongTinDatPhong.giaDat,
          ghiChu: thongTinDatPhong.ghiChu,
          trangThai: "Chưa xếp",
        };
        console.log(updatedThongTinDatPhong);
        const response = await updateThongTinDatPhong(updatedThongTinDatPhong);
        if (!response || !response.data) {
          alert("Lỗi khi cập nhật thông tin đặt phòng:", error);
          throw new Error(
            `Không thể cập nhật thông tin đặt phòng: ${thongTinDatPhong.maThongTinDatPhong}`
          );
        }
      }
      alert("Đặt phòng thành công!");
      navigate("/thong-tin-dat-phong-search");
    } catch (error) {
       alert("Lỗi khi đặt phòng:", error);
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
      alert(`Đã xảy ra lỗi trong quá trình đặt phòng: ${error.message}`);
    }
  };

  const handleSearchRooms = async () => {
    const errors = {};
    if (!searchForm.ngayNhanPhong)
      errors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng";
    if (!searchForm.ngayTraPhong)
      errors.ngayTraPhong = "Vui lòng chọn ngày trả phòng";
    if (
      dayjs(searchForm.ngayTraPhong).isBefore(dayjs(searchForm.ngayNhanPhong))
    ) {
      errors.ngayTraPhong = "Ngày trả phòng phải sau ngày nhận phòng";
    }
    if (searchForm.soNguoi < 1) errors.soNguoi = "Số người phải lớn hơn 0";
    if (searchForm.soPhong < 1) errors.soPhong = "Số phòng phải lớn hơn 0";

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const n = dayjs(searchForm.ngayNhanPhong).format("YYYY-MM-DD");
      const t = dayjs(searchForm.ngayTraPhong).format("YYYY-MM-DD");
      const response = await getLPKDRL(
        n,
        t,
        searchForm.soNguoi,
        searchForm.soPhong,
        searchForm.idLoaiPhong
      );
      console.log("Search rooms request:", {
        n,
        t,
        soNguoi: searchForm.soNguoi,
        soPhong: searchForm.soPhong,
        idLoaiPhong: searchForm.idLoaiPhong,
      });
      console.log("Search rooms response:", response.data);
      if (response.data.length === 0) {
        alert(
          "Không có phòng khả dụng cho yêu cầu của bạn. Vui lòng thử lại với ngày hoặc số lượng khác."
        );
      }
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm phòng khả dụng:", error);
      alert("Có lỗi xảy ra khi tìm phòng. Vui lòng thử lại.");
    }
  };

  const handleAddRoom = async (room) => {
    if (room.soPhongKhaDung < searchForm.soPhong) {
      alert("Số phòng khả dụng không đủ!");
      return;
    }

    try {
      let currentDatPhong = datPhong;
      let currentKhachHang = khachHang;

      if (!currentKhachHang) {
        throw new Error("Không tồn tại khách hàng");
      }

      if (!currentDatPhong) {
          throw new Error("Không tồn tại đặt phòng");
      }

      const addedRooms = [];
      for (let i = 0; i < searchForm.soPhong; i++) {
        const newRoom = {
          datPhong: datPhong,
          idLoaiPhong: room.id,
          maThongTinDatPhong: `TDP-${Date.now()}-${room.id}-${i}`,
          ngayNhanPhong: searchForm.ngayNhanPhong,
          ngayTraPhong: searchForm.ngayTraPhong,
          soNguoi: searchForm.soNguoi,
          giaDat: room.donGia,
          trangThai: "Đang đặt phòng",
        };
        const response = await addThongTinDatPhong(newRoom);
        console.log("Added room response:", response.data);
        if (!response || !response.data) {
          throw new Error(
            `Không thể thêm thông tin đặt phòng: ${newRoom.maThongTinDatPhong}`
          );
        }
        addedRooms.push(response.data);
      }

      const updatedResponse = await getThongTinDatPhong(currentDatPhong.id);
      console.log("Updated response:", updatedResponse.data);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);

      setOpenSearchDialog(false);
      setAvailableRooms([]);
      setSearchForm({
        ngayNhanPhong: dayjs().format("YYYY-MM-DD"),
        ngayTraPhong: dayjs().add(1, "day").format("YYYY-MM-DD"),
        soNguoi: 1,
        soPhong: 1,
        idLoaiPhong: null,
      });
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
      alert(`Có lỗi xảy ra khi thêm phòng: ${error.message}`);
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
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email không hợp lệ";
    if (!formData.sdt.trim()) errors.sdt = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10}$/.test(formData.sdt))
      errors.sdt = "Số điện thoại phải có 10 chữ số";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({});
    setShowError(false);
  };

  const handleSearchInputChange = (field, value) => {
    setSearchForm({ ...searchForm, [field]: value });
    setSearchErrors({});
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Chi Tiết Phòng Đã Chọn (
                  {ttdpData.reduce((total, room) => total + room.soPhong, 0)})
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenSearchDialog(true)}
                >
                  Thêm Phòng
                </Button>
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
                        <TableCell>
                          {formatDateTime(room.ngayNhanPhong)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(room.ngayTraPhong)}
                        </TableCell>
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
                        <TableCell>{room.soPhong}</TableCell>
                        <TableCell>
                          {(
                            calculateBookingDays(
                              room.ngayNhanPhong,
                              room.ngayTraPhong
                            ) *
                            room.loaiPhong.donGia *
                            room.soPhong
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="warning"
                            onClick={() => handleRemoveRoom(room)}
                            title="Hủy phòng này"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAllRooms(room)}
                            title="Hủy tất cả phòng giống nhau"
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
              <Typography variant="h6" sx={{ textAlign: "right", mb: 3 }}>
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

      {/* Dialog Tìm Phòng Khả Dụng */}
      <Dialog
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Tìm Loại Phòng Khả Dụng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày Nhận Phòng"
                type="date"
                value={searchForm.ngayNhanPhong}
                onChange={(e) =>
                  handleSearchInputChange("ngayNhanPhong", e.target.value)
                }
                error={!!searchErrors.ngayNhanPhong}
                helperText={searchErrors.ngayNhanPhong}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày Trả Phòng"
                type="date"
                value={searchForm.ngayTraPhong}
                onChange={(e) =>
                  handleSearchInputChange("ngayTraPhong", e.target.value)
                }
                error={!!searchErrors.ngayTraPhong}
                helperText={searchErrors.ngayTraPhong}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!searchErrors.soNguoi}>
                <InputLabel>Số Người</InputLabel>
                <Select
                  value={searchForm.soNguoi}
                  onChange={(e) =>
                    handleSearchInputChange("soNguoi", e.target.value)
                  }
                  label="Số Người"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
                {searchErrors.soNguoi && (
                  <Typography color="error">{searchErrors.soNguoi}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!searchErrors.soPhong}>
                <InputLabel>Số Phòng</InputLabel>
                <Select
                  value={searchForm.soPhong}
                  onChange={(e) =>
                    handleSearchInputChange("soPhong", e.target.value)
                  }
                  label="Số Phòng"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
                {searchErrors.soPhong && (
                  <Typography color="error">{searchErrors.soPhong}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại Phòng</InputLabel>
                <Select
                  value={searchForm.idLoaiPhong || ""}
                  onChange={(e) =>
                    handleSearchInputChange(
                      "idLoaiPhong",
                      e.target.value
                    )
                  }
                  label="Loại Phòng"
                >
                  <MenuItem value=''>Tất cả</MenuItem>
                  {loaiPhongs.map((lp) => (
                    <MenuItem key={lp.id} value={lp.id}>
                      {lp.tenLoaiPhong}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearchRooms}
              >
                Tìm Phòng
              </Button>
            </Grid>
          </Grid>

          {availableRooms.length > 0 && (
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại Phòng</TableCell>
                    <TableCell>Giá Mỗi Đêm</TableCell>
                    <TableCell>Số Phòng Khả Dụng</TableCell>
                    <TableCell>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.tenLoaiPhong}</TableCell>
                      <TableCell>{room.donGia.toLocaleString()}</TableCell>
                      <TableCell>{room.soPhongKhaDung}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleAddRoom(room)}
                          disabled={room.soPhongKhaDung < searchForm.soPhong}
                        >
                          Thêm
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaoDatPhong;
