
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
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {
  findDatPhong,
  huyDatPhong,
  CapNhatDatPhong,
  EmailXacNhanDPThanhCong,
} from "../../services/DatPhong";
import XepPhong from "../../pages/xepphong/XepPhong";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const QuanLyDatPhong = () => {
  const navigate = useNavigate();
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [ngayNhan, setNgayNhan] = useState(dayjs().startOf("day"));
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
        if (
          searchNgayNhan &&
          searchNgayTra &&
          searchNgayNhan.isAfter(searchNgayTra)
        ) {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Ngày trả phòng phải sau ngày nhận phòng!",
            confirmButtonText: "Đóng",
          });
          return;
        }
        setLoading(true);
        try {
          const formattedNgayNhan =
            searchNgayNhan && dayjs(searchNgayNhan).isValid()
              ? dayjs(searchNgayNhan).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
              : null;
          const formattedNgayTra =
            searchNgayTra && dayjs(searchNgayTra).isValid()
              ? dayjs(searchNgayTra).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
              : null;

          const res = await findDatPhong(
            searchKey,
            formattedNgayNhan,
            formattedNgayTra,
            {
              page: currentPage,
              size: size,
            }
          );
          const data = res.data;
          setDatPhong(data.content || []);
          setTotalPages(data.totalPages || 0);
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
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setPage(0);
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  const handleOpenCancelDialog = (dp) => {
    Swal.fire({
      title: "Nhập lý do hủy đặt phòng",
      input: "textarea",
      inputLabel: "Ghi chú",
      inputPlaceholder: "Vui lòng nhập lý do hủy...",
      inputAttributes: {
        "aria-label": "Ghi chú hủy",
      },
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Ghi chú không được để trống!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleHuyDP(dp, result.value);
      }
    });
  };

  const handleHuyDP = async (dp, cancelNote) => {
    const confirmDelete = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn hủy thông tin đặt phòng ${dp.maDatPhong} không?`,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
    if (!confirmDelete.isConfirmed) return;

    setActionLoading(true);
    try {
      const datPhongRequest = {
        id: dp.id,
        maDatPhong: dp.maDatPhong,
        khachHang: dp.khachHang,
        soNguoi: dp.soNguoi,
        soTre: dp.soTre || 0,
        soPhong: dp.soPhong,
        ngayDat: dp.ngayDat,
        tongTien: dp.tongTien,
        ghiChu: cancelNote,
        trangThai: "Đã hủy",
      };
      await CapNhatDatPhong(datPhongRequest);

      await huyDatPhong(dp.maDatPhong);

      searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Hủy đặt phòng thành công!",
        confirmButtonText: "Đóng",
      });
    } catch (err) {
      console.error("Lỗi khi hủy TTDP:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || "Hủy đặt phòng thất bại!",
        confirmButtonText: "Đóng",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = async (dp) => {
    const confirmAction = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn xác nhận đặt phòng ${dp.maDatPhong} không?`,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
    if (!confirmAction.isConfirmed) return;

    setActionLoading(true);
    try {
      const datPhongRequest = {
        id: dp.id,
        maDatPhong: dp.maDatPhong,
        khachHang: dp.khachHang,
        soNguoi: dp.soNguoi,
        soTre: dp.soTre || 0,
        soPhong: dp.soPhong,
        ngayDat: dp.ngayDat,
        tongTien: dp.tongTien,
        ghiChu: dp.ghiChu,
        trangThai: "Đã xác nhận",
      };
      await CapNhatDatPhong(datPhongRequest);
      EmailXacNhanDPThanhCong(datPhongRequest.id);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xác nhận đặt phòng thành công!",
        confirmButtonText: "Đóng",
      });
      searchDatPhong(key, ngayNhan, ngayTra, page, pageSize);
    } catch (err) {
      console.error("Lỗi khi xác nhận đặt phòng:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || "Xác nhận đặt phòng thất bại!",
        confirmButtonText: "Đóng",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        marginLeft: "auto",
        boxSizing: "border-box",
        marginRight: "auto",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "0",
        paddingBottom: "32px",
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
                width: { xs: "50%", sm: "auto" },
                height: { xs: "40px", sm: "56px" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Tìm"}
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
                    <DateTimePicker
                      label="Ngày nhận phòng"
                      value={ngayNhan}
                      onChange={(newValue) => {
                        setNgayNhan(newValue);
                        if (newValue && ngayTra && newValue.isAfter(ngayTra)) {
                          setNgayTra(newValue.add(1, "hour"));
                        }
                      }}
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
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
                    <DateTimePicker
                      label="Ngày trả phòng"
                      value={ngayTra}
                      minDateTime={ngayNhan ? ngayNhan.add(1, "hour") : dayjs()}
                      onChange={(newValue) => setNgayTra(newValue)}
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "medium",
                          sx: {
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              backgroundColor: "#f5f5f5f5",
                            },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
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
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <FormControl sx={{ minWidth: { xs: "100%", sm: "120px" } }}>
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
            {datPhong.map((row) => (
              <Paper key={row.maDatPhong} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Mã đặt phòng:</strong>{" "}
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleViewDetails(row.maDatPhong)}
                  >
                    {row.maDatPhong}
                  </span>
                </Typography>
                <Typography variant="body2">
                  <strong>Khách hàng:</strong>{" "}
                  {row.khachHang?.ho + "h" + row.khachHang?.ten}
                </Typography>
                <Typography variant="body2">
                  <strong>Số điện thoại:</strong> {row.khachHang?.sdt}
                </Typography>
                <Typography variant="body2">
                  <strong>Số người:</strong> {row.soNguoi}
                </Typography>
                <Typography variant="body2">
                  <strong>Số trẻ em:</strong> {row.soTre || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Số phòng:</strong> {row.soPhong}
                </Typography>
                <Typography variant="body2">
                  <strong>Ngày đặt:</strong>{" "}
                  {dayjs(row.ngayDat).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Tổng tiền:</strong> {row.tongTien?.toLocaleString()}{" "}
                  VND
                </Typography>
                <Typography variant="body2">
                  <strong>Trạng thái:</strong> {row.trangThai}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {row.trangThai === "Chưa xác nhận" && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleConfirm(row)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CheckIcon />
                      )}
                    </IconButton>
                  )}
                  {["Chưa xác nhận", "Đang đặt phòng", "Đã xác nhận"].includes(
                    row.trangThai
                  ) && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenCancelDialog(row)}
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
                  <TableCell>Số Trẻ Em</TableCell>
                  <TableCell>Số Phòng</TableCell>
                  <TableCell>Ngày Đặt</TableCell>
                  <TableCell>Tổng Tiền</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datPhong.map((row) => (
                  <TableRow key={row.maDatPhong}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleViewDetails(row.maDatPhong)}
                      >
                        {row.maDatPhong}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.khachHang?.ho + " " + row.khachHang?.ten}
                    </TableCell>
                    <TableCell>{row.khachHang?.sdt}</TableCell>
                    <TableCell>{row.soNguoi}</TableCell>
                    <TableCell>{row.soTre || 0}</TableCell>
                    <TableCell>{row.soPhong}</TableCell>
                    <TableCell>
                      {dayjs(row.ngayDat).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{row.tongTien?.toLocaleString()} VND</TableCell>
                    <TableCell>{row.trangThai}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {row.trangThai === "Chưa xác nhận" && (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleConfirm(row)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckIcon />
                            )}
                          </IconButton>
                        )}
                        {[
                          "Chưa xác nhận",
                          "Đang đặt phòng",
                          "Đã xác nhận",
                        ].includes(row.trangThai) && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenCancelDialog(row)}
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