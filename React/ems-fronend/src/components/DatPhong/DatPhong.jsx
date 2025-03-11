import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Giả sử API trả về danh sách tổ hợp phòng phù hợp (trả về đối tượng Page có thuộc tính content, totalPages, number, …)
import { toHopLoaiPhong } from "../../services/DatPhong";

const DatPhong = () => {
  // State cho ngày nhận, ngày trả, số người và key sắp xếp
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soNguoi, setSoNguoi] = useState(1);
  const [key, setKey] = useState("");

  // State lưu dữ liệu phân trang trả về từ API
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0); // Đặt pageSize mặc định khác 0

  // Hàm xử lý tìm kiếm với tham số page (chỉ số bắt đầu từ 0)
  const handleSearch = async (page = currentPage) => {
    try {
      // Gọi API với các tiêu chí: ngày nhận, ngày trả, số người, key và thông tin phân trang
      const response = await toHopLoaiPhong(
        ngayNhanPhong.format(),
        ngayTraPhong.format(),
        soNguoi,
        key,
        { page: page, size: pageSize }
      );
      // Giả sử API trả về đối tượng có cấu trúc: { content: [...], totalPages, number, ... }
      console.log("Danh sách tổ hợp phòng:", response.data);
      setLoaiPhongKhaDung(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
    }
  };

  // Gọi API lần đầu khi component mount
  useEffect(() => {
    handleSearch(0);
  }, []);

  // Xử lý khi thay đổi trang (Pagination trả về page bắt đầu từ 1)
  const handlePageChange = (e, page) => {
    handleSearch(page - 1);
  };

  // Khi thay đổi tiêu chí tìm kiếm (key, ngày nhận/trả, số người) reset về trang đầu tiên
  const handleCriteriaChange = () => {
    handleSearch(0);
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
                handleCriteriaChange();
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="Ngày trả phòng"
              value={ngayTraPhong}
              minDate={ngayNhanPhong}
              onChange={(newValue) => {
                setNgayTraPhong(newValue);
                handleCriteriaChange();
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Số người"
            type="number"
            value={soNguoi}
            onChange={(e) => setSoNguoi(e.target.value)}
            inputProps={{ min: 0 }}
          />
          {/* Select để chọn key sắp xếp tổ hợp phòng */}
          <Select
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              handleCriteriaChange();
            }}
            displayEmpty
            sx={{ minWidth: "150px" }}
          >
            <MenuItem value="">Mặc định</MenuItem>
            <MenuItem value="optimalCost">Chi phí tối ưu</MenuItem>
            <MenuItem value="leastRooms">Số phòng ít</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSearch(0)}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Box>

      {/* Hiển thị danh sách tổ hợp phòng (mỗi tổ hợp là 1 bảng) */}
      {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
        loaiPhongKhaDung.map((combination, combIndex) => (
          <Box key={combIndex} mb={4}>
            <Typography variant="h6" gutterBottom>
              Tổ hợp {combIndex + 1}: Tổng sức chứa {combination.tongSucChua} -
              Tổng chi phí: {Number(combination.tongChiPhi).toLocaleString()}{" "}
              VND - Tổng số phòng: {combination.tongSoPhong}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Diện tích</TableCell>
                    <TableCell>Số khách tối đa</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng chọn</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {combination.phongs.map((phong, index) => (
                    <TableRow key={phong.loaiPhong.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{phong.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell>{phong.loaiPhong.dienTich} m²</TableCell>
                      <TableCell>
                        {phong.loaiPhong.soKhachToiDa} khách
                      </TableCell>
                      <TableCell>
                        {phong.loaiPhong.donGia.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{phong.soLuongChon}</TableCell>
                      <TableCell>
                        {(
                          phong.soLuongChon * phong.loaiPhong.donGia
                        ).toLocaleString()}{" "}
                        VND
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography align="center">
          Không tìm thấy tổ hợp phòng nào phù hợp.
        </Typography>
      )}

      {/* Phân trang */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default DatPhong;
