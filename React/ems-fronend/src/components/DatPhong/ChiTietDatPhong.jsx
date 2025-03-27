import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { findTTDPByMaDatPhong } from "../../services/TTDP";
import { findDatPhongByMaDatPhong, CapNhatDatPhong } from "../../services/DatPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import XepPhong from "../XepPhong/XepPhong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NotesIcon from "@mui/icons-material/Notes";
import HotelIcon from "@mui/icons-material/Hotel";
import { ThemPhuThu } from "../../services/PhuThuService";

const ChiTietDatPhong = () => {
  const [datPhong, setDatPhong] = useState();
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [phongData, setPhongData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const location = useLocation();
  const { maDatPhong } = location.state || {};
  const navigate = useNavigate();

  const getDetailDatPhong = (maDatPhong) => {
    findDatPhongByMaDatPhong(maDatPhong)
      .then((response) => setDatPhong(response.data))
      .catch((error) => {
        console.error(error);
        showSnackbar("Không thể tải thông tin đặt phòng", "error");
      });

    findTTDPByMaDatPhong(maDatPhong)
      .then((response) => {
        if (response && response.data) {
          setThongTinDatPhong(response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        showSnackbar("Không thể tải chi tiết đặt phòng", "error");
      });
  };

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setPhongData((prevData) => ({
          ...prevData,
          [maThongTinDatPhong]: response.data,
        }));
      })
      .catch((error) => console.error(error));
  };

  const openXepPhongModal = (ttdp) => {
    setSelectedTTDPs([ttdp]);
    setShowXepPhongModal(true);
  };

  const closeXepPhongModal = () => {
    setShowXepPhongModal(false);
    getDetailDatPhong(maDatPhong);
  };

  const updateDatPhong = () => {
    CapNhatDatPhong(datPhong)
      .then(() => showSnackbar("Lưu thành công", "success"))
      .catch((error) => {
        console.error(error);
        showSnackbar("Không thể cập nhật đặt phòng", "error");
      });
  };

  useEffect(() => {
    if (thongTinDatPhong.length > 0) {
      thongTinDatPhong.forEach((ttdp) => fetchPhongDaXep(ttdp.maThongTinDatPhong));
    }
  }, [thongTinDatPhong]);

  useEffect(() => {
    if (maDatPhong) {
      getDetailDatPhong(maDatPhong);
    }
  }, [maDatPhong]);

  const calculateTotalGuests = () =>
    thongTinDatPhong.reduce((total, ttdp) => total + ttdp.soNguoi, 0);

  const calculateTotalPrice = (donGia, start, end) => {
    const days = Math.max(
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)),
      1
    );
    return donGia * days;
  };

  const handleCheckboxChange = (ttdp) => {
    setSelectedTTDPs((prevSelected) =>
      prevSelected.includes(ttdp)
        ? prevSelected.filter((item) => item !== ttdp)
        : [...prevSelected, ttdp]
    );
  };

  const handleTTDPClick = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleCheckin = async (thongTinDatPhong) => {
    try {
      let xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
      if (!xepPhong) {
        showSnackbar("Không tìm thấy phòng đã xếp.", "error");
        return;
      }

      const loaiPhong = xepPhong.phong.loaiPhong;
      const xepPhongRequest = {
        id: xepPhong.id,
        phong: xepPhong.phong,
        thongTinDatPhong: xepPhong.thongTinDatPhong,
        ngayNhanPhong: new Date(new Date(thongTinDatPhong.ngayNhanPhong).setHours(14, 0, 0, 0)),
        ngayTraPhong: new Date(new Date(thongTinDatPhong.ngayTraPhong).setHours(12, 0, 0, 0)),
        trangThai: xepPhong.trangThai,
      };

      await checkIn(xepPhongRequest);
      showSnackbar("Check-in thành công!");

      xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
      const ngayNhanPhongXepPhong = new Date(xepPhong.ngayNhanPhong);
      const gio14Chieu = new Date(ngayNhanPhongXepPhong).setHours(14, 0, 0, 0);

      if (ngayNhanPhongXepPhong < gio14Chieu) {
        const phuThuRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: "Phụ thu do nhận phòng sớm",
          tienPhuThu: 50000,
          soLuong: 1,
          trangThai: true,
        };
        await ThemPhuThu(phuThuRequest);
        showSnackbar("Phụ thu do nhận phòng sớm đã được thêm.");
      }

      if (thongTinDatPhong.soNguoi > loaiPhong.soKhachToiDa) {
        const soNguoiVuot = thongTinDatPhong.soNguoi - loaiPhong.soKhachToiDa;
        const tienPhuThuThem = soNguoiVuot * loaiPhong.donGiaPhuThu;
        const phuThuThemRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người)`,
          tienPhuThu: tienPhuThuThem,
          soLuong: 1,
          trangThai: true,
        };
        await ThemPhuThu(phuThuThemRequest);
        showSnackbar(`Phụ thu do vượt số khách tối đa (${soNguoiVuot} người) đã được thêm.`);
      }
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi khi thực hiện check-in.";
      if (error.response) {
        const { status, data } = error.response;
        errorMessage = status === 400
          ? (data.message || "Dữ liệu không hợp lệ.")
          : status === 404
          ? "Không tìm thấy thông tin cần thiết."
          : status === 500
          ? "Lỗi server."
          : data.message || `Lỗi không xác định (status: ${status}).`;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server.";
      }
      showSnackbar(errorMessage, "error");
    }
    getDetailDatPhong(maDatPhong);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Dang o":
        return "success";
      case "Da huy":
        return "error";
      case "Cho nhan phong":
        return "warning";
      case "Dang dat phong":
        return "info"; // Thêm màu cho trạng thái "Đang đặt phòng"
      default:
        return "default";
    }
  };

  // Kiểm tra nếu có bất kỳ thongTinDatPhong nào đang ở trạng thái "Dang dat phong"
  const isDangDatPhong = thongTinDatPhong.some((ttdp) => ttdp.trangThai === "Dang dat phong");

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AssignmentIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
          Chi Tiết Đặt Phòng
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Thông tin tổng quan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">Thông tin khách hàng</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>Họ tên:</Typography>
                <Typography>{datPhong?.khachHang?.ho} {datPhong?.khachHang?.ten || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>{datPhong?.khachHang?.email || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>{datPhong?.khachHang?.sdt || "N/A"}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">Thông tin đặt phòng</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>Ngày đặt:</Typography>
                <Typography>{datPhong?.ngayDat ? formatDate(datPhong.ngayDat) : "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>Số phòng:</Typography>
                <Chip
                  size="small"
                  label={thongTinDatPhong.length}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>Số người:</Typography>
                <Chip
                  icon={<PersonIcon />}
                  size="small"
                  label={calculateTotalGuests()}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>Tổng tiền:</Typography>
                <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
                  {datPhong?.tongTien?.toLocaleString() || "0"} VNĐ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">Ghi chú</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Nhập ghi chú ở đây..."
                value={datPhong?.ghiChu || ""}
                onChange={(e) => setDatPhong({ ...datPhong, ghiChu: e.target.value })}
                variant="outlined"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng thông tin chi tiết */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <HotelIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">Danh sách phòng đặt</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedTTDPs.length > 0 && selectedTTDPs.length < thongTinDatPhong.length}
                  checked={thongTinDatPhong.length > 0 && selectedTTDPs.length === thongTinDatPhong.length}
                  onChange={() => {
                    if (selectedTTDPs.length === thongTinDatPhong.length) {
                      setSelectedTTDPs([]);
                    } else {
                      setSelectedTTDPs([...thongTinDatPhong]);
                    }
                  }}
                  disabled={isDangDatPhong} // Vô hiệu hóa checkbox nếu có trạng thái "Đang đặt phòng"
                />
              </TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Mã TTDP</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Khách hàng</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Số người</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Phòng</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Ngày nhận</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Ngày trả</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Tiền phòng</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Trạng thái</Typography></TableCell>
              <TableCell><Typography sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Hành động</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {thongTinDatPhong.length > 0 ? (
              thongTinDatPhong.map((ttdp) => (
                <TableRow
                  key={ttdp.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTTDPs.includes(ttdp)}
                      onChange={() => handleCheckboxChange(ttdp)}
                      disabled={ttdp.trangThai === "Dang dat phong"} // Vô hiệu hóa checkbox riêng nếu trạng thái là "Đang đặt phòng"
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => handleTTDPClick(ttdp.maThongTinDatPhong)}
                    sx={{
                      color: "primary.main",
                      cursor: "pointer",
                      fontWeight: "medium",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {ttdp.maThongTinDatPhong}
                  </TableCell>
                  <TableCell>{ttdp?.datPhong?.khachHang?.ho} {ttdp?.datPhong?.khachHang?.ten}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={ttdp.soNguoi}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {phongData[ttdp.maThongTinDatPhong]?.phong?.tenPhong ||
                      <Chip
                        size="small"
                        label={ttdp.loaiPhong.tenLoaiPhong}
                        color="info"
                        variant="outlined"
                      />
                    }
                  </TableCell>
                  <TableCell>{formatDate(ttdp.ngayNhanPhong)}</TableCell>
                  <TableCell>{formatDate(ttdp.ngayTraPhong)}</TableCell>
                  <TableCell sx={{ fontWeight: "medium", color: "success.main" }}>
                    {calculateTotalPrice(ttdp.giaDat, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()} VNĐ
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ttdp.trangThai}
                      color={getStatusColor(ttdp.trangThai)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {!phongData[ttdp.maThongTinDatPhong]?.phong?.tenPhong && (
                        <Tooltip title="Xếp phòng">
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => openXepPhongModal(ttdp)}
                            startIcon={<MeetingRoomIcon />}
                            disabled={ttdp.trangThai === "Đang đặt phòng"} // Vô hiệu hóa nút Xếp phòng
                          >
                            Xếp phòng
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip title="Check-in">
                        <IconButton
                          color="success"
                          onClick={() => handleCheckin(ttdp)}
                          size="small"
                          disabled={
                            !phongData[ttdp.maThongTinDatPhong]?.phong?.tenPhong ||
                            ttdp.trangThai === "Đang đặt phòng" // Vô hiệu hóa nút Check-in
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Nút hành động */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={updateDatPhong}
          startIcon={<AssignmentIcon />}
        >
          Lưu thông tin
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={() => selectedTTDPs.forEach((ttdp) => handleCheckin(ttdp))}
          disabled={selectedTTDPs.length === 0 || isDangDatPhong}
        >
          Check-in {selectedTTDPs.length > 0 ? `(${selectedTTDPs.length})` : ""}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<MeetingRoomIcon />}
          onClick={() => setShowXepPhongModal(true)}
          disabled={selectedTTDPs.length === 0 || isDangDatPhong}
        >
          Xếp phòng {selectedTTDPs.length > 0 ? `(${selectedTTDPs.length})` : ""}
        </Button>
      </Box>

      <XepPhong
        show={showXepPhongModal}
        handleClose={closeXepPhongModal}
        selectedTTDPs={selectedTTDPs}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChiTietDatPhong;