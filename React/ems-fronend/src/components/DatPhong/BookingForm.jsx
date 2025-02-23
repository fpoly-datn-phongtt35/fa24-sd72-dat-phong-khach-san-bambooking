import React, { useState, useEffect } from "react";
import { Select, Option } from "@mui/joy";
import {
  Stack,
  Container,
  Box,
  Typography,
  Table,
  Button,
  Pagination,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./BookingForm.scss"; // Custom CSS nếu cần
import { getTimKiemLoaiPhong } from "../../services/TTDP";

const BookingForm = () => {
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soPhong, setSoPhong] = useState(1);
  const [soNguoi, setSoNguoi] = useState(1);
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  // Fetch danh sách loại phòng khả dụng
  const fetchLoaiPhong = () => {
    getTimKiemLoaiPhong(
      ngayNhanPhong.toISOString(),
      ngayTraPhong.toISOString(),
      soNguoi,
      soPhong,
      { page: currentPage, size: pageSize }
    )
      .then((response) => {
        setLoaiPhongKhaDung(response.data.danhSachLoaiPhong.content);
        console.log(response.data.danhSachLoaiPhong.content);
        setTotalPages(response.data.danhSachLoaiPhong.totalPages);
      })
      .catch((error) => {
        console.error(error);
        alert("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau."); // Thông báo lỗi
      });
  };

  useEffect(() => {
    fetchLoaiPhong(); // Gọi lại API khi pageSize hoặc currentPage thay đổi
  }, [pageSize, currentPage, ngayNhanPhong, ngayTraPhong, soNguoi, soPhong]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset về trang đầu tiên
    fetchLoaiPhong();
  };

  const calculateTotalPrice = (donGia, start, end) => {
    const days = dayjs(end).diff(dayjs(start), "day") || 1; // Ít nhất 1 ngày
    return donGia * days;
  };

  const handleCreateBooking = (room) => {
    console.log(ngayNhanPhong,ngayTraPhong);
    navigate("/tao-dat-phong", {
      state: {
        selectedRooms: [room],
        ngayNhanPhong,
        ngayTraPhong,
        soNguoi,
      },
    });
  };

  return (
    <Container sx={{ minWidth: '1300px' }}>
      <Box
        sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, mb: 3 }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Tìm Kiếm Phòng
        </Typography>

        {/* Form tìm kiếm */}
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
              minDate={dayjs()} // Ngày nhỏ nhất là ngày hiện tại
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
              minDate={ngayNhanPhong} // Ngày nhỏ nhất là ngày nhận phòng
              onChange={(newValue) => {
                setNgayTraPhong(newValue);
              }}
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

          <TextField
            label="Số phòng"
            type="number"
            value={soPhong}
            onChange={(e) => setSoPhong(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1 }}
          />

          <Button variant="contained" color="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Box>
      </Box>
      <Stack
        spacing={1}
        direction="row"
        sx={{
          justifyContent: "right",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography color="neutral" level="title-md" noWrap variant="plain">
          Hiển thị:
        </Typography>
        <Select
          value={pageSize}
          sx={{ width: "70px", height: "40px" }}
          onChange={(event) => {
            const selectedText = event.target.selectedOptions
              ? event.target.selectedOptions[0]?.innerText
              : event.target.innerText;
            console.log("Selected Text:", selectedText); // In ra text từ Option
            const newPageSize = Number(selectedText); // Lấy value của Option
            setPageSize(newPageSize);
            setCurrentPage(0);
            fetchLoaiPhong();
          }}
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </Stack>
      {/* Bảng hiển thị kết quả */}
      <TableContainer sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên loại phòng</TableCell>
              <TableCell>Diện tích (m²)</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Số phòng thực tế</TableCell>
              <TableCell>Số phòng khả dụng</TableCell>
              <TableCell>Đơn giá (VND)</TableCell>
              <TableCell>Thành tiền (VND)</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loaiPhongKhaDung.length > 0 ? (
              loaiPhongKhaDung.map((lp) => (
                <TableRow key={lp.id}>
                  <TableCell>{lp.tenLoaiPhong}</TableCell>
                  <TableCell>{lp.dienTich} m²</TableCell>
                  <TableCell>{lp.soKhachToiDa} khách</TableCell>
                  <TableCell>{lp.soLuongPhong}</TableCell>
                  <TableCell>{lp.soPhongKhaDung}</TableCell>
                  <TableCell>{lp.donGia.toLocaleString()} VND</TableCell>
                  <TableCell>
                    {calculateTotalPrice(
                      lp.donGia,
                      ngayNhanPhong,
                      ngayTraPhong
                    ).toLocaleString()}{" "}
                    VND
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleCreateBooking(lp)}
                    >
                      Đặt ngay
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

export default BookingForm;
