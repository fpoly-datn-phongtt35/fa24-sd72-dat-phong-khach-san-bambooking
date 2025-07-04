import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
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
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { searchCanceledDatPhong } from "../../services/DatPhong"; // Giả sử API này đã được cập nhật
import dayjs from "dayjs";

const QuanLyDatPhongDaHuy = () => {
  const navigate = useNavigate();

  const [canceledDatPhong, setCanceledDatPhong] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(""); // Mã đặt phòng để tìm kiếm

  const fetchCanceledDatPhong = useCallback(
    debounce(async (searchKey, currentPage, size) => {
      setLoading(true);
      try {
        const res = await searchCanceledDatPhong({
          page: currentPage,
          size,
          maDatPhong: searchKey,
          trangThai: "Đã hủy",
        });
        console.log("Response from searchCanceledDatPhong:", res);
        const data = res.data;
        if (data && typeof data === "object") {
          setCanceledDatPhong(data.content || []);
          setTotalPages(data.totalPages || 0);
        } else {
          setCanceledDatPhong([]);
          setTotalPages(0);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Phản hồi từ server không hợp lệ. Vui lòng thử lại!",
            confirmButtonText: "Đóng",
          });
        }
      } catch (err) {
        console.error("Error fetching canceled bookings:", err.response?.data || err.message);
        setCanceledDatPhong([]);
        setTotalPages(0);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response?.data?.message || "Đã xảy ra lỗi khi tìm kiếm đặt phòng đã hủy. Vui lòng thử lại!",
          confirmButtonText: "Đóng",
        });
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchCanceledDatPhong(searchKey, page, pageSize);
  }, [searchKey, page, pageSize]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(0);
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "16px 0" }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", mb: 3 }}>
          Danh sách đặt phòng đã hủy
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} alignItems="center">
          <TextField
            label="Tìm kiếm mã đặt phòng"
            variant="outlined"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            sx={{ width: { xs: "100%", sm: "300px" } }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : canceledDatPhong.length > 0 ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Số bản ghi</InputLabel>
                <Select value={pageSize} onChange={handlePageSizeChange} label="Số bản ghi" disabled={loading}>
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
                  sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
                />
              )}
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
                    <TableCell>Ghi chú hủy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {canceledDatPhong.map((dp) => (
                    <TableRow key={dp.maDatPhong}>
                      <TableCell> {dp.maDatPhong || "N/A"}</TableCell>
                      <TableCell>
                        {dp.khachHang ? `${dp.khachHang.ho || ""} ${dp.khachHang.ten || ""}`.trim() : "N/A"}
                      </TableCell>
                      <TableCell>{dp.khachHang?.sdt || "N/A"}</TableCell>
                      <TableCell>{dp.soNguoi || 0}</TableCell>
                      <TableCell>{dp.soPhong || 0}</TableCell>
                      <TableCell>{dp.ngayDat ? dayjs(dp.ngayDat).format("DD/MM/YYYY") : "N/A"}</TableCell>
                      <TableCell>{(dp.tongTien || 0).toLocaleString()} VND</TableCell>
                      <TableCell>{dp.ghiChu || "Không có ghi chú"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Không tìm thấy thông tin đặt phòng đã hủy
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default QuanLyDatPhongDaHuy;