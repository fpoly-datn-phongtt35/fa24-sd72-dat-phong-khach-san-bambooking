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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Swal from "sweetalert2";
import { debounce } from "lodash";

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
      : dayjs().set("hour", 14).set("minute", 0).set("second", 0)
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    location.state?.ngayTraPhong
      ? dayjs(location.state.ngayTraPhong)
      : dayjs().add(1, "day").set("hour", 12).set("minute", 0).set("second", 0)
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

  const [openGuestDialog, setOpenGuestDialog] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
  });
  const [selectedCombination, setSelectedCombination] = useState(null);

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
      setErrors({
        ...errors,
        soNguoi: "Số người phải lớn hơn hoặc bằng 1",
      });
    }
  };

  const handleSoTreChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setSoTre(value);
      setErrors({ ...errors, soTre: "" });
    } else {
      setErrors({
        ...errors,
        soTre: "Số trẻ em không được nhỏ hơn 0",
      });
    }
  };

  const fetchRoomImages = async (idLoaiPhong) => {
    try {
      const response = await getAnhLP(idLoaiPhong);
      const imagePaths = response.data
        .map((item) => item.duongDan)
        .filter(Boolean);
      setRoomImages((prev) => ({
        ...prev,
        [idLoaiPhong]: imagePaths,
      }));
    } catch (error) {
      console.error(`Lỗi khi lấy ảnh cho ${idLoaiPhong}:`, error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể tải ảnh cho loại phòng ${idLoaiPhong}!`,
        confirmButtonText: "Đóng",
      });
      setRoomImages((prev) => ({
        ...prev,
        [idLoaiPhong]: [],
      }));
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
        loaiPhongChons || null,
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
    if (!ngayNhanPhong?.isValid() || !ngayTraPhong?.isValid()) {
      return;
    }
    try {
      const response = await getLPKDR(
        ngayNhanPhong.toISOString(),
        ngayTraPhong.toISOString()
      );
      if (response && response.data && Array.isArray(response.data)) {
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

  useEffect(() => {
    if (loaiPhongKhaDung.length > 0) {
      loaiPhongKhaDung.forEach((combination) => {
        combination.phongs.forEach((phong) => {
          if (!roomImages[phong.loaiPhong.id]) {
            fetchRoomImages(phong.loaiPhong.id);
          }
        });
      });
    }
  }, [loaiPhongKhaDung]);

  useEffect(() => {
    fetchLoaiPhong();
    if (
      ngayNhanPhong &&
      ngayTraPhong &&
      soNguoi &&
      soTre >= 0 &&
      ngayNhanPhong.isValid() &&
      ngayTraPhong.isValid()
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
  ]);

  const handleCreateBooking = async (combination) => {
    setIsLoading(true);
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];

    console.log("combination:", combination); // Gỡ lỗi combination
    console.log("soNguoi:", soNguoi, "soTre:", soTre); // Gỡ lỗi biến trạng thái
    console.log("ngayNhanPhong:", ngayNhanPhong, "ngayTraPhong:", ngayTraPhong);

    try {
      let user;
      let khachHangData;
      let kh = null;

      try {
        user = localStorage.getItem("user");
        console.log("user từ localStorage:", user); // Gỡ lỗi user
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }

      if (user) {
        try {
          const response = await getKhachHangByUsername(user);
          console.log("getKhachHangByUsername response:", response); // Gỡ lỗi response
          if (!response || !response.data) {
            throw new Error("Không tìm thấy thông tin khách hàng.");
          }
          khachHangData = response.data;
          kh = khachHangData;
          console.log("khachHangData:", khachHangData, "kh:", kh); // Gỡ lỗi kh
        } catch (error) {
          console.error("Lỗi khi lấy thông tin khách hàng:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể lấy thông tin khách hàng. Vui lòng đăng nhập lại.",
            confirmButtonText: "Đóng",
          });
          setTimeout(() => {
            navigate("/login", { state: { from: location.pathname } });
          }, 2000);
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
        console.log("khachHangData (khách):", khachHangData); // Gỡ lỗi dữ liệu khách
        kh = await ThemKhachHangDatPhong(khachHangData);
        console.log("ThemKhachHangDatPhong response:", kh); // Gỡ lỗi kh
        if (!kh || !kh.data) {
          throw new Error("Không thể tạo thông tin khách hàng.");
        }
      }

      const datPhongRequest = {
        khachHang: kh.data || kh,
        maDatPhong: "",
        soNguoi: soNguoi,
        soTre: soTre,
        soPhong: combination.tongSoPhong,
        ngayDat: new Date().toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: user
          ? "Đặt phòng từ tài khoản đăng nhập"
          : "Đặt phòng không đăng nhập",
        trangThai: "Đang đặt phòng",
      };
      console.log("datPhongRequest:", datPhongRequest); // Gỡ lỗi request
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      console.log("ThemMoiDatPhong response:", datPhongResponse); // Gỡ lỗi response
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "TTD" + new Date().getTime() + i,
              ngayNhanPhong: ngayNhanPhong.toISOString(),
              ngayTraPhong: ngayTraPhong.toISOString(),
              soNguoi: phong.loaiPhong.soKhachTieuChuan,
              soTre: phong.loaiPhong.treEmTieuChuan,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Đang đặt phòng",
            };
            console.log("thongTinDatPhongRequest:", thongTinDatPhongRequest); // Gỡ lỗi request
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            console.log("addThongTinDatPhong response:", response); // Gỡ lỗi response
            if (!response || !response.data) {
              throw new Error("Không thể tạo thông tin đặt phòng.");
            }
            thongTinDatPhongResponseList = [
              ...thongTinDatPhongResponseList,
              response.data,
            ];
          }
        }
      }

      localStorage.removeItem("pendingData");
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đặt phòng thành công!",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/booking-confirmation", {
          state: {
            combination: combination,
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

  const handleGuestInfoSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    if (
      !guestInfo.hoTen ||
      !guestInfo.hoTen.includes(" ") ||
      !emailRegex.test(guestInfo.email) ||
      !phoneRegex.test(guestInfo.soDienThoai)
    ) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ và đúng định dạng thông tin (Họ tên phải có dấu cách, ví dụ: Nguyễn Tấn Phát).",
        confirmButtonText: "Đóng",
      });
      return;
    }
    setOpenGuestDialog(false);
    await handleCreateBooking(selectedCombination);
  };

  const calculateBookingDays = () => {
      const start = dayjs(ngayNhanPhong).startOf("day");
      const end = dayjs(ngayTraPhong).startOf("day");
      return Math.max(1, end.diff(start, "day"));
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="booking-container">
        <div className="booking-header">
          <h1>Đặt Phòng Khách Sạn</h1>
          <p>Tìm kiếm phòng nhanh chóng với giá tốt nhất</p>
        </div>

        <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <DateTimePicker
                  label="Ngày nhận phòng"
                  value={ngayNhanPhong}
                  minDateTime={dayjs().set("hour", 14).set("minute", 0)}
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      const newCheckInDateTime = dayjs(newValue)
                        .set("hour", 14)
                        .set("minute", 0)
                        .set("second", 0);
                      setNgayNhanPhong(newCheckInDateTime);
                      if (
                        newCheckInDateTime.isSame(ngayTraPhong, "hour") ||
                        newCheckInDateTime.isAfter(ngayTraPhong)
                      ) {
                        setNgayTraPhong(
                          newCheckInDateTime
                            .add(1, "day")
                            .set("hour", 12)
                            .set("minute", 0)
                            .set("second", 0)
                        );
                      }
                    } else {
                      setNgayNhanPhong(null);
                    }
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
              </Grid>
              <Grid item xs={12} sm={3}>
                <DateTimePicker
                  label="Ngày trả phòng"
                  value={ngayTraPhong}
                  minDateTime={
                    ngayNhanPhong
                      ? ngayNhanPhong.add(1, "hour")
                      : dayjs().add(1, "hour")
                  }
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      setNgayTraPhong(
                        dayjs(newValue)
                          .set("hour", 12)
                          .set("minute", 0)
                          .set("second", 0)
                      );
                    } else {
                      setNgayTraPhong(null);
                    }
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
                      backgroundColor: "#f5f5f5",
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
                      backgroundColor: "#f5f5f5",
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
          </div>

          <div className="advanced-filters">
            <Button
              type="button"
              className="toggle-filters"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outlined"
              sx={{ mb: 2, borderRadius: 1 }}
            >
              {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
            </Button>
            {showAdvancedFilters && (
              <Box
                sx={{
                  mt: 2,
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
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#fff",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <AttachMoneyIcon
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                        ),
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
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#fff",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <AttachMoneyIcon
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                        ),
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
                          backgroundColor: "#fff",
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
                          backgroundColor: "#fff",
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
                          backgroundColor: "#fff",
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
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="search-method-label">
                        Phương thức tìm kiếm
                      </InputLabel>
                      <Select
                        labelId="search-method-label"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        fullWidth
                        label="Phương thức tìm kiếm"
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 1,
                            backgroundColor: "#fff",
                          },
                        }}
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
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Loại phòng</InputLabel>
                          <Select
                            value={lpc.loaiPhong?.tenLoaiPhong || ""}
                            onChange={(e) => {
                              const newList = [...loaiPhongChons];
                              const selectedLoaiPhong = loaiPhongList.find(
                                (lp) => lp.tenLoaiPhong === e.target.value
                              );
                              newList[index] = {
                                ...newList[index],
                                loaiPhong: selectedLoaiPhong,
                              };
                              setLoaiPhongChons(newList);
                            }}
                            label="Loại phòng"
                            sx={{ borderRadius: 1, backgroundColor: "#fff" }}
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
                      <Grid item xs={4}>
                        <TextField
                          label="Số lượng"
                          type="number"
                          value={lpc.soLuongChon || ""}
                          onChange={(e) => {
                            const newList = [...loaiPhongChons];
                            const value = Number(e.target.value);
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
                              backgroundColor: "#fff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
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
          </div>
        </form>

        <div className="results-section">
          <h2>Các lựa chọn phòng khả dụng</h2>
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : loaiPhongKhaDung.length > 0 ? (
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
                    disabled={isLoading}
                    sx={{
                      borderRadius: 1,
                      "&:hover": { bgcolor: "#388e3c" },
                    }}
                  >
                    Đặt phòng
                  </Button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th className="poon-column">Hình ảnh</th>
                      <th>Loại phòng</th>
                      <th>Diện tích</th>
                      <th>Số khách</th>
                      <th>Số trẻ em</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combination.phongs.map((phong, idx) => (
                      <tr key={phong.loaiPhong.id}>
                        <td>{idx + 1}</td>
                        <td>
                          {roomImages[phong.loaiPhong.id] ? (
                            roomImages[phong.loaiPhong.id].length > 0 ? (
                              <img
                                src={roomImages[phong.loaiPhong.id][0]}
                                alt={`${phong.loaiPhong.tenLoaiPhong} - Ảnh chính`}
                                className="room-image"
                              />
                            ) : (
                              <span className="no-image">Không có ảnh</span>
                            )
                          ) : (
                            <span className="loading-image">Đang tải...</span>
                          )}
                        </td>
                        <td>{phong.loaiPhong.tenLoaiPhong}</td>
                        <td>{phong.loaiPhong.dienTich} m²</td>
                        <td>{phong.loaiPhong.soKhachToiDa}</td>
                        <td>{phong.loaiPhong.treEmToiDa || 0}</td>
                        <td>{phong.loaiPhong.donGia.toLocaleString()} VND</td>
                        <td>{phong.soLuongChon}</td>
                        <td>
                          {(
                            phong.soLuongChon * phong.loaiPhong.donGia *(calculateBookingDays() || 1)
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

          {totalPages > 1 && (
            <div className="pagination">
              <Button
                disabled={currentPage === 0 || isLoading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Trước
              </Button>
              <span>
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages - 1 || isLoading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Sau
              </Button>
            </div>
          )}
        </div>

        <Dialog
          open={openGuestDialog}
          onClose={() => setOpenGuestDialog(false)}
        >
          <DialogTitle>Nhập thông tin đặt phòng</DialogTitle>
          <DialogContent>
            <TextField
              label="Họ tên (Họ Tên)"
              value={guestInfo.hoTen}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, hoTen: e.target.value })
              }
              fullWidth
              margin="dense"
              required
              placeholder="Ví dụ: Nguyễn Tấn Phát"
            />
            <TextField
              label="Email"
              type="email"
              value={guestInfo.email}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, email: e.target.value })
              }
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Số điện thoại"
              value={guestInfo.soDienThoai}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, soDienThoai: e.target.value })
              }
              fullWidth
              margin="dense"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGuestDialog(false)}>Hủy</Button>
            <Button onClick={handleGuestInfoSubmit} variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default HotelBookingForm;
