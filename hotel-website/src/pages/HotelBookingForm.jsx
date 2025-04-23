import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  toHopLoaiPhong,
  ThemMoiDatPhong,
  addThongTinDatPhong,
  getKhachHangByUsername,
  getLPKDR,
} from "../services/DatPhong";
import dayjs from "dayjs";
import {
  Button,
  TextField,
  Snackbar,
  Box,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const HotelBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  // State for the main form, initialized with location.state
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

  // State for advanced filters, initialized with location.state
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

  // State for Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle Snackbar notifications
  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Handle guest count change via buttons
  const handleAdultChange = (change) => {
    setSoNguoi((prev) => Math.max(1, prev + change));
  };

  // Handle guest count change via input
  const handleSoNguoiChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 1)) {
      setSoNguoi(value === "" ? 1 : parseInt(value));
    }
  };

  const CHECK_IN_TIME = { hour: 12, minute: 0, second: 0 };
  const CHECK_OUT_TIME = { hour: 14, minute: 0, second: 0 };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !ngayNhanPhong ||
      !ngayTraPhong ||
      !ngayNhanPhong.isValid() ||
      !ngayTraPhong.isValid()
    ) {
      handleSnackbar("Vui lòng chọn ngày nhận và trả phòng hợp lệ.");
      setIsLoading(false);
      return;
    }

    if (ngayTraPhong.diff(ngayNhanPhong, "day") <= 0) {
      handleSnackbar("Ngày trả phòng phải sau ngày nhận phòng.");
      setIsLoading(false);
      return;
    }

    const ngayNhanPhongFormatted = ngayNhanPhong
      .set(CHECK_IN_TIME)
      .toISOString();
    const ngayTraPhongFormatted = ngayTraPhong
      .set(CHECK_OUT_TIME)
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
        loaiPhongChons || null,
        pageable
      );

      console.log("Tổ hợp phòng khả dụng:", response.content[0]?.phongs);
      if (!response || !response.content) {
        handleSnackbar("Không tìm thấy tổ hợp phòng phù hợp.");
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
      handleSnackbar("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
      setLoaiPhongKhaDung([]);
      setTotalPages(1);
      setCurrentPage(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoaiPhong = async () => {
    try {
      const n = dayjs(ngayNhanPhong).format("YYYY-MM-DD");
      const t = dayjs(ngayNhanPhong).format("YYYY-MM-DD");
      const response = await getLPKDR(n, t);
      console.log("Loại phòng khả dụng:", response);
      if (response && response.data) {
        setLoaiPhongList(response.data);
      } else {
        handleSnackbar("Không tìm thấy loại phòng nào.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại phòng:", error);
      handleSnackbar("Đã xảy ra lỗi khi tải loại phòng.");
    }
  };

  useEffect(() => {
    fetchLoaiPhong();
    let timeoutId;
    const fetchData = async () => {
      if (
        ngayNhanPhong &&
        ngayTraPhong &&
        soNguoi &&
        ngayNhanPhong.isValid() &&
        ngayTraPhong.isValid()
      ) {
        handleSearch({ preventDefault: () => {} });
      }
    };

    timeoutId = setTimeout(fetchData, 300);

    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    ngayNhanPhong,
    ngayTraPhong,
    soNguoi,
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
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];

    try {
      let user;
      try {
        user = localStorage.getItem("user");
        console.log("User:", user);
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }

      if (!user) {
        localStorage.setItem(
          "pendingData",
          JSON.stringify({
            combination,
            ngayNhanPhong: ngayNhanPhong.toISOString(),
            ngayTraPhong: ngayTraPhong.toISOString(),
            soNguoi,
          })
        );
        handleSnackbar("Vui lòng đăng nhập để tiếp tục đặt phòng.");
        setTimeout(() => {
          navigate("/login", { state: { from: location.pathname } });
        }, 1000);
        return;
      }

      let khachHangData;
      try {
        const response = await getKhachHangByUsername(user);
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
              maThongTinDatPhong: "TTD" + new Date().getTime() + i,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="booking-container">
        <div className="booking-header">
          <h1>Đặt Phòng Khách Sạn</h1>
          <p>Tìm kiếm phòng nhanh chóng với giá tốt nhất</p>
        </div>

        <form className="booking-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày nhận phòng (12:00)</label>
              <DatePicker
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
                    size: "small",
                    required: true,
                    sx: {
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                        backgroundColor: "#fff",
                      },
                    },
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
                    size: "small",
                    required: true,
                    sx: {
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                        backgroundColor: "#fff",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="form-group guest-group">
              <label>Số người</label>
              <div className="guest-counter">
                <IconButton
                  onClick={() => handleAdultChange(-1)}
                  disabled={soNguoi <= 1}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
                >
                  -
                </IconButton>
                <TextField
                  type="number"
                  value={soNguoi}
                  onChange={handleSoNguoiChange}
                  inputProps={{ min: 1 }}
                  size="small"
                  className="so-nguoi-input"
                  sx={{
                    width: 80,
                    mx: 1,
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#fff",
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleAdultChange(1)}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
                >
                  +
                </IconButton>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              className="search-btn"
              sx={{
                borderRadius: 1,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Tìm kiếm
            </Button>
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
