import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { findDatPhong, huyDatPhong } from "../../services/DatPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";
import XepPhong from "../../pages/xepphong/XepPhong";

const QuanLyDatPhong = () => {
  const navigate = useNavigate();
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(
      dayjs().hour(14).minute(0));
  const [ngayTra, setNgayTra] = useState(null);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);

  const searchDatPhong = useCallback(
    debounce(
      async (searchKey, searchNgayNhan, searchNgayTra, currentPage, size) => {
        setLoading(true);
        try {
          const formattedNgayNhan = searchNgayNhan
            ? dayjs(searchNgayNhan).startOf("day")
            : null;
          const formattedNgayTra = searchNgayTra
            ? dayjs(searchNgayTra).startOf("day")
            : null;

          const params = {
            key: searchKey,
            ngayNhanPhong: formattedNgayNhan,
            ngayTraPhong: formattedNgayTra,
            pageable: {
              page: currentPage, // Spring Boot bắt đầu từ 0
              size: size,
            },
          };

          const res = await findDatPhong(params);
          console.log("Response data:", res);
          setDatPhong(res.content || []);
          setTotalPages(res.totalPages || 0);
        } catch (err) {
          console.error("Error fetching data:", err);
          setDatPhong([]);
          setTotalPages(0);
        } finally {
          setLoading(false);
        }
      },
      300
    ),
    []
  );

  useEffect(() => {
    searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
    return () => searchDatPhong.cancel();
  }, [key, ngayNhan, ngayTra, page, pageSize, searchDatPhong]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // Pagination của MUI đếm từ 1, nhưng API đếm từ 0
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setPage(0); // Reset về trang đầu khi thay đổi số bản ghi
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  const handleHuyDP = async (maDatPhong) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy thông tin đặt phòng ${maDatPhong} không?`
      )
    ) {
      setActionLoading(true);
      try {
        await huyDatPhong(maDatPhong);
        searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
        alert("Hủy đặt phòng thành công!");
      } catch (err) {
        console.error("Lỗi khi hủy TTDP:", err);
        alert("Hủy đặt phòng thất bại!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCheckin = async (datPhongItem) => {
    setActionLoading(true);
    try {
      let xepPhong = (await phongDaXep(datPhongItem.maThongTinDatPhong)).data;
      if (!xepPhong) {
        throw new Error("Không tìm thấy phòng đã xếp.");
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
        trangThai: "Da nhan", // Cập nhật trạng thái thành "Đã nhận"
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
      console.error("Lỗi khi check-in:", error);
      alert(error.message || "Đã xảy ra lỗi khi thực hiện check-in.");
    } finally {
      setActionLoading(false);
      searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
    }
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
              onClick={() =>
                searchDatPhong(key, ngayNhan, ngayTra, 0, pageSize)
              }
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Số bản ghi</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Số bản ghi"
            disabled={loading}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        {totalPages > 0 && (
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            disabled={loading}
          />
        )}
      </Box>

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
                    {dp.khachHang?.ho + " " + dp.khachHang?.ten}
                  </TableCell>
                  <TableCell>{dp.khachHang?.sdt}</TableCell>
                  <TableCell>{dp.soNguoi}</TableCell>
                  <TableCell>{dp.soPhong}</TableCell>
                  <TableCell>
                    {dayjs(dp.ngayDat).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{dp.tongTien?.toLocaleString()} VND</TableCell>
                  <TableCell>{dp.trangThai}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {/* {dp.trangThai === "Chua xep" && (
                        <IconButton
                          size="small"
                          onClick={() => handleAssign(dp)}
                          disabled={actionLoading}
                        >
                          <MeetingRoomIcon />
                        </IconButton>
                      )}
                      {dp.trangThai === "Da xep" && (
                        <IconButton
                          size="small"
                          onClick={() => handleCheckin(dp)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CheckCircleIcon />
                          )}
                        </IconButton>
                      )} */}
                      {["Đang đặt phòng", "Đã xác nhận"].includes(
                        dp.trangThai
                      ) && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleHuyDP(dp.maDatPhong)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <RemoveCircleOutlineIcon />
                          )}
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

      <XepPhong
        show={showXepPhongModal}
        handleClose={() => setShowXepPhongModal(false)}
        selectedTTDPs={selectedTTDPs}
        onSuccess={() => searchDatPhong(key, ngayNhan, ngayTra, page, pageSize)}
      />
    </Container>
  );
};

export default QuanLyDatPhong;
