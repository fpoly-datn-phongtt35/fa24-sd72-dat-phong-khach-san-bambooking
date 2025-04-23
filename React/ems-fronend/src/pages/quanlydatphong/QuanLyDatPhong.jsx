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
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  findDatPhong,
  huyDatPhong,
  CapNhatDatPhong,
} from "../../services/DatPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";
import XepPhong from "../../pages/xepphong/XepPhong";

const QuanLyDatPhong = () => {
  const navigate = useNavigate();
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(dayjs());
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
            ? dayjs(searchNgayNhan).format("YYYY-MM-DD")
            : null;
          const formattedNgayTra = searchNgayTra
            ? dayjs(searchNgayTra).format("YYYY-MM-DD")
            : null;

          const params = {
            key: searchKey,
            ngayNhanPhong: formattedNgayNhan,
            ngayTraPhong: formattedNgayTra,
            pageable: {
              page: currentPage,
              size: size,
            },
          };

          const res = await findDatPhong(params);
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
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setPage(0);
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

  const handleConfirm = async (dp) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xác nhận đặt phòng ${dp.maDatPhong} không?`
      )
    ) {
      setActionLoading(true);
      try {
        const datPhongRequest = {
          id: dp.id,
          maDatPhong: dp.maDatPhong,
          khachHang: dp.khachHang,
          soNguoi: dp.soNguoi,
          soPhong: dp.soPhong,
          ngayDat: dp.ngayDat,
          tongTien: dp.tongTien,
          ghiChu: dp.ghiChu,
          trangThai: "Đã xác nhận",
        };
        await CapNhatDatPhong(datPhongRequest);
        alert("Xác nhận đặt phòng thành công!");
        searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
      } catch (err) {
        console.error("Lỗi khi xác nhận đặt phòng:", err);
        alert("Xác nhận đặt phòng thất bại!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <Container sx={{ maxWidth: "100%", padding: { xs: 2, sm: 3 } }}>
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
            sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Tra cứu đặt phòng
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "white", p: { xs: 2, sm: 4 } }}>
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
              sx={{
                mb: { xs: 1, sm: 0 },
                fontSize: { xs: "1rem", sm: "1.25rem" },
                "& .MuiInputBase-input": { padding: "12px" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                searchDatPhong(key, ngayNhan, ngayTra, 0, pageSize)
              }
              disabled={loading}
              sx={{
                width: { xs: "100%", sm: "auto" },
                height: { xs: "48px", sm: "56px" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
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
                fontSize: { xs: "0.875rem", sm: "1rem" },
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
                    <DatePicker
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
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
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
                              fontSize: { xs: "0.875rem", sm: "1rem" },
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
          flexDirection: { xs: "column", sm: "row" },
          justifyhandles: ["flex", "flex-col", "flex-row"],
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
          <InputLabel>Số bản ghi</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Số bản ghi"
            disabled={loading}
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
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
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : datPhong.length > 0 ? (
        <>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {datPhong.map((dp) => (
              <Paper key={dp.maDatPhong} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Mã Đặt Phòng:</strong>{" "}
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleViewDetails(dp.maDatPhong)}
                  >
                    {dp.maDatPhong}
                  </span>
                </Typography>
                <Typography variant="body2">
                  <strong>Khách Hàng:</strong>{" "}
                  {dp.khachHang?.ho + " " + dp.khachHang?.ten}
                </Typography>
                <Typography variant="body2">
                  <strong>Số Điện Thoại:</strong> {dp.khachHang?.sdt}
                </Typography>
                <Typography variant="body2">
                  <strong>Số Người:</strong> {dp.soNguoi}
                </Typography>
                <Typography variant="body2">
                  <strong>Số Phòng:</strong> {dp.soPhong}
                </Typography>
                <Typography variant="body2">
                  <strong>Ngày Đặt:</strong>{" "}
                  {dayjs(dp.ngayDat).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Tổng Tiền:</strong> {dp.tongTien?.toLocaleString()}{" "}
                  VND
                </Typography>
                <Typography variant="body2\">
                  <strong>Trạng Thái:</strong> {dp.trangThai}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {dp.trangThai === "Đang đặt phòng" && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleConfirm(dp)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CheckIcon />
                      )}
                    </IconButton>
                  )}
                  {["Đang đặt phòng", "Đã xác nhận"].includes(dp.trangThai) && (
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
              </Paper>
            ))}
          </Box>

          <TableContainer
            component={Paper}
            sx={{ display: { xs: "none", sm: "block" }, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
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
                        {dp.trangThai === "Chưa xác nhận" && (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleConfirm(dp)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckIcon />
                            )}
                          </IconButton>
                        )}
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
        </>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
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
