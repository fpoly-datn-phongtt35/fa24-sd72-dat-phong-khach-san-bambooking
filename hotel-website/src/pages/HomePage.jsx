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
  IconButton,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getLPKDR } from "../services/DatPhong";

const HomePage = () => {
  const navigate = useNavigate();

  // State for the main form
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soNguoi, setSoNguoi] = useState(2);
  const [soPhong, setSoPhong] = useState(1);

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

  const fetchLoaiPhong = async () => {
    const n = dayjs(ngayNhanPhong).format("YYYY-MM-DD");
    const t = dayjs(ngayNhanPhong).format("YYYY-MM-DD");
    try {
      const response = await getLPKDR(n, t);
      if (response && response.data) {
        setLoaiPhongList(response.data);
      } else {
        console.error("Không tìm thấy loại phòng nào.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại phòng:", error);
    }
  };

  useEffect(() => {
    fetchLoaiPhong();
  }, []);

  const handleGuestChange = (change) => {
    setSoNguoi((prev) => Math.max(1, prev + change));
  };

  const handleRoomChange = (change) => {
    setSoPhong((prev) => Math.max(1, prev + change));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (
      !ngayNhanPhong ||
      !ngayTraPhong ||
      !ngayNhanPhong.isValid() ||
      !ngayTraPhong.isValid()
    ) {
      alert("Vui lòng chọn ngày nhận và trả phòng hợp lệ.");
      return;
    }

    if (ngayTraPhong.diff(ngayNhanPhong, "day") <= 0) {
      alert("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    // Redirect to booking page with search parameters
    navigate("/booking", {
      state: {
        ngayNhanPhong: dayjs(ngayNhanPhong).format("YYYY-MM-DD"),
        ngayTraPhong: dayjs(ngayTraPhong).format("YYYY-MM-DD"),
        soNguoi,
        soPhong,
        tongChiPhiMin,
        tongChiPhiMax,
        tongSucChuaMin,
        tongSucChuaMax,
        tongSoPhongMin,
        tongSoPhongMax,
        loaiPhongChons,
        key,
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="homepage-container">
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
                  <DatePicker
                    label="Ngày nhận phòng"
                    value={ngayNhanPhong}
                    minDate={dayjs()}
                    onChange={(newValue) => {
                      if (newValue && dayjs(newValue).isValid()) {
                        const newCheckInDate = dayjs(newValue);
                        setNgayNhanPhong(newCheckInDate);
                        if (
                          newCheckInDate.isSame(ngayTraPhong, "day") ||
                          newCheckInDate.isAfter(ngayTraPhong)
                        ) {
                          setNgayTraPhong(newCheckInDate.add(1, "day"));
                        }
                      } else {
                        setNgayNhanPhong(null);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "medium",
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: 1,
                            backgroundColor: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="Ngày trả phòng"
                    value={ngayTraPhong}
                    minDate={
                      ngayNhanPhong
                        ? ngayNhanPhong.add(1, "day")
                        : dayjs().add(1, "day")
                    }
                    onChange={(newValue) => {
                      if (newValue && dayjs(newValue).isValid()) {
                        setNgayTraPhong(dayjs(newValue));
                      } else {
                        setNgayTraPhong(null);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "medium",
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: 1,
                            backgroundColor: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    className="guest-room-box"
                  >
                    <Box mr={2}>
                      <Typography variant="body1">
                        {soNguoi} người lớn
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleGuestChange(-1)}
                      disabled={soNguoi <= 1}
                      sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleGuestChange(1)}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        ml: 1,
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
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
                  startIcon={<AddIcon />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  sx={{ color: "#1976d2" }}
                >
                  {showAdvancedFilters
                    ? "Ẩn bộ lọc"
                    : "Bộ lọc"}
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
                          onChange={(e) => setTongChiPhiMin(e.target.value)}
                          fullWidth
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
                          onChange={(e) => setTongChiPhiMax(e.target.value)}
                          fullWidth
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
                          onChange={(e) => setTongSucChuaMin(e.target.value)}
                          fullWidth
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
                          onChange={(e) => setTongSucChuaMax(e.target.value)}
                          fullWidth
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
                          onChange={(e) => setTongSoPhongMin(e.target.value)}
                          fullWidth
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
                          onChange={(e) => setTongSoPhongMax(e.target.value)}
                          fullWidth
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
                            <MenuItem value="">Lựa chọn</MenuItem>
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
                                newList[index] = {
                                  ...newList[index],
                                  soLuongChon: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                };
                                setLoaiPhongChons(newList);
                              }}
                              fullWidth
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
