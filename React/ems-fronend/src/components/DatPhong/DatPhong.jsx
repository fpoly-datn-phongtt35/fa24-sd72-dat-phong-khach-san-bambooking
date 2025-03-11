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
  Stack,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// Giả sử API trả về danh sách tổ hợp phòng phù hợp (đối tượng Page: content, totalPages, number, …)
// Và các API tạo khách hàng, đặt phòng, thông tin đặt phòng
import {
  toHopLoaiPhong,
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
} from "../../services/DatPhong";
import { addThongTinDatPhong } from "../../services/TTDP";

const DatPhong = () => {
  // Các state cho tiêu chí tìm kiếm
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soNguoi, setSoNguoi] = useState(1);
  const [key, setKey] = useState("");

  // State lưu dữ liệu phân trang trả về từ API
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // pageSize mặc định

  const navigate = useNavigate();

  // Hàm gọi API tìm kiếm loại phòng theo tiêu chí và phân trang
  const handleSearch = async (page = currentPage) => {
    try {
      // Gọi API với tiêu chí: ngày nhận, ngày trả, số người, key.
      const response = await toHopLoaiPhong(
        ngayNhanPhong.format(),
        ngayTraPhong.format(),
        soNguoi,
        key,
        { page: page, size: pageSize }
      );
      console.log("Danh sách tổ hợp phòng:", response.data);
      // API trả về đối tượng: { content, totalPages, pageable: { pageNumber } }
      setLoaiPhongKhaDung(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.pageable.pageNumber);
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      alert("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    handleSearch(0);
  }, [pageSize, ngayNhanPhong, ngayTraPhong, soNguoi, key]);

  // Khi tiêu chí tìm kiếm thay đổi, reset trang về 0
  const handleCriteriaChange = () => {
    handleSearch(0);
  };

  // Xử lý chuyển trang (Pagination trả về trang bắt đầu từ 1)
  const handlePageChange = (e, page) => {
    const newPage = page - 1;
    setCurrentPage(newPage);
    handleSearch(newPage);
  };

  // Hàm tạo đặt phòng dựa theo tổ hợp phòng được chọn
  const handleCreateBooking = async (combination) => {
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];

    try {
      // Bước 1: Tạo khách hàng mới với thông tin trống
      const khachHangRequest = {
        ho: "",
        ten: "",
        email: "",
        sdt: "",
        trangThai: false,
      };
      khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }

      // Bước 2: Tạo đặt phòng mới cho khách hàng. Số phòng của đặt phòng lấy từ combination.tongSoPhong.
      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + new Date().getTime(), // Tạo mã đặt phòng đơn giản
        soNguoi: soNguoi,
        soPhong: combination.tongSoPhong, // Số phòng đặt bằng tổng số phòng của tổ hợp
        ngayDat: new Date().toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: "Đặt phòng từ tổ hợp được chọn",
        trangThai: "Cho xu ly",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Bước 3: Với mỗi loại phòng trong tổ hợp, tạo số bản ghi thông tin đặt phòng bằng số lượng chọn
      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "", // Có thể tạo mã riêng nếu cần
              ngayNhanPhong: ngayNhanPhong.toISOString(),
              ngayTraPhong: ngayTraPhong.toISOString(),
              soNguoi: phong.loaiPhong.soKhachToiDa,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Chua xac nhan",
            };
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            if (!response || !response.data) {
              throw new Error("Không thể tạo thông tin đặt phòng.");
            }
            thongTinDatPhongResponseList.push(response.data);
          }
        }
      }

      alert("Đặt phòng thành công!");
      navigate("/tao-dat-phong", {
        state: {
          combination: combination,
          datPhong: datPhongResponse.data,
          khachHang: khachHangResponse.data,
          thongTinDatPhong: thongTinDatPhongResponseList,
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo đặt phòng:", error);
      alert("Đã xảy ra lỗi khi tạo đặt phòng. Vui lòng thử lại.");
    }
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
          {/* Không cần trường Số phòng trong tìm kiếm */}
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
          <Button variant="contained" color="primary" onClick={() => handleSearch(0)}>
            Tìm kiếm
          </Button>
        </Box>
      </Box>

      {/* Hiển thị danh sách tổ hợp phòng */}
      {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
        loaiPhongKhaDung.map((combination, combIndex) => (
          <Box key={combIndex} mb={4}>
            <Typography variant="h6" gutterBottom>
              Tổ hợp {combIndex + 1}: Tổng sức chứa {combination.tongSucChua} - Tổng chi phí:{" "}
              {Number(combination.tongChiPhi).toLocaleString()} VND - Tổng số phòng:{" "}
              {combination.tongSoPhong}
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
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {combination.phongs.map((phong, idx) => (
                    <TableRow key={phong.loaiPhong.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{phong.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell>{phong.loaiPhong.dienTich} m²</TableCell>
                      <TableCell>{phong.loaiPhong.soKhachToiDa} khách</TableCell>
                      <TableCell>{phong.loaiPhong.donGia.toLocaleString()} VND</TableCell>
                      <TableCell>{phong.soLuongChon}</TableCell>
                      <TableCell>
                        {(phong.soLuongChon * phong.loaiPhong.donGia).toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {/* Mỗi tổ hợp chỉ có 1 nút đặt phòng */}
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleCreateBooking(combination)}
                          >
                            Đặt phòng
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography align="center">Không tìm thấy tổ hợp phòng nào phù hợp.</Typography>
      )}

      {/* Phân trang */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} />
      </Box>
    </Container>
  );
};

export default DatPhong;
