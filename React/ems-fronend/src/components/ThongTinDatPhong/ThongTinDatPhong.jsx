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

const ThongTinDatPhong = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(null);
  const [ngayTra, setNgayTra] = useState(null);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const searchThongTinDatPhong = (ngayNhan, ngayTra, key, currentPage) => {
    const pageable = { page: currentPage, size: pageSize };
    const formattedNgayNhan = ngayNhan ? ngayNhan.format("YYYY-MM-DD") : "";
    const formattedNgayTra = ngayTra ? ngayTra.format("YYYY-MM-DD") : "";
    findTTDPS(formattedNgayNhan, formattedNgayTra, key, "", pageable)
      .then((res) => {
        console.log(res.data);
        setThongTinDatPhong(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setThongTinDatPhong([]);
      });
  };

  useEffect(() => {
    searchThongTinDatPhong(ngayNhan, ngayTra, key, page);
  });

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
          fetchThongTinDatPhong(page); // Cập nhật lại danh sách sau khi hủy
          console.log(`Đã hủy TTDP: ${maThongTinDatPhong}`);
        })
        .catch((err) => {
          console.error("Lỗi khi hủy TTDP:", err);
        });
    }
  };

  const fetchThongTinDatPhong = (currentPage) => {
    searchThongTinDatPhong(ngayNhan, ngayTra, key, currentPage);
  };

  const handleCheckin = (ttdp) => {
    console.log("Checkin:", ttdp);
  };

  const setShowXepPhongModal = (value) => {
    console.log("Show modal:", value);
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
            Tra cứu thông tin đặt phòng
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
              onClick={() => searchThongTinDatPhong(ngayNhan, ngayTra, key, 0)}
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
      {thongTinDatPhong.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Đặt Phòng</TableCell>
                <TableCell>Thông Tin Đặt Phòng</TableCell>
                <TableCell>Khách Hàng</TableCell>
                <TableCell>Số Người</TableCell>
                <TableCell>Loại Phòng</TableCell>
                <TableCell>Ngày Nhận</TableCell>
                <TableCell>Ngày Trả</TableCell>
                <TableCell>Giá Phòng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {thongTinDatPhong.map((ttdp) => (
                <TableRow key={ttdp.maThongTinDatPhong}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "blue", cursor: "pointer" }}
                      onClick={() => handleViewDetails(ttdp.maDatPhong)}
                    >
                      {ttdp.maDatPhong}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "blue", cursor: "pointer" }}
                      onClick={() =>
                        handleViewDetailsTTDPTTDP(ttdp.maThongTinDatPhong)
                      }
                    >
                      {ttdp.maThongTinDatPhong}
                    </Typography>
                  </TableCell>
                  <TableCell>{ttdp.tenKhachHang}</TableCell>
                  <TableCell>{ttdp.soNguoi}</TableCell>
                  <TableCell>{ttdp.loaiPhong.tenLoaiPhong}</TableCell>
                  <TableCell>{ttdp.ngayNhanPhong}</TableCell>
                  <TableCell>{ttdp.ngayTraPhong}</TableCell>
                  <TableCell>{ttdp.giaDat} VND</TableCell>
                  <TableCell>{ttdp.trangThai}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {ttdp.trangThai === "Chua xep" && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTTDPs([ttdp]);
                            setShowXepPhongModal(true);
                          }}
                        >
                          <MeetingRoomIcon />
                        </IconButton>
                      )}
                      {ttdp.trangThai === "Da xep" && (
                        <IconButton
                          size="small"
                          onClick={() => handleCheckin(ttdp)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {["Chua xep", "Da xep"].includes(ttdp.trangThai) && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleHuyTTDP(ttdp.maThongTinDatPhong)}
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

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ThongTinDatPhong;
