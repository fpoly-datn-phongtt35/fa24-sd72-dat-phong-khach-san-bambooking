import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Chip,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Giả sử các hàm API được định nghĩa trong file services (điều chỉnh đường dẫn tương ứng)
import { kiemTraDa, kiemTraDon } from "../../services/LoaiPhongService";

const DatPhong = () => {
  // State cho ngày nhận, ngày trả, số người và số phòng (nếu cần)
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soNguoi, setSoNguoi] = useState(1);
  // State lưu kết quả trả về từ API kiểm tra
  const [isDonAvailable, setIsDonAvailable] = useState(null);
  const [isDaAvailable, setIsDaAvailable] = useState(null);
  // State lưu dữ liệu các phòng đã được chọn (nếu cần)
  const [selectData, setSelectData] = useState([]);
  // Các state cho bảng kết quả (ví dụ hiển thị danh sách loại phòng khả dụng)
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm xử lý tìm kiếm: gọi API kiem-tra-don và kiem-tra-da
  const handleSearch = async () => {
    try {
      // Gửi ngày dưới dạng chuỗi ISO
      const donResponse = await kiemTraDon(
        ngayNhanPhong.format(),
        ngayTraPhong.format(),
        soNguoi
      );
      const daResponse = await kiemTraDa(
        ngayNhanPhong.format(),
        ngayTraPhong.format(),
        soNguoi
      );
      setIsDonAvailable(donResponse.data);
      setIsDaAvailable(daResponse.data);

      // Nếu có thêm API để lấy danh sách phòng khả dụng, bạn có thể gọi và set vào loaiPhongKhaDung
      // Ví dụ: fetchLoaiPhong();
    } catch (error) {
      console.error("Lỗi khi kiểm tra phòng:", error);
    }
  };

  // Hàm xử lý xóa dữ liệu phòng đã chọn
  const handleRemoveSelectData = (index) => {
    const newSelectData = [...selectData];
    newSelectData.splice(index, 1);
    setSelectData(newSelectData);
  };

  // Ví dụ hàm xử lý đặt phòng ngay
  const handleCreateBooking = (result) => {
    console.log("Đặt ngay:", result);
  };

  // Hàm xử lý thêm vào danh sách phòng đã chọn
  const handleSelectData = (result) => {
    setSelectData([...selectData, result]);
  };

  // Hàm xử lý Bulk Booking (đặt hàng loạt)
  const handleBulkBooking = () => {
    console.log("Bulk booking với:", selectData);
  };

  return (
    <Container sx={{ minWidth: "1300px", padding: 2 }}>
      {/* Phần tìm kiếm */}
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          mb: 3,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Tìm Kiếm Phòng
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Ngày nhận phòng"
              value={ngayNhanPhong}
              minDate={dayjs()}
              onChange={(newValue) => {
                setNgayNhanPhong(newValue);
                if (newValue.isAfter(ngayTraPhong)) {
                  setNgayTraPhong(newValue.add(1, "day"));
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="Ngày trả phòng"
              value={ngayTraPhong}
              minDate={ngayNhanPhong}
              onChange={(newValue) => setNgayTraPhong(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Số người"
            type="number"
            value={soNguoi}
            onChange={(e) => setSoNguoi(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Box>
      </Box>

      {/* Hiển thị kết quả kiểm tra */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        {isDonAvailable !== null && (
          <Typography variant="h6">
            Kiểm tra kiểu đơn: {isDonAvailable ? "Đáp ứng" : "Không đáp ứng"}
          </Typography>
        )}
        {isDaAvailable !== null && (
          <Typography variant="h6">
            Kiểm tra kiểu đa: {isDaAvailable ? "Đáp ứng" : "Không đáp ứng"}
          </Typography>
        )}
      </Box>

      {/* Phân trang & chọn số dòng hiển thị */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3, mt: 4 }}
      >
        {/* Nút Bulk Booking */}
        <Button variant="contained" color="primary" onClick={handleBulkBooking}>
          Đặt phòng
        </Button>

        {/* Phần Hiển thị số dòng */}
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" noWrap>
            Hiển thị:
          </Typography>
          <Select
            value={pageSize}
            sx={{ width: "70px", height: "40px", ml: 1 }}
            onChange={(event) => {
              const newPageSize = Number(event.target.value);
              setPageSize(newPageSize);
              setCurrentPage(0);
              // Gọi hàm fetch nếu cần cập nhật bảng kết quả
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Box>
      </Stack>

      {/* Bảng hiển thị kết quả (giả lập) */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Loại phòng</TableCell>
              <TableCell>Diện tích</TableCell>
              <TableCell>Số khách tối đa</TableCell>
              <TableCell>Số phòng khả dụng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số phòng</TableCell>
              <TableCell>Tổng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
              loaiPhongKhaDung.map((result, index) => (
                <TableRow key={result.loaiPhongResponse.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.loaiPhongResponse.tenLoaiPhong}</TableCell>
                  <TableCell>{result.loaiPhongResponse.dienTich} m²</TableCell>
                  <TableCell>
                    {result.loaiPhongResponse.soKhachToiDa} khách
                  </TableCell>
                  <TableCell>
                    {result.loaiPhongResponse.donGia.toLocaleString()} VND
                  </TableCell>
                  <TableCell>{result.danhSachCachChia.soPhongCan}</TableCell>
                  <TableCell>{result.danhSachCachChia.soPhongKhaDung}</TableCell>
                  <TableCell>
                    {result.danhSachCachChia.tongGiaTien.toLocaleString()} VND
                  </TableCell>
                  <TableCell>
                    {result.danhSachCachChia.isContainable ? (
                      <Chip label="Đủ" color="success" size="small" />
                    ) : (
                      <Chip
                        label="Vượt quá sức chứa"
                        color="error"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleCreateBooking(result)}
                      >
                        Đặt ngay
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSelectData(result)}
                      >
                        Chọn
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Không tìm thấy loại phòng nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(e, page) => setCurrentPage(page - 1)}
        />
      </Box>
    </Container>
  );
};

export default DatPhong;
