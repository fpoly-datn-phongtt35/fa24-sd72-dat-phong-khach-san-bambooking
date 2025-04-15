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
import XepPhong from "../../pages/xepphong/XepPhong";

const Checkin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(dayjs().hour(14).minute(0));
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

          const pageable = {
            page: currentPage,
            size: size,
          };

          const res = await findDatPhongToCheckin(
            pageable,
            searchKey,
            formattedNgayNhan,
            formattedNgayTra
          );
          setDatPhong(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        } catch (err) {
          console.error("Error fetching data:", err);
          setDatPhong([]);
          setTotalPages(0);
          alert("Lỗi khi tải dữ liệu, vui lòng thử lại!");
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
    setPage(newPage - 1);
    searchDatPhong(key, ngayNhan, ngayTra, newPage - 1, pageSize);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setPage(0);
    searchDatPhong(key, ngayNhan, ngayTra, 0, newSize);
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  const handleViewDetailsTTDPTTDP = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const handleHuyTTDP = async (maThongTinDatPhong) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy thông tin đặt phòng ${maThongTinDatPhong} không?`
      )
    ) {
      setActionLoading(true);
      try {
        await huyTTDP(maThongTinDatPhong);
        searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
        alert("Hủy thông tin đặt phòng thành công!");
      } catch (err) {
        console.error("Lỗi khi hủy TTDP:", err);
        alert("Hủy thông tin đặt phòng thất bại!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCheckin = async (dp) => {
    setActionLoading(true);
    try {
      let xepPhong = (await phongDaXep(dp.maThongTinDatPhong)).data;
      if (!xepPhong) {
        throw new Error("Không tìm thấy phòng đã xếp.");
      }

      const loaiPhong = xepPhong.phong.loaiPhong;
      const xepPhongRequest = {
        id: xepPhong.id,
        phong: xepPhong.phong,
        thongTinDatPhong: xepPhong.thongTinDatPhong,
        ngayNhanPhong: new Date(),
        ngayTraPhong: new Date(new Date(dp.ngayTraPhong).setHours(12, 0, 0, 0)),
        trangThai: "Da nhan",
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        sx={{
          width: "100%",
          padding: isMobile ? 1 : 2,
          boxSizing: "border-box",
        }}
      >
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
          <Box sx={{ p: isMobile ? 1 : 2, color: "white" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              Nhận phòng
            </Typography>
          </Box>

          <Box sx={{ bgcolor: "white", p: isMobile ? 2 : 4 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={isMobile ? 1 : 2}
              justifyContent="center"
              alignItems="center"
            >
              <Input
                fullWidth
                placeholder="Nhập mã hoặc từ khóa..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                startAdornment={<SearchIcon />}
                sx={{ mb: isMobile ? 1 : 0 }}
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
                  width: isMobile ? "100%" : "auto",
                  minWidth: isMobile ? "auto" : "120px",
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
                  p: isMobile ? 1 : 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                }}
              >
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12} sm={6}>
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
            p: isMobile ? 1 : 2,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <FormControl sx={{ minWidth: isMobile ? "100%" : 120 }}>
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
              sx={{ mt: isMobile ? 2 : 0 }}
            />
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : datPhong.length > 0 ? (
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {isMobile ? (
                    <>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Mã Đặt
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Thông tin
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Hành Động
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Mã Đặt Phòng
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Khách Hàng
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Số Điện Thoại
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Số Người
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Số Phòng
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Ngày Đặt
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Tổng Tiền
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Ghi Chú
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Trạng Thái
                      </TableCell>
                      <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                        Hành Động
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {datPhong.map((dp) => (
                  <TableRow key={dp.maDatPhong}>
                    {isMobile ? (
                      <>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={() => handleViewDetails(dp.maDatPhong)}
                          >
                            {dp.maDatPhong}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          <Typography variant="body2">
                            {dp.khachHang?.ho + " " + dp.khachHang?.ten}
                            <br />
                            SĐT: {dp.khachHang?.sdt}
                            <br />
                            Người: {dp.soNguoi}, Phòng: {dp.soPhong}
                            <br />
                            Ngày:{" "}
                            {dp.ngayDat
                              ? dayjs(dp.ngayDat).format("DD/MM/YYYY")
                              : "N/A"}
                            <br />
                            Tiền: {dp.tongTien?.toLocaleString()} VND
                            <br />
                            Ghi chú: {dp.ghiChu || "Không có"}
                            <br />
                            Trạng thái: {dp.trangThai}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          <Stack direction="row" spacing={1}>
                            {dp.trangThai === "Chua xep" && (
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
                            )}
                            {["Chua xep", "Da xep"].includes(dp.trangThai) && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleHuyTTDP(dp.maThongTinDatPhong)
                                }
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
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: "blue", cursor: "pointer" }}
                            onClick={() => handleViewDetails(dp.maDatPhong)}
                          >
                            {dp.maDatPhong}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.khachHang?.ho + " " + dp.khachHang?.ten}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.khachHang?.sdt}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.soNguoi}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.soPhong}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.ngayDat
                            ? dayjs(dp.ngayDat).format("DD/MM/YYYY")
                            : "N/A"}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.tongTien?.toLocaleString()} VND
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.ghiChu || "Không có"}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          {dp.trangThai}
                        </TableCell>
                        <TableCell sx={{ fontSize: isMobile ? 12 : 14 }}>
                          <Stack direction="row" spacing={1}>
                            {dp.trangThai === "Chua xep" && (
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
                            )}
                            {["Chua xep", "Da xep"].includes(dp.trangThai) && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleHuyTTDP(dp.maThongTinDatPhong)
                                }
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
                      </>
                    )}
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
          onSuccess={() =>
            searchDatPhong(key, ngayNhan, ngayTra, page, pageSize)
          }
        />
      </Container>
    </LocalizationProvider>
  );
};

export default Checkin;
