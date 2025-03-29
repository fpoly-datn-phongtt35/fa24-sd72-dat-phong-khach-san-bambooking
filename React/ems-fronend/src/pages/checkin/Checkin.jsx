import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Stack,
  Input,
  Grid,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { huyTTDP } from "../../services/TTDP";
import { findDatPhongToCheckin } from "../../services/DatPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";
import XepPhong from "../../components/XepPhong/XepPhong"; // Thêm import modal XepPhong

const Checkin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(null);
  const [ngayTra, setNgayTra] = useState(null);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = "";
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false); // Thêm state cho modal

  const searchDatPhong = (key, currentPage) => {
    const pageable = { page: currentPage, size: pageSize };
    findDatPhongToCheckin(pageable, key)
      .then((res) => {
        console.log(res.data);
        setDatPhong(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setDatPhong([]);
      });
  };

  useEffect(() => {
    searchDatPhong(key, page); // Gọi lần đầu khi component mount
    const intervalId = setInterval(() => {
      searchDatPhong(key, page);
    }, 3000); // Làm mới mỗi 3 giây
    return () => clearInterval(intervalId);
  }, [key, page]); // Loại bỏ ngayNhan, ngayTra khỏi dependency nếu không dùng

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // Chuyển từ 1-based sang 0-based
    searchDatPhong(key, newPage - 1);
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  const handleViewDetailsTTDPTTDP = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const handleHuyTTDP = (maThongTinDatPhong) => {
    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy thông tin đặt phòng ${maThongTinDatPhong} không?`
    );
    if (confirmCancel) {
      huyTTDP(maThongTinDatPhong)
        .then(() => {
          searchDatPhong(key, page); // Cập nhật lại danh sách
          console.log(`Đã hủy TTDP: ${maThongTinDatPhong}`);
        })
        .catch((err) => {
          console.error("Lỗi khi hủy TTDP:", err);
        });
    }
  };

  const handleCheckin = async (dp) => {
    try {
      let xepPhong = (await phongDaXep(dp.maThongTinDatPhong)).data;
      if (!xepPhong) {
        alert("Không tìm thấy phòng đã xếp.");
        return;
      }

      const loaiPhong = xepPhong.phong.loaiPhong;
      const xepPhongRequest = {
        id: xepPhong.id,
        phong: xepPhong.phong,
        thongTinDatPhong: xepPhong.thongTinDatPhong,
        ngayNhanPhong: new Date(),
        ngayTraPhong: new Date(new Date(dp.ngayTraPhong).setHours(12, 0, 0, 0)),
        trangThai: true,
      };
      await checkIn(xepPhongRequest);
      alert("Check-in thành công!");

      xepPhong = (await phongDaXep(dp.maThongTinDatPhong)).data;
      const ngayNhanPhongXepPhong = new Date(xepPhong.ngayNhanPhong);
      const gio14Chieu = new Date(ngayNhanPhongXepPhong);
      gio14Chieu.setHours(14, 0, 0, 0);

      if (ngayNhanPhongXepPhong < gio14Chieu) {
        const phuThuRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: "Phụ thu do nhận phòng sớm",
          tienPhuThu: 50000,
          soLuong: 1,
          trangThai: true,
        };
        await ThemPhuThu(phuThuRequest);
        alert("Phụ thu do nhận phòng sớm đã được thêm.");
      }

      if (dp.soNguoi > loaiPhong.soKhachToiDa) {
        const soNguoiVuot = dp.soNguoi - loaiPhong.soKhachToiDa;
        const tienPhuThuThem = soNguoiVuot * loaiPhong.donGiaPhuThu;
        const phuThuThemRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người)`,
          tienPhuThu: tienPhuThuThem,
          soLuong: 1,
          trangThai: true,
        };
        await ThemPhuThu(phuThuThemRequest);
        alert(
          `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người) đã được thêm.`
        );
      }
    } catch (error) {
      console.error("Lỗi xảy ra khi check-in:", error);
      alert("Đã xảy ra lỗi khi thực hiện check-in.");
    }
    searchDatPhong(key, page); // Cập nhật danh sách sau check-in
  };

  const handleAssign = (dp) => {
    setSelectedTTDPs([dp]);
    setShowXepPhongModal(true);
  };

  return (
    <Container sx={{ minWidth: "1300px" }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.15)" },
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <Box sx={{ p: 2, color: "white" }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            Nhận phòng
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "white", p: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <Input
              fullWidth
              placeholder="Nhập mã hoặc từ khóa..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              startDecorator={<SearchIcon />}
              size="lg"
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => searchDatPhong(key, 0)}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: "120px" },
                height: "56px",
                fontWeight: "bold",
                borderRadius: 1,
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{
                textTransform: "none",
                color: "#1976d2",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              {showAdvancedFilters
                ? "Ẩn bộ lọc nâng cao"
                : "Hiển thị bộ lọc nâng cao"}
            </Button>
          </Box>

          {showAdvancedFilters && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                bgcolor: "#fafafa",
              }}
            >
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Ngày nhận phòng"
                      value={ngayNhan}
                      minDate={dayjs()}
                      onChange={(newValue) => {
                        setNgayNhan(newValue);
                        if (newValue && ngayTra && newValue.isAfter(ngayTra)) {
                          setNgayTra(newValue.add(1, "day"));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "medium",
                          sx: {
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              backgroundColor: "#f5f5f5",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Ngày trả phòng"
                      value={ngayTra}
                      minDate={ngayNhan || dayjs()}
                      onChange={(newValue) => setNgayTra(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "medium",
                          sx: {
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              backgroundColor: "#f5f5f5",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Table Section */}
      {datPhong.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Đặt Phòng</TableCell>
                <TableCell>Khách Hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Số Người</TableCell>
                <TableCell>Số Phòng</TableCell>
                <TableCell>Ngày Đặt</TableCell>
                <TableCell>Tổng Tiền</TableCell>
                <TableCell>Ghi Chú</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datPhong.map((dp) => (
                <TableRow key={dp.maDatPhong}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "blue", cursor: "pointer" }}
                      onClick={() => handleViewDetails(dp.maDatPhong)}
                    >
                      {dp.maDatPhong}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {dp.khachHang.ho + " " + dp.khachHang.ten}
                  </TableCell>
                  <TableCell>{dp.khachHang.sdt}</TableCell>
                  <TableCell>{dp.soNguoi}</TableCell>
                  <TableCell>{dp.soPhong}</TableCell>
                  <TableCell>{dp.ngayDat}</TableCell>
                  <TableCell>{dp.tongTien} VND</TableCell>
                  <TableCell>{dp.ghiChu}</TableCell>
                  <TableCell>{dp.trangThai}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {dp.trangThai === "Chua xep" && (
                        <IconButton
                          size="small"
                          onClick={() => handleAssign(dp)}
                        >
                          <MeetingRoomIcon />
                        </IconButton>
                      )}
                      {dp.trangThai === "Da xep" && (
                        <IconButton
                          size="small"
                          onClick={() => handleCheckin(dp)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {["Chua xep", "Da xep"].includes(dp.trangThai) && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleHuyTTDP(dp.maThongTinDatPhong)}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Section */}
          {totalPages > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Không tìm thấy thông tin đặt phòng
        </Typography>
      )}

      {/* Modal Xếp Phòng */}
      <XepPhong
        show={showXepPhongModal}
        handleClose={() => setShowXepPhongModal(false)}
        selectedTTDPs={selectedTTDPs}
      />
    </Container>
  );
};

export default Checkin;
