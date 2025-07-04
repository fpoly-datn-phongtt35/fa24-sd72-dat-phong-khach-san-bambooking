import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Swal from "sweetalert2";
import { HuyDP, getDatPhongByID } from "../services/DatPhong";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const PendingBooking = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const updateBookingIds = (bookingId) => {
    try {
      const existingIds = JSON.parse(
        localStorage.getItem("booking_ids") || "[]"
      );
      const updatedIds = existingIds.filter((id) => id !== bookingId);
      localStorage.setItem("booking_ids", JSON.stringify(updatedIds));
      console.debug(`Đã xóa booking ID ${bookingId} khỏi booking_ids`);
    } catch (error) {
      console.error("Lỗi khi cập nhật booking_ids:", error);
    }
  };

  const fetchPendingBookings = async () => {
    let bookingIds = [];
    try {
      bookingIds = JSON.parse(localStorage.getItem("booking_ids") || "[]");
    } catch (error) {
      console.error("Lỗi khi parse booking_ids từ localStorage:", error);
      localStorage.setItem("booking_ids", "[]");
    }

    if (!bookingIds.length) {
      setPendingBookings([]);
      handleSnackbar("Không có đơn đặt phòng nào đang chờ xác nhận.");
      return;
    }

    const validBookings = [];
    for (const id of bookingIds) {
      try {
        // Gọi API để lấy dữ liệu từ server
        const response = await getDatPhongByID(id);
        if (!response?.data) {
          console.warn(`Không tìm thấy đặt phòng ${id} trên server`);
          await HuyDP(id).catch((err) =>
            console.error(`Lỗi khi hủy đơn ${id}:`, err)
          );
          updateBookingIds(id);
          handleSnackbar(`Đơn đặt phòng ${id} không tồn tại và đã được xóa.`);
          continue;
        }

        const serverData = response.data;
        // Chỉ thêm đơn có trạng thái "Đang đặt phòng"
        if (serverData.trangThai === "Đang đặt phòng") {
          validBookings.push({
            id,
            datPhong: serverData,
          });
        } else {
          console.debug(
            `Bỏ qua đơn ${id} do trạng thái không phải 'Đang đặt phòng': ${serverData.trangThai}`
          );
          updateBookingIds(id);
        }

        console.debug(
          `Booking ${id}: maDatPhong=${serverData.maDatPhong}, ngayDat=${serverData.ngayDat}`
        );
      } catch (error) {
        console.error(`Lỗi khi xử lý booking ${id}:`, error);
        handleSnackbar(`Lỗi khi xử lý đơn ${id}. Vui lòng thử lại.`);
      }
    }

    setPendingBookings(validBookings);

    if (validBookings.length === 0 && bookingIds.length > 0) {
      handleSnackbar("Không có đơn đặt phòng nào đang chờ xác nhận.");
    }
  };

  const handleContinueBooking = (booking) => {
    navigate("/booking-confirmation", {
      state: { datPhong: booking.datPhong },
    });
  };

  const handleCancelBooking = async (booking) => {
    const iddp = booking.datPhong?.id;
    const maDatPhong = booking.datPhong?.maDatPhong || iddp;

    Swal.fire({
      icon: "warning",
      title: "Xác nhận hủy đơn",
      text: `Bạn có chắc chắn muốn hủy đơn đặt phòng ${maDatPhong}?`,
      showCancelButton: true,
      confirmButtonText: "Hủy",
      cancelButtonText: "Không",
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#1976d2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (iddp) {
            await HuyDP(iddp);
            updateBookingIds(iddp);
            setPendingBookings((prev) => prev.filter((b) => b.id !== iddp));
            handleSnackbar(`Đơn đặt phòng ${maDatPhong} đã được hủy.`);
          } else {
            console.warn(`Không tìm thấy iddp cho booking ${booking.id}`);
            handleSnackbar("Lỗi: Không tìm thấy mã đặt phòng.");
          }
        } catch (error) {
          console.error(`Lỗi khi hủy đơn ${iddp}:`, error);
          handleSnackbar(`Lỗi khi hủy đơn ${maDatPhong}. Vui lòng thử lại.`);
        }
      }
    });
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  return (
    <Box
      className="booking-container"
      sx={{ maxWidth: 1200, mx: "auto", p: 3 }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Danh Sách Đơn Đặt Phòng Chưa Xác Nhận
      </Typography>
      {pendingBookings.length > 0 ? (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="pending bookings table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Mã Đặt Phòng</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày Đặt</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tổng Chi Phí</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số Phòng</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số Người</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số Trẻ Em</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingBookings.map((booking, index) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{booking.datPhong.maDatPhong}</TableCell>
                  <TableCell>
                    {dayjs
                      .tz(booking.datPhong.ngayDat, "Asia/Ho_Chi_Minh")
                      .format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {Number(booking.datPhong.tongTien).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                  <TableCell>{booking.datPhong.soPhong}</TableCell>
                  <TableCell>{booking.datPhong.soNguoi}</TableCell>
                  <TableCell>{booking.datPhong.soTre}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleContinueBooking(booking)}
                      sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                    >
                      Tiếp tục
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Hủy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          align="center"
          variant="h6"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Không tìm thấy đơn đặt phòng nào đang chờ xác nhận.
        </Typography>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default PendingBooking;