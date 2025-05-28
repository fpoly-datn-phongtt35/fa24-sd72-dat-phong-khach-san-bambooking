import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Grid,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import ChildIcon from "@mui/icons-material/ChildCare";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import {
  toHopLoaiPhong,
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
} from "../../services/DatPhong";
import { addThongTinDatPhong } from "../../services/TTDP";
import { getLoaiPhongKhaDungResponse } from "../../services/LoaiPhongService";
import Swal from "sweetalert2";

// Kích hoạt plugin múi giờ
dayjs.extend(utc);
dayjs.extend(timezone);

const DatPhong = () => {
  // Khởi tạo thời gian hợp lý
  const currentHour = dayjs().hour();
  const initialCheckIn =
    currentHour >= 14
      ? dayjs().add(1, "day").set("hour", 14).set("minute", 0).set("second", 0)
      : dayjs().set("hour", 14).set("minute", 0).set("second", 0);
  const initialCheckOut = initialCheckIn
    .add(1, "day")
    .set("hour", 12)
    .set("minute", 0)
    .set("second", 0);

  const [ngayNhanPhong, setNgayNhanPhong] = useState(initialCheckIn);
  const [ngayTraPhong, setNgayTraPhong] = useState(initialCheckOut);
  const [soNguoi, setSoNguoi] = useState(1);
  const [soTre, setSoTre] = useState(0);
  const [key, setKey] = useState("");
  const [tongChiPhiMin, setTongChiPhiMin] = useState(null);
  const [tongChiPhiMax, setTongChiPhiMax] = useState(null);
  const [tongSucChuaMin, setTongSucChuaMin] = useState(null);
  const [tongSucChuaMax, setTongSucChuaMax] = useState(null);
  const [tongSoPhongMin, setTongSoPhongMin] = useState(null);
  const [tongSoPhongMax, setTongSoPhongMax] = useState(null);
  const [loaiPhongChons, setLoaiPhongChons] = useState([]);
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSnackbar = (message, type = "error") => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Thành công" : "Lỗi",
      text: message,
      timer: 3000,
      showConfirmButton: false,
    });
  };

  // Hàm định dạng thời gian cho LocalDateTime (không có múi giờ)
  const formatLocalDateTime = (date) => {
    return date.format("YYYY-MM-DDTHH:mm:ss"); // Định dạng không có offset, ví dụ: 2025-05-25T14:00:00
  };

  const validateInputs = () => {
    const newErrors = {};

    // Validate ngày nhận phòng
    if (!ngayNhanPhong || !ngayNhanPhong.isValid()) {
      newErrors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng hợp lệ";
    } else if (ngayNhanPhong.isBefore(dayjs(), "minute")) {
      newErrors.ngayNhanPhong = "Ngày nhận phòng không được nhỏ hơn hiện tại";
    }

    // Validate ngày trả phòng
    if (!ngayTraPhong || !ngayTraPhong.isValid()) {
      newErrors.ngayTraPhong = "Vui lòng chọn ngày trả phòng hợp lệ";
    } else if (
      ngayNhanPhong &&
      ngayTraPhong &&
      !ngayTraPhong.isAfter(ngayNhanPhong, "minute")
    ) {
      newErrors.ngayTraPhong = "Giờ trả phòng phải sau giờ nhận phòng";
    }

    // Validate số người lớn
    if (!soNguoi || soNguoi < 1) {
      newErrors.soNguoi = "Số người lớn phải lớn hơn hoặc bằng 1";
    }

    // Validate số trẻ em
    if (soTre < 0) {
      newErrors.soTre = "Số trẻ em không được nhỏ hơn 0";
    }

    // Validate tổng chi phí
    if (tongChiPhiMin !== null && tongChiPhiMin < 0) {
      newErrors.tongChiPhiMin = "Tổng chi phí tối thiểu không được nhỏ hơn 0";
    }
    if (tongChiPhiMax !== null && tongChiPhiMax < 0) {
      newErrors.tongChiPhiMax = "Tổng chi phí tối đa không được nhỏ hơn 0";
    }
    if (
      tongChiPhiMin !== null &&
      tongChiPhiMax !== null &&
      tongChiPhiMin > tongChiPhiMax
    ) {
      newErrors.tongChiPhiMax =
        "Tổng chi phí tối đa phải lớn hơn hoặc bằng tối thiểu";
    }

    // Validate tổng sức chứa
    if (tongSucChuaMin !== null && tongSucChuaMin < 0) {
      newErrors.tongSucChuaMin = "Tổng sức chứa tối thiểu không được nhỏ hơn 0";
    }
    if (tongSucChuaMax !== null && tongSucChuaMax < 0) {
      newErrors.tongSucChuaMax = "Tổng sức chứa tối đa không được nhỏ hơn 0";
    }
    if (
      tongSucChuaMin !== null &&
      tongSucChuaMax !== null &&
      tongSucChuaMin > tongSucChuaMax
    ) {
      newErrors.tongSucChuaMax =
        "Tổng sức chứa tối đa phải lớn hơn hoặc bằng tối thiểu";
    }

    // Validate tổng số phòng
    if (tongSoPhongMin !== null && tongSoPhongMin < 0) {
      newErrors.tongSoPhongMin = "Tổng số phòng tối thiểu không được nhỏ hơn 0";
    }
    if (tongSoPhongMax !== null && tongSoPhongMax < 0) {
      newErrors.tongSoPhongMax = "Tổng số phòng tối đa không được nhỏ hơn 0";
    }
    if (
      tongSoPhongMin !== null &&
      tongSoPhongMax !== null &&
      tongSoPhongMin > tongSoPhongMax
    ) {
      newErrors.tongSoPhongMax =
        "Tổng số phòng tối đa phải lớn hơn hoặc bằng tối thiểu";
    }

    // Validate loại phòng được chọn
    loaiPhongChons.forEach((lpc, index) => {
      if (!lpc.loaiPhong) {
        newErrors[`loaiPhong_${index}`] = "Vui lòng chọn loại phòng";
      }
      if (!lpc.soLuongChon || lpc.soLuongChon < 0) {
        newErrors[`soLuong_${index}`] =
          "Số lượng phòng phải lớn hơn hoặc bằng 0";
      }
    });

    // Kiểm tra trùng lặp loại phòng
    const selectedLoaiPhongs = loaiPhongChons
      .filter((lpc) => lpc.loaiPhong)
      .map((lpc) => lpc.loaiPhong.id);
    if (new Set(selectedLoaiPhongs).size !== selectedLoaiPhongs.length) {
      newErrors.loaiPhongChons = "Không được chọn trùng loại phòng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchLoaiPhong = async () => {
    try {
      if (
        ngayNhanPhong &&
        ngayTraPhong &&
        ngayNhanPhong.isValid() &&
        ngayTraPhong.isValid()
      ) {
        console.log(
          "Fetch loại phòng - Ngày nhận:",
          formatLocalDateTime(ngayNhanPhong),
          "Ngày trả:",
          formatLocalDateTime(ngayTraPhong)
        );
        const response = await getLoaiPhongKhaDungResponse(
          formatLocalDateTime(ngayNhanPhong),
          formatLocalDateTime(ngayTraPhong)
        );
        setLoaiPhongList(response.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại phòng:", error);
      handleSnackbar(
        "Đã xảy ra lỗi khi tải dữ liệu loại phòng, vui lòng thử lại sau."
      );
    }
  };

  const handleSearch = async (page = currentPage) => {
    if (!validateInputs()) {
      return;
    }
    try {
      console.log(
        "Search - Ngày nhận:",
        formatLocalDateTime(ngayNhanPhong),
        "Ngày trả:",
        formatLocalDateTime(ngayTraPhong)
      );
      const response = await toHopLoaiPhong(
        formatLocalDateTime(ngayNhanPhong),
        formatLocalDateTime(ngayTraPhong),
        soNguoi,
        soTre,
        key || null,
        tongChiPhiMin ? Number(tongChiPhiMin) : null,
        tongChiPhiMax ? Number(tongChiPhiMax) : null,
        tongSucChuaMin ? Number(tongSucChuaMin) : null,
        tongSucChuaMax ? Number(tongSucChuaMax) : null,
        tongSoPhongMin ? Number(tongSoPhongMin) : null,
        tongSoPhongMax ? Number(tongSoPhongMax) : null,
        loaiPhongChons,
        { page, size: pageSize }
      );

      setLoaiPhongKhaDung(response.content || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.number || 0);
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      handleSnackbar(
        "Đã xảy ra lỗi khi tải tổ hợp phòng, vui lòng thử lại sau."
      );
    }
  };

  useEffect(() => {
    fetchLoaiPhong();
    handleSearch(0);
  }, [ngayNhanPhong, ngayTraPhong, soNguoi, soTre, pageSize]);

  const handleSearchClick = () => {
    handleSearch(0);
  };

  const handlePageChange = (e, page) => {
    const newPage = page - 1;
    setCurrentPage(newPage);
    handleSearch(newPage);
  };

  const handleCreateBooking = async (combination) => {
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];

    try {
      const soPhong = combination.phongs.reduce(
        (total, phong) => total + (phong.soLuongChon || 0),
        0
      );

      const khachHangRequest = {
        ho: "Khách",
        ten: "Hàng",
        email: "khachhang@example.com",
        sdt: "",
        trangThai: false,
      };
      khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }

      const soNgayLuuTru = Math.max(
        1,
        dayjs(ngayTraPhong).diff(ngayNhanPhong, "day")
      );

      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + new Date().getTime(),
        soNguoi: soNguoi,
        soTre: soTre,
        soPhong: soPhong,
        ngayDat: formatLocalDateTime(dayjs()), // Sửa ngày đặt để dùng formatLocalDateTime
        tongTien: combination.tongChiPhi * soNgayLuuTru,
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
              maThongTinDatPhong: "TTDP" + new Date().getTime() + i,
              ngayNhanPhong: formatLocalDateTime(ngayNhanPhong),
              ngayTraPhong: formatLocalDateTime(ngayTraPhong),
              soNguoi: phong.loaiPhong.soKhachToiDa,
              soTre: Math.min(soTre, phong.loaiPhong.treEmToiDa),
              giaDat: phong.loaiPhong.donGia * soNgayLuuTru,
              trangThai: "Đang đặt phòng",
            };
            console.log(
              "ThongTinDatPhongRequest - Ngày nhận:",
              thongTinDatPhongRequest.ngayNhanPhong,
              "Ngày trả:",
              thongTinDatPhongRequest.ngayTraPhong
            );
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            if (!response || !response.data) {
              throw new Error(
                `Không thể tạo thông tin đặt phòng cho loại phòng ${phong.loaiPhong.tenLoaiPhong}.`
              );
            }
            thongTinDatPhongResponseList.push(response.data);
          }
        }
      }

      if (thongTinDatPhongResponseList.length !== soPhong) {
        throw new Error(
          "Số lượng thông tin đặt phòng không khớp với số phòng đã chọn."
        );
      }

      handleSnackbar("Đặt phòng thành công!", "success");
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
      handleSnackbar(
        error.message || "Đã xảy ra lỗi khi tạo đặt phòng. Vui lòng thử lại."
      );
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        marginLeft: "auto",
        boxSizing: "border-box",
        marginRight: "auto",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "0",
        paddingBottom: "32px",
      }}
    >
      {/* Phần tìm kiếm */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.15)" },
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <Box sx={{ p: 2, color: "white" }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            <HotelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Tìm Kiếm Phòng
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "white", p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ngày nhận phòng"
                  value={ngayNhanPhong}
                  minDateTime={dayjs()}
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      const newCheckInDateTime = dayjs(newValue);
                      setNgayNhanPhong(newCheckInDateTime);
                    } else {
                      setNgayNhanPhong(null);
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
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ngày trả phòng"
                  value={ngayTraPhong}
                  minDateTime={ngayNhanPhong ? ngayNhanPhong : dayjs()}
                  onChange={(newValue) => {
                    if (newValue && dayjs(newValue).isValid()) {
                      setNgayTraPhong(dayjs(newValue));
                    } else {
                      setNgayTraPhong(null);
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
            <Grid item xs={12} md={3}>
              <TextField
                label="Số người lớn"
                type="number"
                value={soNguoi}
                onChange={(e) => {
                  setSoNguoi(Math.max(1, Number(e.target.value)));
                  validateInputs();
                }}
                inputProps={{ min: 1 }}
                fullWidth
                size="medium"
                error={!!errors.soNguoi}
                helperText={errors.soNguoi}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Số trẻ em"
                type="number"
                value={soTre}
                onChange={(e) => {
                  setSoTre(Math.max(0, Number(e.target.value)));
                  validateInputs();
                }}
                inputProps={{ min: 0 }}
                fullWidth
                size="medium"
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
                    <ChildIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{
                textTransform: "none",
                color: "#1976d2",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              {showAdvancedFilters
                ? "Ẩn bộ lọc nâng cao"
                : "Hiển thị bộ lọc nâng cao"}
            </Button>
          </Box>

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
                    value={tongChiPhiMin || ""}
                    onChange={(e) => {
                      setTongChiPhiMin(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongChiPhiMin}
                    helperText={errors.tongChiPhiMin}
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
                    value={tongChiPhiMax || ""}
                    onChange={(e) => {
                      setTongChiPhiMax(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongChiPhiMax}
                    helperText={errors.tongChiPhiMax}
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
                    value={tongSucChuaMin || ""}
                    onChange={(e) => {
                      setTongSucChuaMin(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongSucChuaMin}
                    helperText={errors.tongSucChuaMin}
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
                    value={tongSucChuaMax || ""}
                    onChange={(e) => {
                      setTongSucChuaMax(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongSucChuaMax}
                    helperText={errors.tongSucChuaMax}
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
                    value={tongSoPhongMin || ""}
                    onChange={(e) => {
                      setTongSoPhongMin(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongSoPhongMin}
                    helperText={errors.tongSoPhongMin}
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
                    value={tongSoPhongMax || ""}
                    onChange={(e) => {
                      setTongSoPhongMax(
                        e.target.value ? Number(e.target.value) : null
                      );
                      validateInputs();
                    }}
                    fullWidth
                    error={!!errors.tongSoPhongMax}
                    helperText={errors.tongSoPhongMax}
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
                      <FormControl
                        fullWidth
                        error={!!errors[`loaiPhong_${index}`]}
                      >
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
                            validateInputs();
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
                        {!!errors[`loaiPhong_${index}`] && (
                          <Typography color="error" variant="caption">
                            {errors[`loaiPhong_${index}`]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Số lượng"
                        type="number"
                        value={lpc.soLuongChon || ""}
                        onChange={(e) => {
                          const newList = [...loaiPhongChons];
                          newList[index] = {
                            ...newList[index],
                            soLuongChon: e.target.value
                              ? Number(e.target.value)
                              : null,
                          };
                          setLoaiPhongChons(newList);
                          validateInputs();
                        }}
                        fullWidth
                        inputProps={{ min: 0 }}
                        error={!!errors[`soLuong_${index}`]}
                        helperText={errors[`soLuong_${index}`]}
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
                          validateInputs();
                        }}
                        sx={{ borderRadius: 1 }}
                      >
                        Xóa
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  {errors.loaiPhongChons && (
                    <Typography color="error" variant="caption">
                      {errors.loaiPhongChons}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      setLoaiPhongChons([
                        ...loaiPhongChons,
                        { loaiPhong: null, soLuongChon: null },
                      ])
                    }
                    sx={{ borderRadius: 1, mr: 2 }}
                  >
                    Thêm loại phòng
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSearchClick}
                    startIcon={<SearchIcon />}
                    sx={{
                      borderRadius: 1,
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "#115293" },
                    }}
                    disabled={Object.keys(errors).length > 0}
                  >
                    Tìm kiếm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Phần kết quả */}
      {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
        loaiPhongKhaDung.map((combination, combIndex) => (
          <Box
            key={combIndex}
            mb={4}
            sx={{
              "& .MuiTableContainer-root": {
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mb: 2,
                color: "#1e3c72",
                fontWeight: 600,
              }}
            >
              Tổ hợp {combIndex + 1}: Tổng sức chứa {combination.tongSucChua} -
              Tổng chi phí: {Number(combination.tongChiPhi).toLocaleString()}{" "}
              VND - Tổng số phòng: {combination.tongSoPhong}
            </Typography>
            <Button
              variant="outlined"
              color="success"
              size="small"
              onClick={() => handleCreateBooking(combination)}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(46, 125, 50, 0.04)",
                },
              }}
            >
              <BookmarkAddIcon sx={{ mr: 0.5 }} />
              Đặt phòng
            </Button>
            <TableContainer component={Paper}>
              <Table sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Diện tích(m²)</TableCell>
                    <TableCell>Số khách</TableCell>
                    <TableCell>Số trẻ em</TableCell>
                    <TableCell>Đơn giá (VND)</TableCell>
                    <TableCell>Số lượng chọn</TableCell>
                    <TableCell>Thành tiền (VND)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {combination.phongs.map((phong, idx) => (
                    <TableRow
                      key={phong.loaiPhong.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f8f9fa",
                          transition: "background-color 0.2s",
                        },
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {phong.loaiPhong?.tenLoaiPhong || "N/A"}
                      </TableCell>
                      <TableCell>
                        {phong.loaiPhong?.dienTich
                          ? `${phong.loaiPhong.dienTich} `
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {phong.loaiPhong?.soKhachTieuChuan
                          ? `${phong.loaiPhong.soKhachTieuChuan}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{phong.loaiPhong?.treEmTieuChuan}</TableCell>
                      <TableCell>
                        {phong.loaiPhong?.donGia
                          ? Number(phong.loaiPhong.donGia).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{phong.soLuongChon || 0}</TableCell>
                      <TableCell>
                        {phong.loaiPhong?.donGia && phong.soLuongChon
                          ? (
                              phong.soLuongChon * phong.loaiPhong.donGia
                            ).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography variant="h6" align="center" sx={{ color: "#1e3c72" }}>
          Không tìm thấy tổ hợp phòng nào phù hợp.
        </Typography>
      )}

      {/* Phần phân trang */}
      <Box
        sx={{
          mt: 3,
          py: 2,
          display: "flex",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={handlePageChange}
          sx={{
            "& .MuiPaginationItem-root": {
              "&.Mui-selected": {
                bgcolor: "#1976d2",
                color: "white",
              },
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default DatPhong;