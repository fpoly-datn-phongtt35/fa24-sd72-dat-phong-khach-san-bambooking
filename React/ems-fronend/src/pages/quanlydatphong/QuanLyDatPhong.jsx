import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { findDatPhong } from "../../services/DatPhong";
import { huyTTDP } from "../../services/TTDP";
import XepPhong from "../../components/XepPhong/XepPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";

const QuanLyDatPhong = () => {
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
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);

  const searchDatPhong = useCallback(
    (searchKey, ngayNhan, searchNgayTra, currentPage) => {
      setLoading(true);
      console.log("searchDatPhong", searchKey, ngayNhan, searchNgayTra);
      const pageable = { page: currentPage, size: pageSize };
      findDatPhong(searchKey, ngayNhan, searchNgayTra, pageable)
        .then((res) => {
          console.log(res.data);
          setDatPhong(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setDatPhong([]);
        })
        .finally(() => setLoading(false));
    },
    [pageSize]
  );

  useEffect(() => {
    searchDatPhong(key, ngayNhan, ngayTra, page);
  }, [key, ngayNhan, ngayTra, page, searchDatPhong]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
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
          searchDatPhong(key, ngayNhan, ngayTra, page);
          console.log(`Đã hủy TTDP: ${maThongTinDatPhong}`);
        })
        .catch((err) => {
          console.error("Lỗi khi hủy TTDP:", err);
        });
    }
  };

  const handleCheckin = async (datPhongItem) => {
    try {
      let xepPhong = (await phongDaXep(datPhongItem.maThongTinDatPhong)).data;
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
        ngayTraPhong: new Date(
          new Date(datPhongItem.ngayTraPhong).setHours(12, 0, 0, 0)
        ),
        trangThai: xepPhong.trangThai,
      };
      await checkIn(xepPhongRequest);
      alert("Check-in thành công!");

      xepPhong = (await phongDaXep(datPhongItem.maThongTinDatPhong)).data;
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

      if (datPhongItem.soNguoi > loaiPhong.soKhachToiDa) {
        const soNguoiVuot = datPhongItem.soNguoi - loaiPhong.soKhachToiDa;
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
      console.error("Lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi khi thực hiện thao tác.");
    }
    searchDatPhong(key, ngayNhan, ngayTra, page);
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
            Tra cứu đặt phòng
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
              startAdornment={<SearchIcon />}
              size="lg"
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => searchDatPhong(key, ngayNhan, ngayTra, 0)}
              disabled={loading}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: "120px" },
                height: "56px",
                fontWeight: "bold",
                borderRadius: 1,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Tìm kiếm"
              )}
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
                      // Bỏ minDate để cho phép chọn ngày quá khứ
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : datPhong.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Đặt Phòng</TableCell>
                <TableCell>Khách Hàng</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Số Người</TableCell>
                <TableCell>Số Phòng</TableCell>
                <TableCell>Ngày Đặt</TableCell>
                <TableCell>Tổng Tiền</TableCell>
                <TableCell>Ghi Chú</TableCell>
                <TableCell>Trạng Thái</TableCell>
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
          {totalPages > 0 && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
              />
            </Box>
          )}
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Không tìm thấy thông tin đặt phòng
        </Typography>
      )}

      <XepPhong
        show={showXepPhongModal}
        handleClose={() => setShowXepPhongModal(false)}
        selectedTTDPs={selectedTTDPs}
      />
    </Container>
  );
};

export default QuanLyDatPhong;
