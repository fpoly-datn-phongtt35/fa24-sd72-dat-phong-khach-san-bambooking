import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Pagination,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getTimKiemLoaiPhong } from "../../services/TTDP";
import dayjs from "dayjs";

const ChinhSuaPhongDialog = ({ open, onClose, roomToEdit, onSave }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // State lưu danh sách các phòng được chọn (cho phép chọn nhiều phòng)
  const [selectedRoomsData, setSelectedRoomsData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomSearchCriteria, setRoomSearchCriteria] = useState({
    ngayNhanPhong: dayjs(),
    ngayTraPhong: dayjs().add(1, "day"),
    soNguoi: 1,
    soPhong: 1, // Số phòng nhập ban đầu, mặc định là 1
  });

  // Nếu có roomToEdit (trong trường hợp chỉnh sửa danh sách đã chọn) bạn có thể thiết lập lại state.
  // Ở đây, ví dụ chúng ta không cập nhật selectedRoomsData từ roomToEdit để cho phép người dùng thêm mới.
  useEffect(() => {
    // Nếu muốn load danh sách đã chọn từ roomToEdit, bạn có thể làm như sau:
    // if (roomToEdit && Array.isArray(roomToEdit)) setSelectedRoomsData(roomToEdit);
  }, [roomToEdit]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [roomSearchCriteria, currentPage, pageSize]);

  const fetchAvailableRooms = () => {
    getTimKiemLoaiPhong(
      roomSearchCriteria.ngayNhanPhong.toISOString(),
      roomSearchCriteria.ngayTraPhong.toISOString(),
      roomSearchCriteria.soNguoi,
      roomSearchCriteria.soPhong,
      { page: currentPage, size: pageSize }
    )
      .then((response) => {
        setAvailableRooms(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
        alert("Đã xảy ra lỗi khi tìm phòng.");
      });
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setRoomSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(0);
  };

  // Khi nhấn nút "Chọn" trong bảng kết quả, tạo một object dữ liệu với cấu trúc mong muốn.
  // Nếu phòng đã được chọn, tăng số phòng (soPhong) thêm theo giá trị nhập.
  const handleRoomSelect = (room) => {
    const newSelection = {
      selectedRooms: room.loaiPhongResponse,
      ngayNhanPhong: roomSearchCriteria.ngayNhanPhong.toISOString(),
      ngayTraPhong: roomSearchCriteria.ngayTraPhong.toISOString(),
      soNguoi: roomSearchCriteria.soNguoi,
      soPhong: Number(roomSearchCriteria.soPhong), // chuyển về số
    };

    const index = selectedRoomsData.findIndex(
      (item) => item.selectedRooms.id === newSelection.selectedRooms.id
    );
    if (index >= 0) {
      // Nếu phòng đã được chọn, tăng số phòng thêm 1 (hoặc tăng thêm số từ newSelection.soPhong)
      const updatedData = [...selectedRoomsData];
      updatedData[index] = {
        ...updatedData[index],
        soPhong: updatedData[index].soPhong + newSelection.soPhong,
      };
      setSelectedRoomsData(updatedData);
      console.log("Updated selected room:", updatedData[index]);
    } else {
      // Nếu chưa có, thêm vào danh sách
      setSelectedRoomsData((prev) => [...prev, newSelection]);
      console.log("Added new selected room:", newSelection);
    }
  };

  // Hàm xóa phòng khỏi danh sách đã chọn
  const handleRemoveSelectedRoom = (index) => {
    setSelectedRoomsData((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Khi nhấn "Lưu" trong dialog, trả về mảng các phòng đã chọn qua callback onSave
  const handleSaveEditedRoom = () => {
    if (onSave) {
      onSave(selectedRoomsData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
      <DialogContent>
        {/* Phần tìm kiếm phòng khả dụng */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tìm kiếm phòng khả dụng:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Ngày nhận phòng"
                  value={roomSearchCriteria.ngayNhanPhong}
                  minDate={dayjs()}
                  onChange={(newValue) =>
                    setRoomSearchCriteria((prev) => ({
                      ...prev,
                      ngayNhanPhong: newValue,
                      ngayTraPhong: newValue.isAfter(prev.ngayTraPhong)
                        ? newValue.add(1, "day")
                        : prev.ngayTraPhong,
                    }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Ngày trả phòng"
                  value={roomSearchCriteria.ngayTraPhong}
                  minDate={roomSearchCriteria.ngayNhanPhong}
                  onChange={(newValue) =>
                    setRoomSearchCriteria((prev) => ({
                      ...prev,
                      ngayTraPhong: newValue,
                    }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Số phòng"
                  name="soPhong"
                  type="number"
                  value={roomSearchCriteria.soPhong}
                  onChange={handleSearchInputChange}
                  inputProps={{ min: 1 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Số người"
                  name="soNguoi"
                  type="number"
                  value={roomSearchCriteria.soNguoi}
                  onChange={handleSearchInputChange}
                  inputProps={{ min: 1 }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Box
            sx={{
              mt: 2,
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={fetchAvailableRooms}>
              Tìm phòng
            </Button>
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
                  fetchAvailableRooms();
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

        {/* Hiển thị bảng "Phòng đã chọn" */}
        {selectedRoomsData.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Phòng đã chọn:
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Ngày nhận</TableCell>
                    <TableCell>Ngày trả</TableCell>
                    <TableCell>Số người</TableCell>
                    <TableCell>Số phòng</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRoomsData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.selectedRooms.tenLoaiPhong}</TableCell>
                      <TableCell>
                        {data.selectedRooms.donGia.toLocaleString()} VND
                      </TableCell>
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
                          onClick={() => handleRemoveSelectedRoom(index)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Bảng hiển thị kết quả tìm kiếm */}
        <TableContainer component={Paper}>
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
              {availableRooms && availableRooms.length > 0 ? (
                availableRooms.map((result, index) => (
                  <TableRow key={result.loaiPhongResponse.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {result.loaiPhongResponse.tenLoaiPhong}
                    </TableCell>
                    <TableCell>
                      {result.loaiPhongResponse.dienTich} m²
                    </TableCell>
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
                      {result.danhSachCachChia.isContainable ? (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={() => handleRoomSelect(result)}
                          sx={{ mr: 1 }}
                        >
                          Chọn
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
                  <TableCell colSpan={9} align="center">
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSaveEditedRoom} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChinhSuaPhongDialog;
