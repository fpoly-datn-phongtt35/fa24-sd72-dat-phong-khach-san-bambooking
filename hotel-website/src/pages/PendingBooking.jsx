import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  toHopLoaiPhong,
  ThemMoiDatPhong,
  addThongTinDatPhong,
  getKhachHangByUsername,
} from "../services/DatPhong";
import dayjs from "dayjs";
import { Button, TextField, Snackbar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const PendingBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingData, setPendingData] = useState(() => {
    const data = localStorage.getItem("pendingData");
    return data ? JSON.parse(data) : null;
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Xử lý thông báo Snackbar
  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    console.log("PendingData:", pendingData);
  }, [pendingData]);

  const handleCreateBooking = async () => {
    if (!pendingData) {
      handleSnackbar("Không có dữ liệu đặt phòng để xử lý.");
      return;
    }

    const { combination, ngayNhanPhong, ngayTraPhong, soNguoi } = pendingData;

    try {
      // Kiểm tra người dùng đã đăng nhập
      let user;
      try {
        user = (await getKhachHangByUsername(localStorage.getItem("user"))).data;
        console.log("User:", user);
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }

      if (!user) {
        handleSnackbar("Vui lòng đăng nhập để tiếp tục đặt phòng.");
        setTimeout(() => {
          navigate("/login", { state: { from: location.pathname } });
        }, 1000);
        return;
      }

      // Lấy thông tin khách hàng từ API
      let khachHangData;
      try {
        const response = await getKhachHangByUsername(user.email);
        console.log("Khách hàng:", response.data);
        if (!response || !response.data) {
          throw new Error("Không tìm thấy thông tin khách hàng.");
        }
        khachHangData = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        handleSnackbar(
          "Không thể lấy thông tin khách hàng. Vui lòng đăng nhập lại."
        );
        setTimeout(() => {
          navigate("/login", { state: { from: location.pathname } });
        }, 2000);
        return;
      }

      // Tạo đặt phòng
      const datPhongRequest = {
        khachHang: khachHangData,
        maDatPhong: "DP" + new Date().getTime(),
        soNguoi: soNguoi,
        soPhong: combination.tongSoPhong,
        ngayDat: new Date().toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: "Đặt phòng từ tổ hợp được chọn",
        trangThai: "Đang đặt phòng",
      };
      const datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Tạo thông tin đặt phòng
      const thongTinDatPhongResponseList = [];
      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "",
              ngayNhanPhong: dayjs(ngayNhanPhong).format("YYYY-MM-DD"),
              ngayTraPhong: dayjs(ngayTraPhong).format("YYYY-MM-DD"),
              soNguoi: phong.loaiPhong.soKhachToiDa,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Đang đặt phòng",
            };
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            if (!response || !response.data) {
              throw new Error("Không thể tạo thông tin đặt phòng.");
            }
            thongTinDatPhongResponseList.push(response.data);
          }
        }
      }

      // Xóa dữ liệu pendingData khỏi localStorage sau khi đặt phòng thành công
      localStorage.removeItem("pendingData");

      handleSnackbar("Đặt phòng thành công!");
      navigate("/booking-confirmation", {
        state: {
          combination: combination,
          datPhong: datPhongResponse.data,
          khachHang: khachHangData,
          thongTinDatPhong: thongTinDatPhongResponseList,
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo đặt phòng:", error);
      handleSnackbar("Đã xảy ra lỗi khi tạo đặt phòng. Vui lòng thử lại.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="booking-container">
        <div className="results-section">
          <h2>Danh sách tổ hợp phòng</h2>
          {pendingData ? (
            <div className="room-option">
              <div className="room-header">
                <h3>
                  Tổ hợp: {pendingData.combination.tongSucChua} người -{" "}
                  {Number(pendingData.combination.tongChiPhi).toLocaleString()}{" "}
                  VND - {pendingData.combination.tongSoPhong} phòng
                </h3>
                <Button
                  variant="contained"
                  color="success"
                  className="book-btn"
                  onClick={handleCreateBooking}
                >
                  Đặt phòng
                </Button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Loại phòng</th>
                    <th>Diện tích</th>
                    <th>Số khách</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingData.combination.phongs.map((phong, idx) => (
                    <tr key={phong.loaiPhong.id}>
                      <td>{idx + 1}</td>
                      <td>{phong.loaiPhong.tenLoaiPhong}</td>
                      <td>{phong.loaiPhong.dienTich} m²</td>
                      <td>{phong.loaiPhong.soKhachToiDa}</td>
                      <td>{phong.loaiPhong.donGia.toLocaleString()} VND</td>
                      <td>{phong.soLuongChon}</td>
                      <td>
                        {(
                          phong.soLuongChon * phong.loaiPhong.donGia
                        ).toLocaleString()}{" "}
                        VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results">
              Không tìm thấy tổ hợp phòng nào phù hợp.
            </p>
          )}
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </div>
    </LocalizationProvider>
  );
};

export default PendingBooking;
