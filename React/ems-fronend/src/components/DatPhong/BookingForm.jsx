import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./BookingForm.scss"; // Custom CSS nếu cần
import {
  getTimKiemLoaiPhong,
  addThongTinDatPhong,
  deleteThongTinDatPhong,
} from "../../services/TTDP";
import {
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  XoaDatPhong,
  XoaKhachHangDatPhong,
} from "../../services/DatPhong";
const BookingForm = () => {
  // Các state cho tiêu chí tìm kiếm
  const [ngayNhanPhong, setNgayNhanPhong] = useState(
    dayjs().hour(14).minute(0)
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    dayjs().add(1, "day").hour(12).minute(0)
  );
  const [soPhong, setSoPhong] = useState(1);
  const [soNguoi, setSoNguoi] = useState(1);
  // Danh sách loại phòng có sẵn (theo phân trang)
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  // Danh sách các phòng được chọn qua checkbox (dùng nếu cần)
  const [selectedRoomList, setSelectedRoomList] = useState([]);

  // Mảng lưu trữ selectData: chứa thông tin gồm loại phòng được chọn, ngày nhận, ngày trả, số người, số phòng
  const [selectData, setSelectData] = useState([]);

  // Gọi API tìm kiếm loại phòng với phân trang
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
        setCurrentPage(response.data.pageable.pageNumber);
        console.log("Response:", response.data.content);
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

  // Xử lý checkbox: thêm/xóa phòng từ danh sách đã chọn
  const handleCheckboxChange = (event, result) => {
    const roomId = result.loaiPhongResponse.id;
    if (event.target.checked) {
      // Thêm phòng vào danh sách đã chọn (nếu chưa có)
      setSelectedRoomList((prev) => [...prev, result.loaiPhongResponse]);

      // Tạo data theo cấu trúc mong muốn
      const data = {
        selectedRooms: result.loaiPhongResponse,
        ngayNhanPhong: ngayNhanPhong.toISOString(),
        ngayTraPhong: ngayTraPhong.toISOString(),
        soNguoi,
        soPhong,
      };
      // Thêm data vào selectData nếu chưa có
      setSelectData((prev) => [...prev, data]);
    } else {
      // Loại bỏ phòng khỏi danh sách đã chọn
      setSelectedRoomList((prev) => prev.filter((room) => room.id !== roomId));
      // Loại bỏ data tương ứng khỏi selectData
      setSelectData((prev) =>
        prev.filter((dataItem) => dataItem.selectedRooms.id !== roomId)
      );
    }
  };

  // Đặt phòng theo danh sách các phòng được chọn (Bulk Booking)
  const handleBulkBooking = async () => {
    if (selectData.length === 0) {
      alert("Chưa có phòng nào được chọn.");
      return;
    }
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];

    try {
      console.log("selectData:", selectData);
      // Tạo khách hàng mới
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

      // Tạo đặt phòng mới
      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP", // Cần bổ sung thông tin nếu cần
        soNguoi: soNguoi,
        soPhong: soPhong,
        ngayDat: new Date().toISOString(),
        tongTien: 0,
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Cho xu ly",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Tạo thông tin đặt phòng cho từng phòng được chọn
      const thongTinDatPhongRequestList = [];
      console.log("length:", selectData.length);
      selectData.forEach((data) => {
        // Lặp lại theo số phòng (soPhong)
        for (let i = 0; i < data.soPhong; i++) {
          thongTinDatPhongRequestList.push({
            datPhong: datPhongResponse.data,
            idLoaiPhong: data.selectedRooms.id,
            maThongTinDatPhong: "",
            ngayNhanPhong: data.ngayNhanPhong,
            ngayTraPhong: data.ngayTraPhong,
            soNguoi: data.soNguoi,
            giaDat: data.selectedRooms.donGia,
            trangThai: "Chua xac nhan",
          });
        }
      });

      for (const thongTinDatPhong of thongTinDatPhongRequestList) {
        const response = await addThongTinDatPhong(thongTinDatPhong);
        if (!response || !response.data) {
          throw new Error("Không thể tạo thông tin đặt phòng.");
        }
        thongTinDatPhongResponseList.push(response.data);
      }

      // Sau khi thành công, chuyển hướng kèm dữ liệu
      alert("Tạo đặt phòng thành công.");
      navigate("/tao-dat-phong", {
        state: {
          selectData: selectData,
          datPhong: datPhongResponse.data,
          khachHang: khachHangResponse.data,
          thongTinDatPhong: thongTinDatPhongResponseList,
        },
      });
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      // Rollback: nếu có thông tin đặt phòng đã được tạo, xóa chúng
      if (thongTinDatPhongResponseList.length > 0) {
        for (const ttdp of thongTinDatPhongResponseList) {
          try {
            await deleteThongTinDatPhong(ttdp.id);
          } catch (err) {
            console.error("Lỗi khi rollback thongTinDatPhong:", err);
          }
        }
      }
      // Rollback: nếu đặt phòng đã được tạo, xóa nó
      if (datPhongResponse && datPhongResponse.data) {
        try {
          await XoaDatPhong(datPhongResponse.data.id);
        } catch (err) {
          console.error("Lỗi khi rollback datPhong:", err);
        }
      }
      // Rollback: nếu khách hàng đã được tạo, xóa nó
      if (khachHangResponse && khachHangResponse.data) {
        try {
          await XoaKhachHangDatPhong(khachHangResponse.data);
        } catch (err) {
          console.error("Lỗi khi rollback khachHang:", err);
        }
      }
      alert("Đã xảy ra lỗi trong quá trình đặt phòng. Vui lòng thử lại.");
    }
  };

  // Đặt ngay cho từng loại phòng riêng lẻ
  const handleCreateBooking = async (result) => {
    const data = {
      selectedRooms: result.loaiPhongResponse,
      ngayNhanPhong: ngayNhanPhong.toISOString(),
      ngayTraPhong: ngayTraPhong.toISOString(),
      soNguoi,
      soPhong,
    };

    // Khai báo biến bên ngoài để sử dụng trong catch
    let khachHangResponse = null;
    let datPhongResponse = null;

    try {
      // Tạo khách hàng mới
      console.log("selectData:", selectData);
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

      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP", // Bạn có thể bổ sung thông tin mã đặt phòng nếu cần
        soNguoi: soNguoi,
        soPhong: soPhong,
        ngayDat: new Date().toISOString(),
        tongTien: 0,
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Cho xu ly",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Tạo thông tin đặt phòng
      const thongTinDatPhongRequest = {
        datPhong: datPhongResponse.data,
        idLoaiPhong: result.loaiPhongResponse.id, // Sử dụng id của loại phòng từ loaiPhongResponse
        maThongTinDatPhong: "",
        ngayNhanPhong: data.ngayNhanPhong,
        ngayTraPhong: data.ngayTraPhong,
        soNguoi: data.soNguoi,
        giaDat: data.selectedRooms.donGia,
        trangThai: "Chua xac nhan",
      };
      const thongTinDatPhongResponseList = [];
      const response = await addThongTinDatPhong(thongTinDatPhongRequest);
      if (!response || !response.data) {
        throw new Error("Không thể tạo thông tin đặt phòng.");
      }
      thongTinDatPhongResponseList.push(response.data);

      // Sau khi mọi thứ thành công, thông báo và chuyển hướng
      alert("Tạo đặt phòng thành công.");
      console.log("datPhongResponse:", datPhongResponse);
      navigate("/tao-dat-phong", {
        state: {
          selectData: selectData,
          datPhong: datPhongResponse.data,
          khachHang: khachHangResponse.data,
          thongTinDatPhong: thongTinDatPhongResponseList,
        },
      });
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      if (datPhongResponse && datPhongResponse.data) {
        await XoaDatPhong(datPhongResponse.data.id);
      }
      if (khachHangResponse && khachHangResponse.data) {
        await XoaKhachHangDatPhong(khachHangResponse.data);
      }
      alert("Đã xảy ra lỗi trong quá trình đặt phòng. Vui lòng thử lại.");
    }
  };

  // Xử lý nút "Chọn": thêm dữ liệu vào selectData
  const handleSelectData = (result) => {
    const data = {
      selectedRooms: result.loaiPhongResponse,
      ngayNhanPhong: ngayNhanPhong.toISOString(),
      ngayTraPhong: ngayTraPhong.toISOString(),
      soNguoi,
      soPhong,
    };
    setSelectData((prev) => [...prev, data]);
    alert("Đã thêm vào selectData");
  };

  // Xử lý nút "Xóa" một mục trong selectData
  const handleRemoveSelectData = (indexToRemove) => {
    setSelectData((prev) => prev.filter((_, index) => index !== indexToRemove));
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

      {/* Hiển thị các phòng đã được chọn */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Các phòng đã được chọn
        </Typography>
        {selectData.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Loại phòng</TableCell>
                  <TableCell>Ngày nhận phòng</TableCell>
                  <TableCell>Ngày trả phòng</TableCell>
                  <TableCell>Số người</TableCell>
                  <TableCell>Số phòng</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data.selectedRooms.tenLoaiPhong}</TableCell>
                    <TableCell>
                      {dayjs(data.ngayNhanPhong).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(data.ngayTraPhong).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{data.soNguoi}</TableCell>
                    <TableCell>{data.soPhong}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveSelectData(index)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">Chưa có phòng nào được chọn.</Typography>
        )}
      </Box>

      {/* Phân trang & chọn số dòng hiển thị */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
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
              fetchLoaiPhong();
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

      {/* Bảng hiển thị kết quả */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Loại phòng</TableCell>
              <TableCell>Diện tích</TableCell>
              <TableCell>Số khách tối đa</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số phòng cần</TableCell>
              <TableCell>Số phòng khả dụng</TableCell>
              <TableCell>Tổng giá</TableCell>
              <TableCell>Trạng thái</TableCell>
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

export default BookingForm;
