import React, { useEffect, useState, useCallback } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import HotelIcon from "@mui/icons-material/Hotel";
import { filterLoaiPhong } from "../../services/LoaiPhongService";
import FormAdd from "../loaiphong/FormAdd";
import FormDetail from "../loaiphong/FormDetail";
import Swal from "sweetalert2";

const LoaiPhong = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState({
    tenLoaiPhong: "",
    dienTichMin: "",
    dienTichMax: "",
    soKhachTieuChuan: "",
    soKhachToiDa: "",
    treEmTieuChuan: "",
    treEmToiDa: "",
    donGiaMin: "",
    donGiaMax: "",
    phuThuNguoiLonMin: "",
    phuThuNguoiLonMax: "",
    phuThuTreEmMin: "",
    phuThuTreEmMax: "",
    trangThai: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Xử lý thông báo (chỉ dùng cho lỗi tìm kiếm)
  const handleSnackbar = (message, type = "error") => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Thành công" : "Lỗi",
      text: message,
      timer: 3000,
      showConfirmButton: false,
    });
  };

  // Hàm tìm kiếm loại phòng
  const handleSearch = useCallback(
    async (newPage = page) => {
      try {
        const params = {
          tenLoaiPhong: searchTerm.tenLoaiPhong || null,
          dienTichMin: searchTerm.dienTichMin
            ? Number(searchTerm.dienTichMin)
            : null,
          dienTichMax: searchTerm.dienTichMax
            ? Number(searchTerm.dienTichMax)
            : null,
          soKhachTieuChuan: searchTerm.soKhachTieuChuan
            ? Number(searchTerm.soKhachTieuChuan)
            : null,
          soKhachToiDa: searchTerm.soKhachToiDa
            ? Number(searchTerm.soKhachToiDa)
            : null,
          treEmTieuChuan: searchTerm.treEmTieuChuan
            ? Number(searchTerm.treEmTieuChuan)
            : null,
          treEmToiDa: searchTerm.treEmToiDa
            ? Number(searchTerm.treEmToiDa)
            : null,
          donGiaMin: searchTerm.donGiaMin ? Number(searchTerm.donGiaMin) : null,
          donGiaMax: searchTerm.donGiaMax ? Number(searchTerm.donGiaMax) : null,
          phuThuNguoiLonMin: searchTerm.phuThuNguoiLonMin
            ? Number(searchTerm.phuThuNguoiLonMin)
            : null,
          phuThuNguoiLonMax: searchTerm.phuThuNguoiLonMax
            ? Number(searchTerm.phuThuNguoiLonMax)
            : null,
          phuThuTreEmMin: searchTerm.phuThuTreEmMin
            ? Number(searchTerm.phuThuTreEmMin)
            : null,
          phuThuTreEmMax: searchTerm.phuThuTreEmMax
            ? Number(searchTerm.phuThuTreEmMax)
            : null,
          trangThai: searchTerm.trangThai
            ? searchTerm.trangThai === "true"
            : null,
          page: newPage,
          size: rowsPerPage,
        };

        const response = await filterLoaiPhong(
          params.tenLoaiPhong,
          params.dienTichMin,
          params.dienTichMax,
          params.soKhachTieuChuan,
          params.soKhachToiDa,
          params.treEmTieuChuan,
          params.treEmToiDa,
          params.donGiaMin,
          params.donGiaMax,
          params.phuThuNguoiLonMin,
          params.phuThuNguoiLonMax,
          params.phuThuTreEmMin,
          params.phuThuTreEmMax,
          params.trangThai,
          { page: params.page, size: params.size }
        );

        setData(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setPage(response.data.number || 0);
      } catch (error) {
        console.error("Không thể tìm kiếm loại phòng:", error);
        handleSnackbar("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
        setData([]);
      }
    },
    [searchTerm, page, rowsPerPage]
  );

  // Gọi tìm kiếm khi thay đổi page hoặc rowsPerPage
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (e, newPage) => {
    setPage(newPage - 1);
    handleSearch(newPage - 1);
  };

  // Xử lý mở/đóng form thêm mới
  const handleOpenFormAdd = () => {
    setShowAddForm(true);
  };

  const handleCloseFormAdd = () => {
    setShowAddForm(false);
    handleSearch(); // Làm mới dữ liệu sau khi thêm mới
  };

  // Xử lý mở/đóng form chi tiết
  const handleOpenFormDetail = (id) => {
    const selectedItem = data.find((item) => item.id === id);
    setSelectedData(selectedItem);
    setShowDetailForm(true);
  };

  const handleCloseFormDetail = () => {
    setShowDetailForm(false);
    setSelectedData(null);
    handleSearch(); // Làm mới dữ liệu sau khi chỉnh sửa
  };

  // Xử lý thay đổi input tìm kiếm
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0); // Reset về trang đầu khi thay đổi bộ lọc
  };

  // Xử lý nút tìm kiếm
  const handleSearchClick = () => {
    handleSearch(0);
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
            Quản Lý Loại Phòng
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "white", p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Tên Loại Phòng"
                variant="outlined"
                size="medium"
                fullWidth
                name="tenLoaiPhong"
                value={searchTerm.tenLoaiPhong}
                onChange={handleInputChange}
                onKeyUp={() => handleSearch(0)}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                onClick={handleOpenFormAdd}
                sx={{
                  height: "56px",
                  fontWeight: "bold",
                  borderRadius: 1,
                  py: 1.5,
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                }}
              >
                Thêm
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Hiển thị số dòng</InputLabel>
                <Select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  label="Hiển thị số dòng"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
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
                    label="Diện tích tối thiểu (m²)"
                    type="number"
                    value={searchTerm.dienTichMin}
                    onChange={handleInputChange}
                    name="dienTichMin"
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
                    label="Diện tích tối đa (m²)"
                    type="number"
                    value={searchTerm.dienTichMax}
                    onChange={handleInputChange}
                    name="dienTichMax"
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
                    label="Số khách tiêu chuẩn"
                    type="number"
                    value={searchTerm.soKhachTieuChuan}
                    onChange={handleInputChange}
                    name="soKhachTieuChuan"
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
                    label="Số khách tối đa"
                    type="number"
                    value={searchTerm.soKhachToiDa}
                    onChange={handleInputChange}
                    name="soKhachToiDa"
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
                    label="Số trẻ em tiêu chuẩn"
                    type="number"
                    value={searchTerm.treEmTieuChuan}
                    onChange={handleInputChange}
                    name="treEmTieuChuan"
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
                    label="Số trẻ em tối đa"
                    type="number"
                    value={searchTerm.treEmToiDa}
                    onChange={handleInputChange}
                    name="treEmToiDa"
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
                    label="Đơn giá tối thiểu (VND)"
                    type="number"
                    value={searchTerm.donGiaMin}
                    onChange={handleInputChange}
                    name="donGiaMin"
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
                    label="Đơn giá tối đa (VND)"
                    type="number"
                    value={searchTerm.donGiaMax}
                    onChange={handleInputChange}
                    name="donGiaMax"
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
                    label="Phụ thu người lớn tối thiểu (VND)"
                    type="number"
                    value={searchTerm.phuThuNguoiLonMin}
                    onChange={handleInputChange}
                    name="phuThuNguoiLonMin"
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
                    label="Phụ thu người lớn tối đa (VND)"
                    type="number"
                    value={searchTerm.phuThuNguoiLonMax}
                    onChange={handleInputChange}
                    name="phuThuNguoiLonMax"
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
                    label="Phụ thu trẻ em tối thiểu (VND)"
                    type="number"
                    value={searchTerm.phuThuTreEmMin}
                    onChange={handleInputChange}
                    name="phuThuTreEmMin"
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
                    label="Phụ thu trẻ em tối đa (VND)"
                    type="number"
                    value={searchTerm.phuThuTreEmMax}
                    onChange={handleInputChange}
                    name="phuThuTreEmMax"
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
                  <FormControl fullWidth>
                    <InputLabel>Trạng Thái</InputLabel>
                    <Select
                      name="trangThai"
                      value={searchTerm.trangThai}
                      onChange={handleInputChange}
                      label="Trạng Thái"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#fff",
                        },
                      }}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="true">Kích Hoạt</MenuItem>
                      <MenuItem value="false">Không Kích Hoạt</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Phần kết quả */}
      <Box
        sx={{
          "& .MuiTableContainer-root": {
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}>
            <TableHead>
              <TableRow>
                <TableCell>Mã Loại Phòng</TableCell>
                <TableCell>Tên Loại Phòng</TableCell>
                <TableCell>Diện Tích (m²)</TableCell>
                <TableCell>Số Khách Tiêu Chuẩn</TableCell>
                <TableCell>Số Khách Tối Đa</TableCell>
                <TableCell>Số Trẻ Em Tiêu Chuẩn</TableCell>
                <TableCell>Số Trẻ Em Tối Đa</TableCell>
                <TableCell>Đơn Giá (VND)</TableCell>
                <TableCell>Phụ Thu Người Lớn (VND)</TableCell>
                <TableCell>Phụ Thu Trẻ Em (VND)</TableCell>
                <TableCell>Mô Tả</TableCell>
                <TableCell>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((ti) => (
                  <TableRow
                    key={ti.id}
                    hover
                    onClick={() => handleOpenFormDetail(ti.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "#f8f9fa",
                        transition: "background-color 0.2s",
                      },
                    }}
                  >
                    <TableCell>{ti.maLoaiPhong || "N/A"}</TableCell>
                    <TableCell>{ti.tenLoaiPhong || "N/A"}</TableCell>
                    <TableCell>{ti.dienTich || "N/A"}</TableCell>
                    <TableCell>{ti.soKhachTieuChuan || "N/A"}</TableCell>
                    <TableCell>{ti.soKhachToiDa || "N/A"}</TableCell>
                    <TableCell>{ti.treEmTieuChuan}</TableCell>
                    <TableCell>{ti.treEmToiDa}</TableCell>
                    <TableCell>
                      {ti.donGia ? ti.donGia.toLocaleString("vi-VN") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {ti.phuThuNguoiLon
                        ? ti.phuThuNguoiLon.toLocaleString("vi-VN")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {ti.phuThuTreEm
                        ? ti.phuThuTreEm.toLocaleString("vi-VN")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{ti.moTa || "N/A"}</TableCell>
                    <TableCell>
                      {ti.trangThai ? "Kích Hoạt" : "Không Kích Hoạt"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Typography variant="h6" sx={{ color: "#1e3c72" }}>
                      Không tìm thấy loại phòng nào phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
          page={page + 1}
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

      {/* Forms */}
      {showAddForm && (
        <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />
      )}
      {showDetailForm && (
        <FormDetail
          show={showDetailForm}
          handleClose={handleCloseFormDetail}
          data={selectedData}
        />
      )}
    </Container>
  );
};

export default LoaiPhong;