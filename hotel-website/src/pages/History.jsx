import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatPhongbyTDN,GuiEmailXacNhanHuyDP } from '../services/DatPhong.js';
import { TTDPcothehuy } from '../services/TTDP.js';
import { debounce } from 'lodash';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from "@mui/icons-material/Info";
export default function History() {
  const [allBookings, setAllBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageable, setPageable] = useState({
    page: 0,
    size: 5,
    totalPages: 1,
  });
  const [keyword, setKeyword] = useState('');
  const [ngayNhanPhong, setNgayNhanPhong] = useState('');
  const [ngayTraPhong, setNgayTraPhong] = useState('');
  const [canCancel, setCanCancel] = useState({});
  const navigate = useNavigate();
  const tenDangNhap = localStorage.getItem('user');

  // Hàm tính toán danh sách hiển thị và totalPages
  const updateDisplayedBookings = (bookings, page, size) => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    const totalPages = Math.ceil(bookings.length / size) || 1;

    setDisplayedBookings(paginatedBookings);
    setPageable((prev) => ({
      ...prev,
      totalPages,
    }));
  };

  // Kiểm tra khả năng hủy đặt phòng
  const checkCancelEligibility = async (bookingId) => {
    try {
      const canCancelResult = await TTDPcothehuy(bookingId);
      console.log(canCancelResult.data)
      setCanCancel((prev) => ({
        ...prev,
        [bookingId]: canCancelResult.data,
      }));
    } catch (error) {
      console.error('Error checking cancel eligibility:', error);
      setCanCancel((prev) => ({
        ...prev,
        [bookingId]: false,
      }));
    }
  };

  const debouncedFetchBookings = useCallback(
    debounce(async (keyword, ngayNhan, ngayTra) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDatPhongbyTDN(
          tenDangNhap,
          keyword || null,
          ngayNhan || null,
          ngayTra || null,
          pageable.size
        );
        const bookings = Array.isArray(response.data) ? response.data : [];
        console.log(bookings)
        setAllBookings(bookings);
        updateDisplayedBookings(bookings, pageable.page, pageable.size);
        // Kiểm tra khả năng hủy cho từng booking
        bookings.forEach((booking) => {
          checkCancelEligibility(booking.id);
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Không thể tải danh sách đặt phòng. Vui lòng thử lại.');
        setAllBookings([]);
        setDisplayedBookings([]);
        setPageable((prev) => ({ ...prev, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    }, 500),
    [tenDangNhap, pageable.size]
  );

  useEffect(() => {
    if (tenDangNhap) {
      debouncedFetchBookings(keyword, ngayNhanPhong, ngayTraPhong);
    }
  }, [keyword, ngayNhanPhong, ngayTraPhong, debouncedFetchBookings]);

  useEffect(() => {
    updateDisplayedBookings(allBookings, pageable.page, pageable.size);
  }, [pageable.page, allBookings, pageable.size]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageable((prev) => ({ ...prev, page: 0 }));
    debouncedFetchBookings(keyword, ngayNhanPhong, ngayTraPhong);
  };

  const handlePageChange = (event, newPage) => {
    setPageable((prev) => ({
      ...prev,
      page: newPage - 1, // Pagination của MUI bắt đầu từ 1
    }));
  };

  const handleViewDetail = (idDatPhong) => {
    navigate(`/ttdp/${idDatPhong}`);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      alert("Email xác nhận hủy đặt phòng đã được gửi đến email của bạn")
      await GuiEmailXacNhanHuyDP(bookingId);
      // Cập nhật lại danh sách sau khi hủy
      debouncedFetchBookings(keyword, ngayNhanPhong, ngayTraPhong);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Không thể hủy đặt phòng. Vui lòng thử lại.');
    }
  };

  return (
    <Container
      sx={{
        minHeight: "66vh", 
      }}
    >
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Danh sách đặt phòng
      </Typography>

      {/* Thanh tìm kiếm */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Mã đặt phòng"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: '200px' }}
        />
        <TextField
          type="date"
          label="Ngày nhận phòng"
          variant="outlined"
          value={ngayNhanPhong}
          onChange={(e) => setNgayNhanPhong(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: '200px' }}
        />
        <TextField
          type="date"
          label="Ngày trả phòng"
          variant="outlined"
          value={ngayTraPhong}
          onChange={(e) => setNgayTraPhong(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: '200px' }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Box>

      {/* Hiển thị lỗi hoặc loading */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedBookings.length === 0 ? (
        <Typography>Không có đặt phòng nào phù hợp.</Typography>
      ) : (
        <>
          {/* Bảng dữ liệu */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow> 
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Mã đặt phòng</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Số phòng</TableCell> 
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Số người</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Tổng tiền</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Ngày đặt</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Ghi chú</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{fontWeight: 'bold'}}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell align="center">{booking.maDatPhong}</TableCell>
                    <TableCell align="center">{booking.soPhong}</TableCell>
                    <TableCell align="center">{booking.soNguoi}</TableCell>
                    <TableCell align="center">{booking.tongTien.toLocaleString()} VNĐ</TableCell>
                    <TableCell align="center">{new Date(booking.ngayDat).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{booking.ghiChu}</TableCell>
                    <TableCell align="center">{booking.trangThai}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Xem thông tin đặt phòng">
                        <InfoIcon
                          variant="contained"
                          color="primary"
                          sx = {{marginTop: 0.7}}
                          onClick={() => handleViewDetail(booking.id)}
                        >
                          
                        </InfoIcon></Tooltip>
                        {canCancel[booking.id] && (
                          <IconButton
                          size="small"
                          sx={{ color: '#d32f2f' }}
                          onClick={() => handleCancelBooking(booking.id)}
                          title="Hủy đặt phòng"
                        >
                          <CancelIcon />
                        </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Phân trang */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pageable.totalPages}
              page={pageable.page + 1} // Pagination của MUI bắt đầu từ 1
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
    </Container>
  );
}