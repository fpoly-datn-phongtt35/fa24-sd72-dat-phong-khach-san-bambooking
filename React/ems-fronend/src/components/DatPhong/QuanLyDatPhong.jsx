import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Popper,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"; // Icon cho nút Xếp Phòng
import { useNavigate } from "react-router-dom";
import { findTTDPS, huyTTDP } from "../../services/TTDP";
import XepPhong from "../XepPhong/XepPhong";
import Checkin from "../Checkin/Checkin"; // Import modal Checkin
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";

function QuanLyDatPhong() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("Chua xep");
  const [searchKey, setSearchKey] = useState("");
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [phongData, setPhongData] = useState({});
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const startDateAnchorRef = useRef(null);
  const endDateAnchorRef = useRef(null);

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setPhongData((prev) => ({
          ...prev,
          [maThongTinDatPhong]: response.data.phong,
        }));
      })
      .catch((error) => console.error("Lỗi khi lấy phòng:", error));
  };

  const fetchThongTinDatPhong = (status, page = 0) => {
    findTTDPS(
      selectedStartDate ? selectedStartDate.format("YYYY-MM-DD") : "",
      selectedEndDate ? selectedEndDate.format("YYYY-MM-DD") : "",
      searchKey,
      status,
      { page, size: 5 }
    )
      .then((response) => {
        setThongTinDatPhong(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page); // Cập nhật lại trang hiện tại sau mỗi lần gọi API
        if (["Da xep", "Dang o", "Da tra phong"].includes(status)) {
          response.data.content.forEach((ttdp) => {
            fetchPhongDaXep(ttdp.maThongTinDatPhong);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Thiết lập interval để gọi fetchThongTinDatPhong mỗi 5 giây
    const intervalId = setInterval(() => {
      fetchThongTinDatPhong(currentStatus, currentPage);
    }, 5000);

    // Xóa interval khi component unmount hoặc khi dependency thay đổi
    return () => clearInterval(intervalId);
  }, [
    currentStatus,
    currentPage,
    selectedStartDate,
    selectedEndDate,
    searchKey,
  ]);

  const toggleStartDatePicker = () => setOpenStartDatePicker((prev) => !prev);
  const toggleEndDatePicker = () => setOpenEndDatePicker((prev) => !prev);

  const handleDateChange = (newDate, setDate, closePopper) => {
    setDate(newDate);
    closePopper(false);
  };

  const handleStatusChange = (status) => {
    setCurrentPage(0);
    setCurrentStatus(status);
    fetchThongTinDatPhong(status, 0);
  };

  const handleViewDetails = (maDatPhong) => {
    navigate("/thong-tin-dat-phong", { state: { maDatPhong } });
  };

  const handleViewDetailsTTDPTTDP = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const handleAssign = () => {
    if (selectedTTDPs.length === 0) {
      alert("Vui lòng chọn ít nhất một thông tin đặt phòng để xếp phòng.");
      return;
    }
    setShowXepPhongModal(true);
  };

  // Danh sách trạng thái đặt phòng
  const statuses = [
    { label: "Chưa xếp", value: "Chua xep" },
    { label: "Đã xếp", value: "Da xep" },
    { label: "Đang ở", value: "Dang o" },
    { label: "Đã trả phòng", value: "Da tra phong" },
    { label: "Đã hủy", value: "Da huy" },
  ];

  const selectedCheckbox = (ttdp) => {
    setSelectedTTDPs((prev) => {
      const exists = prev.some((item) => item.id === ttdp.id);
      if (exists) {
        return prev.filter((item) => item.id !== ttdp.id);
      } else {
        return [...prev, ttdp];
      }
    });
  };

  const handleCheckin = async (thongTinDatPhong) => {
    console.log(thongTinDatPhong);
    try {
      let xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
      console.log("Phòng trước khi check-in:", xepPhong);

      if (!xepPhong) {
        alert("Không tìm thấy phòng đã xếp.");
        return;
      }

      const loaiPhong = xepPhong.phong.loaiPhong;
      console.log("Loại phòng: ", loaiPhong);

      const xepPhongRequest = {
        id: xepPhong.id,
        phong: xepPhong.phong,
        thongTinDatPhong: xepPhong.thongTinDatPhong,
        ngayNhanPhong: new Date(),
        ngayTraPhong: new Date(new Date(thongTinDatPhong.ngayTraPhong).setHours(12, 0, 0, 0)),
        trangThai: xepPhong.trangThai,
      };
      console.log("Đang thực hiện check-in với:", xepPhongRequest);
      await checkIn(xepPhongRequest);
      alert("Check-in thành công!");

      xepPhong = (await phongDaXep(thongTinDatPhong.maThongTinDatPhong)).data;
      console.log("Phòng sau khi check-in:", xepPhong);

      const ngayNhanPhongXepPhong = new Date(xepPhong.ngayNhanPhong);
      console.log("Ngày nhận phòng sau cập nhật:", ngayNhanPhongXepPhong);
      const ngayTraPhongXepPhong = new Date(xepPhong.ngayTraPhong);
      console.log("Ngày trả phòng sau cập nhật:", ngayTraPhongXepPhong);

      const gio14Chieu = new Date(ngayNhanPhongXepPhong);
      gio14Chieu.setHours(14, 0, 0, 0);

      if (ngayNhanPhongXepPhong < gio14Chieu) {
        const phuThuRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: "Phụ thu do nhận phòng sớm",
          tienPhuThu: 50000,
          soLuong: 1,
          trangThai: true,
        };
        console.log("Đang thêm phụ thu:", phuThuRequest);
        const phuThuResponse = await ThemPhuThu(phuThuRequest);
        console.log("Phụ thu được thêm:", phuThuResponse.data);
        alert("Phụ thu do nhận phòng sớm đã được thêm.");
      } else {
        console.log("Không cần phụ thu: nhận phòng sau 14h.");
      }

      if (thongTinDatPhong.soNguoi > loaiPhong.soKhachToiDa) {
        const soNguoiVuot = thongTinDatPhong.soNguoi - loaiPhong.soKhachToiDa;
        const tienPhuThuThem = soNguoiVuot * loaiPhong.donGiaPhuThu;
        const phuThuThemRequest = {
          xepPhong: { id: xepPhong.id },
          tenPhuThu: `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người)`,
          tienPhuThu: tienPhuThuThem,
          soLuong: 1,
          trangThai: true,
        };
        console.log("Đang thêm phụ thu do vượt số khách tối đa:", phuThuThemRequest);
        const phuThuThemResponse = await ThemPhuThu(phuThuThemRequest);
        console.log("Phụ thu do vượt số khách tối đa đã được thêm:", phuThuThemResponse.data);
        alert(`Phụ thu do vượt số khách tối đa (${soNguoiVuot} người) đã được thêm.`);
      }
    } catch (error) {
      console.error("Lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng kiểm tra lại.");
    }
    fetchThongTinDatPhong(currentStatus, currentPage);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);  // Cập nhật lại trang hiện tại khi người dùng chuyển trang
    fetchThongTinDatPhong(currentStatus, value - 1);  // Lấy dữ liệu cho trang mới
  };

  return (
    <Container sx={{ minWidth: "1300px" }}>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Quản Lý Đặt Phòng
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            sx={{ flex: 0.8 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                ref={startDateAnchorRef}
                style={{ position: "relative", flex: 1.2 }}
              >
                <Button
                  variant="outlined"
                  onClick={toggleStartDatePicker}
                  endIcon={<CalendarMonthIcon />}
                  style={{
                    width: "180px",
                    border: "1px solid black",
                    color: "black",
                  }}
                >
                  {selectedStartDate
                    ? selectedStartDate.format("DD/MM/YYYY")
                    : "Ngày bắt đầu"}
                </Button>
                <Popper
                  open={openStartDatePicker}
                  anchorEl={startDateAnchorRef.current}
                  placement="bottom-start"
                  style={{ zIndex: 20 }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <DateCalendar
                      value={selectedStartDate}
                      onChange={(newDate) =>
                        handleDateChange(
                          newDate,
                          setSelectedStartDate,
                          setOpenStartDatePicker
                        )
                      }
                    />
                  </div>
                </Popper>
              </div>

              <div
                ref={endDateAnchorRef}
                style={{ position: "relative", flex: 1.2 }}
              >
                <Button
                  variant="outlined"
                  onClick={toggleEndDatePicker}
                  endIcon={<CalendarMonthIcon />}
                  style={{
                    width: "180px",
                    border: "1px solid black",
                    color: "black",
                  }}
                >
                  {selectedEndDate
                    ? selectedEndDate.format("DD/MM/YYYY")
                    : "Ngày kết thúc"}
                </Button>
                <Popper
                  open={openEndDatePicker}
                  anchorEl={endDateAnchorRef.current}
                  placement="bottom-start"
                  style={{ zIndex: 20 }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <DateCalendar
                      value={selectedEndDate}
                      onChange={(newDate) =>
                        handleDateChange(
                          newDate,
                          setSelectedEndDate,
                          setOpenEndDatePicker
                        )
                      }
                    />
                  </div>
                </Popper>
              </div>
            </div>
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={() => fetchThongTinDatPhong(currentStatus, 0)}
            sx={{ width: "150px" }}
          >
            Lọc
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant={currentStatus === status.value ? "contained" : "outlined"}
              onClick={() => handleStatusChange(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chọn</TableCell>
                <TableCell>Mã Đặt Phòng</TableCell>
                <TableCell>Thông Tin Đặt Phòng</TableCell>
                <TableCell>Khách Hàng</TableCell>
                <TableCell>Số Người</TableCell>
                <TableCell>
                  {["Da xep", "Dang o", "Da tra phong"].includes(currentStatus)
                    ? "Phòng"
                    : "Loại Phòng"}
                </TableCell>
                <TableCell>Ngày Nhận</TableCell>
                <TableCell>Ngày Trả</TableCell>
                <TableCell>Tiền Phòng</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {thongTinDatPhong.length > 0 ? (
                thongTinDatPhong.map((ttdp) => (
                  <TableRow key={ttdp.maThongTinDatPhong}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTTDPs.some(
                          (item) => item.id === ttdp.id
                        )}
                        onChange={() => selectedCheckbox(ttdp)}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleViewDetails(ttdp.maDatPhong)}
                      >
                        {ttdp.maDatPhong}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "blue", cursor: "pointer" }}
                        onClick={() =>
                          handleViewDetailsTTDPTTDP(ttdp.maThongTinDatPhong)
                        }
                      >
                        {ttdp.maThongTinDatPhong}
                      </Typography>
                    </TableCell>
                    <TableCell>{ttdp.tenKhachHang}</TableCell>
                    <TableCell>{ttdp.soNguoi}</TableCell>
                    <TableCell>
                      {["Da xep", "Dang o", "Da tra phong"].includes(
                        currentStatus
                      )
                        ? phongData[ttdp.maThongTinDatPhong]?.tenPhong ||
                          "Đang tải..."
                        : ttdp.loaiPhong.tenLoaiPhong}
                    </TableCell>
                    <TableCell>{ttdp.ngayNhanPhong}</TableCell>
                    <TableCell>{ttdp.ngayTraPhong}</TableCell>
                    <TableCell>{ttdp.donGia.toLocaleString()} VND</TableCell>
                    <TableCell>
                      {/* Nút hủy đặt phòng */}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          huyTTDP(ttdp.maThongTinDatPhong).then(() =>
                            fetchThongTinDatPhong(currentStatus, currentPage)
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                      {/* Nút checkin */}
                      {currentStatus === "Da xep" && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCheckin(ttdp)
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}

                      {/* Nút xếp phòng */}
                      {currentStatus === "Chua xep" && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTTDPs([ttdp]);
                            setShowXepPhongModal(true);
                          }}
                        >
                          <MeetingRoomIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      {/* Modal Xếp Phòng */}
      <XepPhong
        show={showXepPhongModal}
        handleClose={() => setShowXepPhongModal(false)}
        selectedTTDPs={selectedTTDPs}
      />
    </Container>
  );
}

export default QuanLyDatPhong;
