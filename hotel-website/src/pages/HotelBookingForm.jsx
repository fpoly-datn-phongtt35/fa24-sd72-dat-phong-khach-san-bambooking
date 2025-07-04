import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  toHopLoaiPhong,
  ThemMoiDatPhong,
  addThongTinDatPhong,
  getKhachHangByUsername,
  ThemKhachHangDatPhong,
  getLPKDR,
} from "../services/DatPhong";
import { getAnhLP } from "../services/Rooms";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Button,
  TextField,
  Box,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Swal from "sweetalert2";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const HotelBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [roomImages, setRoomImages] = useState({});
  const [errors, setErrors] = useState({});
  const pageSize = 10;

  const [ngayNhanPhong, setNgayNhanPhong] = useState(
    location.state?.ngayNhanPhong
      ? dayjs(location.state.ngayNhanPhong)
      : dayjs()
          .set("hour", 14)
          .set("minute", 0)
          .set("second", 0)
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    location.state?.ngayTraPhong
      ? dayjs(location.state.ngayTraPhong)
      : dayjs()
          .add(1, "day")
          .set("hour", 12)
          .set("minute", 0)
          .set("second", 0)
  );
  const [soNguoi, setSoNguoi] = useState(location.state?.soNguoi || 1);
  const [soTre, setSoTre] = useState(location.state?.soTre || 0);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(
    !!location.state?.tongChiPhiMin ||
      !!location.state?.tongChiPhiMax ||
      !!location.state?.tongSucChuaMin ||
      !!location.state?.tongSucChuaMax ||
      !!location.state?.tongSoPhongMin ||
      !!location.state?.tongSoPhongMax ||
      !!location.state?.loaiPhongChons?.length ||
      !!location.state?.key
  );
  const [tongChiPhiMin, setTongChiPhiMin] = useState(
    location.state?.tongChiPhiMin || ""
  );
  const [tongChiPhiMax, setTongChiPhiMax] = useState(
    location.state?.tongChiPhiMax || ""
  );
  const [tongSucChuaMin, setTongSucChuaMin] = useState(
    location.state?.tongSucChuaMin || ""
  );
  const [tongSucChuaMax, setTongSucChuaMax] = useState(
    location.state?.tongSucChuaMax || ""
  );
  const [tongSoPhongMin, setTongSoPhongMin] = useState(
    location.state?.tongSoPhongMin || ""
  );
  const [tongSoPhongMax, setTongSoPhongMax] = useState(
    location.state?.tongSoPhongMax || ""
  );
  const [loaiPhongChons, setLoaiPhongChons] = useState(
    location.state?.loaiPhongChons || []
  );
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [key, setKey] = useState(location.state?.key || "");

  const validateInputs = () => {
    const newErrors = {};
    if (!ngayNhanPhong || !ngayNhanPhong.isValid()) {
      newErrors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng hợp lệ";
    }
    if (!ngayTraPhong || !ngayTraPhong.isValid()) {
      newErrors.ngayTraPhong = "Vui lòng chọn ngày trả phòng hợp lệ";
    }
    if (ngayNhanPhong && ngayTraPhong && ngayNhanPhong.isAfter(ngayTraPhong)) {
      newErrors.ngayTraPhong = "Ngày trả phòng phải sau ngày nhận phòng";
    }
    if (!soNguoi || soNguoi < 1) {
      newErrors.soNguoi = "Số người phải lớn hơn hoặc bằng 1";
    }
    if (soTre < 0) {
      newErrors.soTre = "Số trẻ em không được nhỏ hơn 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSoNguoiChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setSoNguoi(value);
      setErrors({ ...errors, soNguoi: "" });
    } else {
      setErrors({ soNguoi: "Số người phải lớn hơn hoặc bằng 1" });
    }
  };

  const handleSoTreChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setSoTre(value);
      setErrors({ ...errors, soTre: "" });
    } else {
      setErrors({ soTre: "Số trẻ em không được nhỏ hơn 0" });
    }
  };

  const fetchRoomImages = async (idLoaiPhong) => {
    try {
      const response = await getAnhLP(idLoaiPhong);
      const imagePaths = response.data
        .map((item) => item.duongDan)
        .filter(Boolean);
      setRoomImages((prev) => ({ ...prev, [idLoaiPhong]: imagePaths }));
    } catch (error) {
      console.error(`Lỗi khi lấy ảnh cho ${idLoaiPhong}:`, error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể tải ảnh cho loại phòng ${idLoaiPhong}!`,
        confirmButtonText: "Đóng",
      });
      setRoomImages((prev) => ({ ...prev, [idLoaiPhong]: [] }));
    }
  };

  const handleSearch = async () => {
    if (!validateInputs()) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng kiểm tra lại thông tin nhập.",
        confirmButtonText: "Đóng",
      });
      return;
    }

    setIsLoading(true);
    const pageable = { page: currentPage, size: pageSize };

    try {
      const response = await toHopLoaiPhong(
        ngayNhanPhong.toISOString(),
        ngayTraPhong.toISOString(),
        soNguoi,
        soTre,
        key || null,
        tongChiPhiMin ? Number(tongChiPhiMin) : null,
        tongChiPhiMax ? Number(tongChiPhiMax) : null,
        tongSucChuaMin ? Number(tongSucChuaMin) : null,
        tongSucChuaMax ? Number(tongSucChuaMax) : null,
        tongSoPhongMin ? Number(tongSoPhongMin) : null,
        tongSoPhongMax ? Number(tongSoPhongMax) : null,
        loaiPhongChons.length > 0 ? loaiPhongChons : null,
        pageable
      );

      if (!response || !response.content) {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Không tìm thấy tổ hợp phòng phù hợp.",
          confirmButtonText: "Đóng",
        });
        setLoaiPhongKhaDung([]);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        setLoaiPhongKhaDung(response.content);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.number || 0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.",
        confirmButtonText: "Đóng",
      });
      setLoaiPhongKhaDung([]);
      setTotalPages(1);
      setCurrentPage(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoaiPhong = async () => {
    if (!ngayNhanPhong?.isValid() || !ngayTraPhong?.isValid()) return;
    try {
      const response = await getLPKDR(
        ngayNhanPhong.toISOString(),
        ngayTraPhong.toISOString()
      );
      if (response?.data && Array.isArray(response.data)) {
        setLoaiPhongList(response.data);
      } else {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Không tìm thấy loại phòng nào.",
          confirmButtonText: "Đóng",
        });
        setLoaiPhongList([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi tải loại phòng.",
        confirmButtonText: "Đóng",
      });
      setLoaiPhongList([]);
    }
  };

  const saveBookingId = (bookingId) => {
    try {
      const existingIds = JSON.parse(
        localStorage.getItem("booking_ids") || "[]"
      );
      if (!existingIds.includes(bookingId)) {
        existingIds.push(bookingId);
        localStorage.setItem("booking_ids", JSON.stringify(existingIds));
        console.debug(`Đã lưu booking ID ${bookingId} vào localStorage`);
      }
    } catch (error) {
      console.error("Lỗi khi lưu booking ID:", error);
    }
  };

  const handleCreateBooking = async (combination) => {
    setIsLoading(true);
    try {
      let user;
      try {
        user = JSON.parse(localStorage.getItem("user") || "{}").username;
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }

      let khachHangData;
      let kh;
      if (user) {
        try {
          const response = await getKhachHangByUsername(user);
          if (!response?.data)
            throw new Error("Không tìm thấy thông tin khách hàng.");
          khachHangData = response.data;
          kh = khachHangData;
        } catch (error) {
          console.error("Lỗi khi lấy thông tin khách hàng:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể lấy thông tin khách hàng. Vui lòng đăng nhập lại.",
            confirmButtonText: "Đóng",
          });
          setTimeout(
            () => navigate("/login", { state: { from: location.pathname } }),
            2000
          );
          return;
        }
      } else {
        khachHangData = {
          ho: "",
          ten: "",
          email: "",
          sdt: "",
          trangThai: false,
        };
        kh = await ThemKhachHangDatPhong(khachHangData);
        if (!kh?.data) throw new Error("Không thể tạo thông tin khách hàng.");
      }

      const datPhongRequest = {
        khachHang: kh.data || kh,
        maDatPhong: "",
        soNguoi,
        soTre,
        soPhong: combination.tongSoPhong,
        ngayDat: dayjs().tz("Asia/Ho_Chi_Minh").toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: user
          ? "Đặt phòng từ tài khoản đăng nhập"
          : "Đặt phòng không đăng nhập",
        trangThai: "Đang đặt phòng",
      };
      const datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse?.data) throw new Error("Không thể tạo đặt phòng.");

      const thongTinDatPhongResponseList = [];
      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: `TTD${Date.now()}${i}`,
              ngayNhanPhong: ngayNhanPhong.add(7, "hours").toISOString(),
              ngayTraPhong: ngayTraPhong.add(7, "hours").toISOString(),
              soNguoi: phong.loaiPhong.soKhachTieuChuan,
              soTre: phong.loaiPhong.treEmTieuChuan || 0,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Đang đặt phòng",
            };
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            if (!response?.data)
              throw new Error("Không thể tạo thông tin đặt phòng.");
            thongTinDatPhongResponseList.push(response.data);
          }
        }
      }

      const bookingId = datPhongResponse.data.id;
      saveBookingId(bookingId);

      console.debug(`Đã tạo booking ${bookingId}`);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đặt phòng thành công! Vui lòng xác nhận đặt phòng.",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/booking-confirmation", {
          state: {
            combination,
            datPhong: datPhongResponse.data,
            khachHang: kh.data || kh,
            thongTinDatPhong: thongTinDatPhongResponseList,
          },
        });
      });
    } catch (error) {
      console.error("Lỗi khi tạo đặt phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi tạo đặt phòng. Vui lòng thử lại.",
        confirmButtonText: "Đóng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBookingDays = () => {
    const start = dayjs(ngayNhanPhong).tz("Asia/Ho_Chi_Minh").startOf("day");
    const end = dayjs(ngayTraPhong).tz("Asia/Ho_Chi_Minh").startOf("day");
    return Math.max(1, end.diff(start, "day"));
  };

  useEffect(() => {
    if (loaiPhongKhaDung.length > 0) {
      loaiPhongKhaDung.forEach((combination) => {
        combination.phongs.forEach((phong) => {
          if (!roomImages[phong.loaiPhong.id])
            fetchRoomImages(phong.loaiPhong.id);
        });
      });
    }
  }, [loaiPhongKhaDung]);

  useEffect(() => {
    fetchLoaiPhong();
    if (
      ngayNhanPhong?.isValid() &&
      ngayTraPhong?.isValid() &&
      soNguoi &&
      soTre >= 0
    ) {
      handleSearch();
    }
  }, [
    currentPage,
    ngayNhanPhong,
    ngayTraPhong,
    soNguoi,
    soTre,
    tongChiPhiMin,
    tongChiPhiMax,
    tongSucChuaMin,
    tongSucChuaMax,
    tongSoPhongMin,
    tongSoPhongMax,
    key,
    loaiPhongChons,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className="booking-container"
        sx={{ maxWidth: 1200, mx: "auto", p: 3 }}
      >
        <Box className="booking-header" sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Đặt Phòng Khách Sạn
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Tìm kiếm phòng nhanh chóng với giá tốt nhất
          </Typography>
        </Box>

        <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ngày nhận phòng"
                  value={ngayNhanPhong}
                  minDateTime={dayjs()
                    .tz("Asia/Ho_Chi_Minh")
                    .set("hour", 14)
                    .set("minute", 0)}
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      const newCheckInDateTime =
                        dayjs(newValue).tz("Asia/Ho_Chi_Minh");
                      setNgayNhanPhong(newCheckInDateTime);
                      if (newCheckInDateTime.isAfter(ngayTraPhong)) {
                        setNgayTraPhong(
                          newCheckInDateTime
                            .add(1, "day")
                            .set("hour", 12)
                            .set("minute", 0)
                        );
                      }
                      setErrors({ ...errors, ngayNhanPhong: "" });
                    } else {
                      setNgayNhanPhong(null);
                      setErrors({
                        ...errors,
                        ngayNhanPhong: "Ngày nhận phòng không hợp lệ",
                      });
                    }
                    validateInputs();
                  }}
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium",
                      error: !!errors.ngayNhanPhong,
                      helperText: errors.ngayNhanPhong,
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ngày trả phòng"
                  value={ngayTraPhong}
                  minDateTime={
                    ngayNhanPhong
                      ? ngayNhanPhong.add(1, "hour")
                      : dayjs().tz("Asia/Ho_Chi_Minh")
                  }
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      setNgayTraPhong(dayjs(newValue).tz("Asia/Ho_Chi_Minh"));
                      setErrors({ ...errors, ngayTraPhong: "" });
                    } else {
                      setNgayTraPhong(null);
                      setErrors({
                        ...errors,
                        ngayTraPhong: "Ngày trả phòng không hợp lệ",
                      });
                    }
                    validateInputs();
                  }}
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium",
                      error: !!errors.ngayTraPhong,
                      helperText: errors.ngayTraPhong,
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Số người lớn"
                type="number"
                value={soNguoi}
                onChange={handleSoNguoiChange}
                fullWidth
                inputProps={{ min: 1 }}
                error={!!errors.soNguoi}
                helperText={errors.soNguoi}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                    bgcolor: "#f5f5f5",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Số trẻ em"
                type="number"
                value={soTre}
                onChange={handleSoTreChange}
                fullWidth
                inputProps={{ min: 0 }}
                error={!!errors.soTre}
                helperText={errors.soTre}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                    bgcolor: "#f5f5f5",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <ChildCareIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{ borderRadius: 1, mb: 2 }}
            >
              {showAdvancedFilters
                ? "Ẩn bộ lọc nâng cao"
                : "Hiển thị bộ lọc nâng cao"}
            </Button>
            {showAdvancedFilters && (
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                }}
              >
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng chi phí tối thiểu"
                      type="number"
                      value={tongChiPhiMin}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongChiPhiMin(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <AttachMoneyIcon
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng chi phí tối đa"
                      type="number"
                      value={tongChiPhiMax}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongChiPhiMax(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <AttachMoneyIcon
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng sức chứa tối thiểu"
                      type="number"
                      value={tongSucChuaMin}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongSucChuaMin(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng sức chứa tối đa"
                      type="number"
                      value={tongSucChuaMax}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongSucChuaMax(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng số phòng tối thiểu"
                      type="number"
                      value={tongSoPhongMin}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongSoPhongMin(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tổng số phòng tối đa"
                      type="number"
                      value={tongSoPhongMax}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setTongSoPhongMax(value >= 0 ? value : "");
                      }}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Phương thức tìm kiếm</InputLabel>
                      <Select
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        label="Phương thức tìm kiếm"
                        sx={{ borderRadius: 1, bgcolor: "#fff" }}
                      >
                        <MenuItem value="">Chi phí thấp nhất</MenuItem>
                        <MenuItem value="leastRooms">
                          Tổ hợp ít phòng nhất
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {loaiPhongChons.map((lpc, index) => (
                    <Grid container item spacing={2} key={index}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Loại phòng</InputLabel>
                          <Select
                            value={lpc.loaiPhong?.tenLoaiPhong || ""}
                            onChange={(e) => {
                              const selectedLoaiPhong = loaiPhongList.find(
                                (lp) => lp.tenLoaiPhong === e.target.value
                              );
                              const newList = [...loaiPhongChons];
                              newList[index] = {
                                ...newList[index],
                                loaiPhong: selectedLoaiPhong,
                              };
                              setLoaiPhongChons(newList);
                            }}
                            label="Loại phòng"
                            sx={{ borderRadius: 1, bgcolor: "#fff" }}
                          >
                            <MenuItem value="">Chọn loại phòng</MenuItem>
                            {loaiPhongList.map((lp) => (
                              <MenuItem key={lp.id} value={lp.tenLoaiPhong}>
                                {lp.tenLoaiPhong}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Số lượng"
                          type="number"
                          value={lpc.soLuongChon || ""}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            const newList = [...loaiPhongChons];
                            newList[index] = {
                              ...newList[index],
                              soLuongChon: value >= 1 ? value : "",
                            };
                            setLoaiPhongChons(newList);
                          }}
                          fullWidth
                          inputProps={{ min: 1 }}
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              bgcolor: "#fff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            const newList = loaiPhongChons.filter(
                              (_, i) => i !== index
                            );
                            setLoaiPhongChons(newList);
                          }}
                          sx={{ borderRadius: 1 }}
                        >
                          Xóa
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (loaiPhongChons.some((lpc) => !lpc.loaiPhong)) {
                          Swal.fire({
                            icon: "warning",
                            title: "Cảnh báo",
                            text: "Vui lòng chọn loại phòng trước khi thêm.",
                            confirmButtonText: "Đóng",
                          });
                          return;
                        }
                        setLoaiPhongChons([
                          ...loaiPhongChons,
                          { loaiPhong: null, soLuongChon: null },
                        ]);
                      }}
                      sx={{ borderRadius: 1, mr: 1 }}
                    >
                      Thêm loại phòng
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSearch}
                      sx={{
                        borderRadius: 1,
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#1565c0" },
                      }}
                    >
                      Tìm kiếm
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </form>

        <Box className="results-section" sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Các lựa chọn phòng khả dụng
          </Typography>
          {isLoading ? (
            <Typography>Đang tải dữ liệu...</Typography>
          ) : loaiPhongKhaDung.length > 0 ? (
            loaiPhongKhaDung.map((combination, combIndex) => (
              <Box
                key={combIndex}
                className="room-option"
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <Box
                  className="room-header"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Tổ hợp {combIndex + 1}: {combination.tongSucChua} người -{" "}
                    {Number(combination.tongChiPhi).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                    - {combination.tongSoPhong} phòng
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleCreateBooking(combination)}
                    disabled={isLoading}
                    sx={{ borderRadius: 1, "&:hover": { bgcolor: "#388e3c" } }}
                  >
                    Đặt phòng
                  </Button>
                </Box>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ padding: 8 }}>STT</th>
                      <th style={{ padding: 8 }}>Hình ảnh</th>
                      <th style={{ padding: 8 }}>Loại phòng</th>
                      <th style={{ padding: 8 }}>Diện tích</th>
                      <th style={{ padding: 8 }}>Số khách</th>
                      <th style={{ padding: 8 }}>Số trẻ em</th>
                      <th style={{ padding: 8 }}>Đơn giá</th>
                      <th style={{ padding: 8 }}>Số lượng</th>
                      <th style={{ padding: 8 }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combination.phongs.map((phong, idx) => (
                      <tr key={phong.loaiPhong.id}>
                        <td style={{ padding: 8, textAlign: "center" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: 8, textAlign: "center" }}>
                          {roomImages[phong.loaiPhong.id] ? (
                            roomImages[phong.loaiPhong.id].length > 0 ? (
                              <img
                                src={roomImages[phong.loaiPhong.id][0]}
                                alt={`${phong.loaiPhong.tenLoaiPhong} - Ảnh chính`}
                                style={{
                                  width: 100,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            ) : (
                              <span>Không có ảnh</span>
                            )
                          ) : (
                            <span>Đang tải...</span>
                          )}
                        </td>
                        <td style={{ padding: 8 }}>
                          {phong.loaiPhong.tenLoaiPhong}
                        </td>
                        <td style={{ padding: 8 }}>
                          {phong.loaiPhong.dienTich} m²
                        </td>
                        <td style={{ padding: 8 }}>
                          {phong.loaiPhong.soKhachToiDa}
                        </td>
                        <td style={{ padding: 8 }}>
                          {phong.loaiPhong.treEmToiDa || 0}
                        </td>
                        <td style={{ padding: 8 }}>
                          {phong.loaiPhong.donGia.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td style={{ padding: 8 }}>{phong.soLuongChon}</td>
                        <td style={{ padding: 8 }}>
                          {(
                            phong.soLuongChon *
                            phong.loaiPhong.donGia *
                            calculateBookingDays()
                          ).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              Không tìm thấy tổ hợp phòng nào phù hợp.
            </Typography>
          )}

          {totalPages > 1 && (
            <Box
              className="pagination"
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <Button
                disabled={currentPage === 0 || isLoading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                variant="outlined"
                sx={{ mr: 1, borderRadius: 1 }}
              >
                Trước
              </Button>
              <Typography sx={{ mx: 2, alignSelf: "center" }}>
                Trang {currentPage + 1} / {totalPages}
              </Typography>
              <Button
                disabled={currentPage === totalPages - 1 || isLoading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Sau
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default HotelBookingForm;