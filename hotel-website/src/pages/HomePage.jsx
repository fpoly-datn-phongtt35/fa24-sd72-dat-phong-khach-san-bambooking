import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
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
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getLPKDR } from "../services/DatPhong";

const HomePage = () => {
  const navigate = useNavigate();

  // State for background slideshow
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [
    "/images/sanhkhachsan.jpg",
    "/images/beboi.jpg",
    "/images/phongdon.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Đổi ảnh mỗi 5 giây
    return () => clearInterval(interval);
  }, []);

  // Initialize check-in and check-out dates with specific times
  const now = dayjs();
  const initialCheckIn = now.startOf("day").set("hour", 14).set("minute", 0).set("second", 0);
  const initialCheckOut = initialCheckIn
    .add(1, "day")
    .set("hour", 12)
    .set("minute", 0)
    .set("second", 0);

  // State for the main form
  const [ngayNhanPhong, setNgayNhanPhong] = useState(initialCheckIn);
  const [ngayTraPhong, setNgayTraPhong] = useState(initialCheckOut);
  const [soNguoi, setSoNguoi] = useState(2);
  const [treEm, setTreEm] = useState(0);
  const [errors, setErrors] = useState({});

  // State for advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tongChiPhiMin, setTongChiPhiMin] = useState("");
  const [tongChiPhiMax, setTongChiPhiMax] = useState("");
  const [tongSucChuaMin, setTongSucChuaMin] = useState("");
  const [tongSucChuaMax, setTongSucChuaMax] = useState("");
  const [tongSoPhongMin, setTongSoPhongMin] = useState("");
  const [tongSoPhongMax, setTongSoPhongMax] = useState("");
  const [loaiPhongChons, setLoaiPhongChons] = useState([]);
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [key, setKey] = useState("");

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
    if (treEm < 0) {
      newErrors.treEm = "Số trẻ em không được nhỏ hơn 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        setLoaiPhongList([]);
        console.error("Không tìm thấy loại phòng nào.");
      }
    } catch (error) {
      setLoaiPhongList([]);
      console.error("Lỗi khi lấy loại phòng:", error);
    }
  };

  useEffect(() => {
    fetchLoaiPhong();
  }, [ngayNhanPhong, ngayTraPhong]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    navigate("/booking", {
      state: {
        ngayNhanPhong: ngayNhanPhong.toISOString(),
        ngayTraPhong: ngayTraPhong.toISOString(),
        soNguoi,
        treEm,
        tongChiPhiMin: tongChiPhiMin ? Number(tongChiPhiMin) : null,
        tongChiPhiMax: tongChiPhiMax ? Number(tongChiPhiMax) : null,
        tongSucChuaMin: tongSucChuaMin ? Number(tongSucChuaMin) : null,
        tongSucChuaMax: tongSucChuaMax ? Number(tongSucChuaMax) : null,
        tongSoPhongMin: tongSoPhongMin ? Number(tongSoPhongMin) : null,
        tongSoPhongMax: tongSoPhongMax ? Number(tongSoPhongMax) : null,
        loaiPhongChons,
        key,
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className="homepage-container"
        style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      >
        <div className="hero-section">
          <Typography variant="h2" className="hero-title">
            Chào mừng đến với BamBooking
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Tìm kiếm phòng hoàn hảo cho kỳ nghỉ của bạn
          </Typography>

          <Box className="booking-box">
            <form onSubmit={handleSearch} className="booking-form">
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
                    onChange={(e) => {
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
                    }}
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
                    value={treEm}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        setTreEm(value);
                        setErrors({ ...errors, treEm: "" });
                      } else {
                        setErrors({
                          ...errors,
                          treEm: "Số trẻ em không được nhỏ hơn 0",
                        });
                      }
                    }}
                    fullWidth
                    inputProps={{ min: 0 }}
                    error={!!errors.treEm}
                    helperText={errors.treEm}
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 1,
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#1565c0" },
                      height: 56,
                    }}
                  >
                    TÌM
                  </Button>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Button
                  variant="text"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  sx={{ color: "#1976d2" }}
                >
                  {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
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
                            const value = e.target.value;
                            setTongChiPhiMin(value ? Number(value) : "");
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
                            const value = e.target.value;
                            setTongChiPhiMax(value ? Number(value) : "");
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
                            const value = e.target.value;
                            setTongSucChuaMin(value ? Number(value) : "");
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
                            const value = e.target.value;
                            setTongSucChuaMax(value ? Number(value) : "");
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
                            const value = e.target.value;
                            setTongSoPhongMin(value ? Number(value) : "");
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
                            const value = e.target.value;
                            setTongSoPhongMax(value ? Number(value) : "");
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
                                sx={{
                                  borderRadius: 1,
                                  backgroundColor: "#fff",
                                }}
                              >
                                <MenuItem value="">Chọn loại phòng</MenuItem>
                                {loaiPhongList.map((lp) => (
                                  <MenuItem key={lp.id} value={lp.tenLoaiPhong}>
                                    <Box display="flex" alignItems="center">
                                      <img
                                        src="/images/phongdon.jpg"
                                        alt={lp.tenLoaiPhong}
                                        style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 8,
                                          borderRadius: 4,
                                          objectFit: "cover",
                                        }}
                                        onError={(e) =>
                                        (e.target.src =
                                          "/images/fallback.jpg")
                                        }
                                      />
                                      {lp.tenLoaiPhong}
                                    </Box>
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
                          onClick={() =>
                            setLoaiPhongChons([
                              ...loaiPhongChons,
                              { loaiPhong: null, soLuongChon: null },
                            ])
                          }
                          sx={{ borderRadius: 1 }}
                        >
                          Thêm loại phòng
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </form>
          </Box>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default HomePage;