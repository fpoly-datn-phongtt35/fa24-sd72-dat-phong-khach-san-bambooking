import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  toHopLoaiPhong,
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  addThongTinDatPhong,
} from "../services/DatPhong";
import dayjs from "dayjs";
import { Button, TextField, Snackbar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const HotelBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // State cho form chính
  const [ngayNhanPhong, setNgayNhanPhong] = useState(
    location.state?.ngayNhanPhong
      ? dayjs(location.state.ngayNhanPhong)
      : dayjs()
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    location.state?.ngayTraPhong
      ? dayjs(location.state.ngayTraPhong)
      : dayjs().add(1, "day")
  );
  const [soNguoi, setSoNguoi] = useState(location.state?.soNguoi || 1);

  // State cho bộ lọc nâng cao
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tongChiPhiMin, setTongChiPhiMin] = useState("");
  const [tongChiPhiMax, setTongChiPhiMax] = useState("");
  const [tongSucChuaMin, setTongSucChuaMin] = useState("");
  const [tongSucChuaMax, setTongSucChuaMax] = useState("");
  const [tongSoPhongMin, setTongSoPhongMin] = useState("");
  const [tongSoPhongMax, setTongSoPhongMax] = useState("");
  const [key, setKey] = useState("");
  
  // State cho Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Xử lý thông báo Snackbar
  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Xử lý thay đổi số người qua nút
  const handleAdultChange = (change) => {
    setSoNguoi((prev) => Math.max(1, prev + change));
  };

  // Xử lý thay đổi số người qua input
  const handleSoNguoiChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 1)) {
      setSoNguoi(value === "" ? 1 : parseInt(value));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Kiểm tra ngày hợp lệ trước khi gọi API
    if (
      !ngayNhanPhong ||
      !ngayTraPhong ||
      !ngayNhanPhong.isValid() ||
      !ngayTraPhong.isValid()
    ) {
      handleSnackbar("Vui lòng chọn ngày nhận và trả phòng hợp lệ.");
      return;
    }

    const ngayNhanPhongFormatted = ngayNhanPhong
      .hour(12)
      .minute(0)
      .second(0)
      .toISOString();
    const ngayTraPhongFormatted = ngayTraPhong
      .hour(14)
      .minute(0)
      .second(0)
      .toISOString();

    const pageable = { page: currentPage, size: pageSize };

    try {
      const response = await toHopLoaiPhong(
        ngayNhanPhongFormatted,
        ngayTraPhongFormatted,
        soNguoi,
        key || null,
        tongChiPhiMin || null,
        tongChiPhiMax || null,
        tongSucChuaMin || null,
        tongSucChuaMax || null,
        tongSoPhongMin || null,
        tongSoPhongMax || null,
        [],
        pageable
      );

      setLoaiPhongKhaDung(response.content || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.number || 0);
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      handleSnackbar("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (
      ngayNhanPhong &&
      ngayTraPhong &&
      soNguoi &&
      ngayNhanPhong.isValid() &&
      ngayTraPhong.isValid()
    ) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [currentPage, ngayNhanPhong, ngayTraPhong, soNguoi]);

  const handleCreateBooking = async (combination) => {
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];
    try {
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
        maDatPhong: "DP" + new Date().getTime(),
        soNguoi: soNguoi,
        soPhong: combination.tongSoPhong,
        ngayDat: new Date().toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: "Đặt phòng từ tổ hợp được chọn",
        trangThai: "Đang đặt phòng",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "",
              ngayNhanPhong: ngayNhanPhong.format("YYYY-MM-DD"),
              ngayTraPhong: ngayTraPhong.format("YYYY-MM-DD"),
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
      handleSnackbar("Đặt phòng thành công!");
      navigate("/booking-confirmation", {
        state: {
          combination: combination,
          datPhong: datPhongResponse.data,
          khachHang: khachHangResponse.data,
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
        {/* Header */}
        <div className="booking-header">
          <h1>Đặt Phòng Khách Sạn</h1>
          <p>Tìm kiếm phòng nhanh chóng với giá tốt nhất</p>
        </div>

        {/* Form */}
        <form className="booking-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày nhận phòng (12:00)</label>
              <DatePicker
                value={ngayNhanPhong}
                minDate={dayjs()} // Không cho chọn ngày quá khứ
                onChange={(newValue) => {
                  if (newValue && dayjs(newValue).isValid()) {
                    const newCheckInDate = dayjs(newValue);
                    setNgayNhanPhong(newCheckInDate);
                    // Nếu ngày nhận phòng bằng hoặc sau ngày trả phòng, cập nhật ngày trả phòng
                    if (
                      newCheckInDate.isSame(ngayTraPhong, "day") ||
                      newCheckInDate.isAfter(ngayTraPhong)
                    ) {
                      setNgayTraPhong(newCheckInDate.add(1, "day"));
                    }
                  } else {
                    setNgayNhanPhong(null); // Cho phép xóa ngày
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    required: true,
                  },
                }}
              />
            </div>
            <div className="form-group">
              <label>Ngày trả phòng (14:00)</label>
              <DatePicker
                value={ngayTraPhong}
                minDate={
                  ngayNhanPhong
                    ? ngayNhanPhong.add(1, "day")
                    : dayjs().add(1, "day")
                } // Đảm bảo ngày trả phòng sau ngày nhận phòng
                onChange={(newValue) => {
                  if (newValue && dayjs(newValue).isValid()) {
                    setNgayTraPhong(dayjs(newValue));
                  } else {
                    setNgayTraPhong(null); // Cho phép xóa ngày
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    required: true,
                  },
                }}
              />
            </div>
            <div className="form-group guest-group">
              <label>Số người</label>
              <div className="guest-counter">
                <Button
                  type="button"
                  onClick={() => handleAdultChange(-1)}
                  variant="outlined"
                  size="small"
                >
                  -
                </Button>
                <TextField
                  type="number"
                  value={soNguoi}
                  onChange={handleSoNguoiChange}
                  inputProps={{ min: 1 }}
                  size="small"
                  className="so-nguoi-input"
                />
                <Button
                  type="button"
                  onClick={() => handleAdultChange(1)}
                  variant="outlined"
                  size="small"
                >
                  +
                </Button>
              </div>
            </div>
            <Button type="submit" variant="contained" className="search-btn">
              Tìm kiếm
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters">
            <Button
              type="button"
              className="toggle-filters"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
            </Button>
            {showAdvancedFilters && (
              <div className="filter-grid">
                <div className="form-group">
                  <label>Tổng chi phí tối thiểu (VND)</label>
                  <TextField
                    type="number"
                    value={tongChiPhiMin}
                    onChange={(e) => setTongChiPhiMin(e.target.value)}
                    inputProps={{ min: 0 }}
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="form-group">
                  <label>Tổng chi phí tối đa (VND)</label>
                  <TextField
                    type="number"
                    value={tongChiPhiMax}
                    onChange={(e) => setTongChiPhiMax(e.target.value)}
                    inputProps={{ min: 0 }}
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="form-group">
                  <label>Tổng sức chứa tối thiểu</label>
                  <TextField
                    type="number"
                    value={tongSucChuaMin}
                    onChange={(e) => setTongSucChuaMin(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="form-group">
                  <label>Tổng sức chứa tối đa</label>
                  <TextField
                    type="number"
                    value={tongSucChuaMax}
                    onChange={(e) => setTongSucChuaMax(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="form-group">
                  <label>Tổng số phòng tối thiểu</label>
                  <TextField
                    type="number"
                    value={tongSoPhongMin}
                    onChange={(e) => setTongSoPhongMin(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    size="small"
                  />
                </div>
                <div className="form-group">
                  <label>Tổng số phòng tối đa</label>
                  <TextField
                    type="number"
                    value={tongSoPhongMax}
                    onChange={(e) => setTongSoPhongMax(e.target.value)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    size="small"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Results */}
        <div className="results-section">
          <h2>Các lựa chọn phòng khả dụng</h2>
          {loaiPhongKhaDung.length > 0 ? (
            loaiPhongKhaDung.map((combination, combIndex) => (
              <div key={combIndex} className="room-option">
                <div className="room-header">
                  <h3>
                    Tổ hợp {combIndex + 1}: {combination.tongSucChua} người -{" "}
                    {Number(combination.tongChiPhi).toLocaleString()} VND -{" "}
                    {combination.tongSoPhong} phòng
                  </h3>
                  <Button
                    variant="contained"
                    color="success"
                    className="book-btn"
                    onClick={() => handleCreateBooking(combination)}
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
                    {combination.phongs.map((phong, idx) => (
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
            ))
          ) : (
            <p className="no-results">
              Không tìm thấy tổ hợp phòng nào phù hợp.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                variant="outlined"
              >
                Trước
              </Button>
              <span>
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                variant="outlined"
              >
                Sau
              </Button>
            </div>
          )}
        </div>

        {/* Snackbar cho thông báo lỗi/thành công */}
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

export default HotelBookingForm;
