import React, { useState, useEffect } from "react";
import { findTTDPS } from "../../services/TTDP";
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
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { huyTTDP } from "../../services/TTDP";
import { findDatPhongToCheckin } from "../../services/DatPhong";

const Checkin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(null);
  const [ngayTra, setNgayTra] = useState(null);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const pageSize = 5; // Số mục trên mỗi trang
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const searchDatPhong = (key, currentPage) => {
    const pageable = { page: currentPage, size: pageSize };
    findDatPhongToCheckin(key, pageable) // Sửa lại để chỉ truyền 2 tham số
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
    const intervalId = setInterval(() => {
      searchDatPhong(key, page);
    }, 3000); // Làm mới mỗi 3 giây
    return () => clearInterval(intervalId);
  }, [ngayNhan, ngayTra, key, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // Chuyển đổi từ 1-based (Pagination) sang 0-based (API)
    searchDatPhong(key, newPage - 1); // Tải dữ liệu trang mới
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
          searchDatPhong(key, page); // Cập nhật lại danh sách sau khi hủy
          console.log(`Đã hủy TTDP: ${maThongTinDatPhong}`);
        })
        .catch((err) => {
          console.error("Lỗi khi hủy TTDP:", err);
        });
    }
  };

  const handleCheckin = (ttdp) => {
    console.log("Checkin:", ttdp);
  };

  const phongData = {};

  return (
    <Container sx={{ minWidth: "1300px" }}>
      {/* Search Section */}
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
                          size:"medium",
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
                  <TableCell>{dp.khachHang.ho + " " + dp.khachHang.ten}</TableCell>
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
                          onClick={() => {
                            setSelectedTTDPs([dp]);
                            setShowXepPhongModal(true);
                          }}
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
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Không tìm thấy thông tin đặt phòng
        </Typography>
      )}

      {/* Pagination Section */}
      {totalPages > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Pagination
            count={totalPages} // Tổng số trang từ API
            page={page + 1} // Chuyển từ 0-based sang 1-based cho Pagination
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Checkin;