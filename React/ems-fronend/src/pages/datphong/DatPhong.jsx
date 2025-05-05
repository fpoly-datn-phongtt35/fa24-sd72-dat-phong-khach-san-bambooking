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
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
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

const DatPhong = () => {
  const [ngayNhanPhong, setNgayNhanPhong] = useState(dayjs());
  const [ngayTraPhong, setNgayTraPhong] = useState(dayjs().add(1, "day"));
  const [soNguoi, setSoNguoi] = useState(1);
  const [key, setKey] = useState("");
  const [tongChiPhiMin, setTongChiPhiMin] = useState("");
  const [tongChiPhiMax, setTongChiPhiMax] = useState("");
  const [tongSucChuaMin, setTongSucChuaMin] = useState("");
  const [tongSucChuaMax, setTongSucChuaMax] = useState("");
  const [tongSoPhongMin, setTongSoPhongMin] = useState("");
  const [tongSoPhongMax, setTongSoPhongMax] = useState("");
  const [loaiPhongChons, setLoaiPhongChons] = useState([]);
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();

  // Xử lý thông báo SweetAlert2
  const handleSnackbar = (message, type = "error") => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Thành công" : "Lỗi",
      text: message,
      timer: 3000,
      showConfirmButton: false,
    });
  };

  // Lấy danh sách loại phòng khả dụng
  const fetchLoaiPhong = async () => {
    try {
      if (
        ngayNhanPhong &&
        ngayTraPhong &&
        ngayNhanPhong.isValid() &&
        ngayTraPhong.isValid()
      ) {
        const response = await getLoaiPhongKhaDungResponse(
          ngayNhanPhong.format("YYYY-MM-DD"),
          ngayTraPhong.format("YYYY-MM-DD")
        );
        setLoaiPhongList(response.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại phòng:", error);
      handleSnackbar("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
    }
  };

  // Xử lý tìm kiếm tổ hợp phòng
  const handleSearch = async (page = currentPage) => {
    try {
      if (
        ngayNhanPhong &&
        ngayTraPhong &&
        ngayNhanPhong.isValid() &&
        ngayTraPhong.isValid()
      ) {
        const response = await toHopLoaiPhong(
          ngayNhanPhong.format("YYYY-MM-DD"),
          ngayTraPhong.format("YYYY-MM-DD"),
          soNguoi,
          key,
          tongChiPhiMin,
          tongChiPhiMax,
          tongSucChuaMin,
          tongSucChuaMax,
          tongSoPhongMin,
          tongSoPhongMax,
          loaiPhongChons,
          { page, size: pageSize }
        );

        setLoaiPhongKhaDung(response.content || []);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.number || 0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      handleSnackbar("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
    }
  };

  // Gọi fetchLoaiPhong và handleSearch khi thay đổi ngày hoặc pageSize
  useEffect(() => {
    fetchLoaiPhong();
    handleSearch(0);
  }, [ngayNhanPhong, ngayTraPhong, pageSize]);

  // Xử lý nút tìm kiếm
  const handleSearchClick = () => {
    handleSearch(0);
  };

  // Xử lý thay đổi trang
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

      // Tạo khách hàng
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

      // Tạo đặt phòng
      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + new Date().getTime(),
        soNguoi: soNguoi,
        soPhong: soPhong,
        ngayDat: dayjs().format("YYYY-MM-DD"),
        tongTien: combination.tongChiPhi,
        ghiChu: "Đặt phòng từ tổ hợp được chọn",
        trangThai: "Đang đặt phòng",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      // Tạo thông tin đặt phòng cho từng phòng
      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "TTDP" + new Date().getTime() + i,
              ngayNhanPhong: ngayNhanPhong.format("YYYY-MM-DD"),
              ngayTraPhong: ngayTraPhong.format("YYYY-MM-DD"),
              soNguoi: phong.loaiPhong.soKhachToiDa,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Đang đặt phòng",
            };
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

      // Kiểm tra số lượng ThongTinDatPhong có khớp với soPhong
      if (thongTinDatPhongResponseList.length !== soPhong) {
        throw new Error(
          "Số lượng thông tin đặt phòng không khớp với số phòng đã chọn."
        );
      }

      handleSnackbar("Thành công!", "success");
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                label="Số người"
                type="number"
                value={soNguoi}
                onChange={(e) => setSoNguoi(e.target.value)}
                inputProps={{ min: 1 }}
                fullWidth
                size="medium"
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSearchClick}
                startIcon={<SearchIcon />}
                sx={{
                  height: "56px",
                  fontWeight: "bold",
                  borderRadius: 1,
                  py: 1.5,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#115293" },
                }}
              >
                Tìm kiếm
              </Button>
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
                    <TableCell>Diện tích</TableCell>
                    <TableCell>Số khách tối đa</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng chọn</TableCell>
                    <TableCell>Thành tiền</TableCell>
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
                      <TableCell>{phong.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell>{phong.loaiPhong.dienTich} m²</TableCell>
                      <TableCell>
                        {phong.loaiPhong.soKhachToiDa} khách
                      </TableCell>
                      <TableCell>
                        {phong.loaiPhong.donGia.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{phong.soLuongChon}</TableCell>
                      <TableCell>
                        {(
                          phong.soLuongChon * phong.loaiPhong.donGia
                        ).toLocaleString()}{" "}
                        VND
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

      {/* Phân trang */}
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
