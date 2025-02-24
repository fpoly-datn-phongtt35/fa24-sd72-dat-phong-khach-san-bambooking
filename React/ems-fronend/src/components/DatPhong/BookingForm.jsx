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
  Chip,
  Checkbox,
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
  // Đây là danh sách loại phòng có sẵn theo phân trang
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  // State chứa danh sách các phòng được chọn qua checkbox
  const [selectedRoomList, setSelectedRoomList] = useState([]);

  // Hàm gọi API với phân trang sử dụng đối tượng pageable { page, size }
  const fetchLoaiPhong = () => {
    getTimKiemLoaiPhong(
      ngayNhanPhong.toISOString(),
      ngayTraPhong.toISOString(),
      soNguoi,
      soPhong,
      { page: currentPage, size: pageSize }
    )
      .then((response) => {
        setLoaiPhongKhaDung(response.data.content);
        setTotalPages(response.data.totalPages);
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    fetchLoaiPhong();
  }, [pageSize, currentPage, ngayNhanPhong, ngayTraPhong, soNguoi, soPhong]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchLoaiPhong();
  };

  const calculateTotalPrice = (donGia, start, end) => {
    const days = dayjs(end).diff(dayjs(start), "day") || 1; // Ít nhất 1 ngày
    return donGia * days;
  };

  // Khi người dùng tích checkbox tại một hàng
  const handleCheckboxChange = (event, result) => {
    const roomId = result.loaiPhongResponse.id;
    if (event.target.checked) {
      setSelectedRoomList((prev) => [...prev, result.loaiPhongResponse]);
    } else {
      setSelectedRoomList((prev) =>
        prev.filter((room) => room.id !== roomId)
      );
    }
  };

  // Xử lý đặt phòng theo danh sách các phòng đã chọn (Bulk Booking)
  const handleBulkBooking = () => {
    if (selectedRoomList.length === 0) {
      alert("Vui lòng chọn ít nhất một loại phòng để đặt.");
      return;
    }
    navigate("/tao-dat-phong", {
      state: {
        selectedRooms: selectedRoomList,
        ngayNhanPhong,
        ngayTraPhong,
        soNguoi,
        soPhong,
      },
    });
  };

  // Hàm đặt ngay cho từng hàng (đặt riêng một loại phòng)
  const handleCreateBooking = (result) => {
    navigate("/tao-dat-phong", {
      state: {
        selectedRooms: [result.loaiPhongResponse],
        ngayNhanPhong,
        ngayTraPhong,
        soNguoi,
        soPhong,
      },
    });
  };

  return (
    <Container sx={{ minWidth: "1300px" }}>
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
      {/* Nút đặt phòng cho các phòng đã chọn */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "left" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBulkBooking}
        >
          Đặt phòng
        </Button>
      </Box>
      {/* Bảng hiển thị kết quả */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* Cột Checkbox */}
              <TableCell padding="checkbox"></TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Loại phòng</TableCell>
              <TableCell>Diện tích</TableCell>
              <TableCell>Số khách tối đa</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số phòng cần</TableCell>
              <TableCell>Tổng giá</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
              loaiPhongKhaDung.map((result, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRoomList.some(
                        (room) => room.id === result.loaiPhongResponse.id
                      )}
                      onChange={(e) => handleCheckboxChange(e, result)}
                      disabled={!result.danhSachCachChia.isContainable}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.loaiPhongResponse.tenLoaiPhong}</TableCell>
                  <TableCell>{result.loaiPhongResponse.dienTich} m²</TableCell>
                  <TableCell>
                    {result.loaiPhongResponse.soKhachToiDa} khách
                  </TableCell>
                  <TableCell>
                    {result.loaiPhongResponse.donGia.toLocaleString()} VND
                  </TableCell>
                  <TableCell>
                    {result.danhSachCachChia.soPhongCan}
                  </TableCell>
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
                    {result.danhSachCachChia.isContainable ? (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleCreateBooking(result)}
                      >
                        Đặt ngay
                      </Button>
                    ) : (
                      <Typography variant="body2" color="error">
                        Không đặt được
                      </Typography>
                    )}
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

export default BookingForm;
