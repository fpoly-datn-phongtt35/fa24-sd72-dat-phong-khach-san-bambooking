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
} from "@mui/material";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { HuyDP } from "../services/DatPhong";

const PendingBooking = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const TIMEOUT_DURATION = 300000; // 5 phút (300 giây)

  // Xử lý thông báo Snackbar
  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Lấy danh sách các đơn đặt phòng từ localStorage và dọn dẹp các đơn hết hạn
  const fetchPendingBookings = async () => {
    const bookingKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("booking_data_")
    );

    const validBookings = [];
    for (const key of bookingKeys) {
      const data = JSON.parse(localStorage.getItem(key));
      const timeoutKey = key.replace("booking_data_", "booking_timeout_");
      const startTime = parseInt(localStorage.getItem(timeoutKey) || "0", 10);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = TIMEOUT_DURATION - elapsedTime;

      if (remainingTime > 0 && data) {
        validBookings.push({
          key,
          timeoutKey,
          data,
          remainingTime: Math.floor(remainingTime / 1000),
        });
      } else if (data?.datPhong?.id) {
        // Hủy đơn trên server nếu có datPhong.id
        try {
          await HuyDP(data.datPhong.id);
          localStorage.removeItem(key);
          localStorage.removeItem(timeoutKey);
        } catch (error) {
          console.error("Lỗi khi hủy đơn đặt phòng:", error);
        }
      } else {
        // Xóa dữ liệu localStorage nếu không có datPhong.id
        localStorage.removeItem(key);
        localStorage.removeItem(timeoutKey);
      }
    }

    setPendingBookings(validBookings);

    if (validBookings.length === 0) {
      handleSnackbar("Không có đơn đặt phòng nào đang chờ xác nhận.");
    }
  };

  // Định dạng thời gian còn lại
  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Xử lý tiếp tục xác nhận đơn đặt phòng
  const handleContinueBooking = (booking) => {
    navigate("/booking-confirmation", { state: booking.data });
  };

  // Xóa đơn đặt phòng
  const handleCancelBooking = async (booking) => {
    console.log(booking.data)
    const iddp = booking.data?.datPhong?.id;
    Swal.fire({
      icon: "warning",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy đơn đặt phòng này?",
      showCancelButton: true,
      confirmButtonText: "Hủy",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(booking.key);
        localStorage.removeItem(booking.timeoutKey);
        setPendingBookings((prev) => prev.filter((b) => b.key !== booking.key));
        if (iddp) {
          try {
            await HuyDP(iddp);
            handleSnackbar("Đơn đặt phòng đã được hủy.");
          } catch (error) {
            console.error("Lỗi khi hủy đơn đặt phòng:", error);
            handleSnackbar("Lỗi khi hủy đơn đặt phòng. Vui lòng thử lại.");
          }
        } else {
          handleSnackbar("Đơn đặt phòng đã được hủy.");
        }
      }
    });
  };

  useEffect(() => {
    fetchPendingBookings();
    // Cập nhật danh sách định kỳ để kiểm tra timeout
    const intervalId = setInterval(fetchPendingBookings, 10000); // Kiểm tra mỗi 10 giây
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="booking-container">
      <div className="results-section">
        <Typography variant="h4" align="center" gutterBottom>
          Danh Sách Đơn Đặt Phòng Chưa Xác Nhận
        </Typography>
        {pendingBookings.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Mã Đặt Phòng</TableCell>
                  <TableCell>Ngày Đặt</TableCell>
                  <TableCell>Tổng Chi Phí</TableCell>
                  <TableCell>Số Phòng</TableCell>
                  <TableCell>Số Người</TableCell>
                  <TableCell>Thời Gian Còn Lại</TableCell>
                  <TableCell>Loại Phòng</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingBookings.map((booking, index) => (
                  <TableRow key={booking.key}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.data.datPhong.maDatPhong}</TableCell>
                    <TableCell>
                      {dayjs(booking.data.datPhong.ngayDat).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </TableCell>
                    <TableCell>
                      {Number(
                        booking.data.combination.tongChiPhi
                      ).toLocaleString()}{" "}
                      VND
                    </TableCell>
                    <TableCell>
                      {booking.data.combination.tongSoPhong}
                    </TableCell>
                    <TableCell>
                      {booking.data.combination.tongSucChua}
                    </TableCell>
                    <TableCell>
                      {formatTimeLeft(booking.remainingTime)}
                    </TableCell>
                    <TableCell>
                      {booking.data.combination.phongs.map((phong) => (
                        <div key={phong.loaiPhong.id}>
                          {phong.loaiPhong.tenLoaiPhong} ({phong.soLuongChon}{" "}
                          phòng)
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleContinueBooking(booking)}
                        sx={{ mr: 1 }}
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
          <Typography align="center" className="no-results">
            Không tìm thấy đơn đặt phòng nào đang chờ xác nhận.
          </Typography>
        )}
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default PendingBooking;