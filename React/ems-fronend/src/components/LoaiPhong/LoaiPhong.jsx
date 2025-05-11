import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormLabel,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { filterLoaiPhong } from '../../services/LoaiPhongService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const LoaiPhong = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState({
    tenLoaiPhong: '',
    dienTichMin: '',
    dienTichMax: '',
    soKhach: '',
    donGiaMin: '',
    donGiaMax: '',
    donGiaPhuThuMin: '',
    donGiaPhuThuMax: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);

  // Hàm tìm kiếm loại phòng
  const handleSearch = useCallback(() => {
    const params = {
      tenLoaiPhong: searchTerm.tenLoaiPhong || null,
      dienTichMin: searchTerm.dienTichMin ? Number(searchTerm.dienTichMin) : null,
      dienTichMax: searchTerm.dienTichMax ? Number(searchTerm.dienTichMax) : null,
      soKhach: searchTerm.soKhach ? Number(searchTerm.soKhach) : null,
      donGiaMin: searchTerm.donGiaMin ? Number(searchTerm.donGiaMin) : null,
      donGiaMax: searchTerm.donGiaMax ? Number(searchTerm.donGiaMax) : null,
      donGiaPhuThuMin: searchTerm.donGiaPhuThuMin ? Number(searchTerm.donGiaPhuThuMin) : null,
      donGiaPhuThuMax: searchTerm.donGiaPhuThuMax ? Number(searchTerm.donGiaPhuThuMax) : null,
      page,
      size: rowsPerPage,
    };

    filterLoaiPhong(
      params.tenLoaiPhong,
      params.dienTichMin,
      params.dienTichMax,
      params.soKhach,
      params.donGiaMin,
      params.donGiaMax,
      params.donGiaPhuThuMin,
      params.donGiaPhuThuMax,
      { page: params.page, size: params.size }
    )
      .then((response) => {
        setData(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      })
      .catch((error) => {
        console.error('Không thể tìm kiếm loại phòng:', error);
        setData([]);
      });
  }, [searchTerm, page, rowsPerPage]);

  // Gọi tìm kiếm khi thay đổi page, rowsPerPage hoặc searchTerm
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý thay đổi trang
  const handleChangePage = (direction) => {
    if (direction === 'next' && page < totalPages - 1) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 0) {
      setPage(page - 1);
    }
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

  // Dữ liệu phân trang
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Bộ lọc */}
      <Grid item xs={12} sm={3}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bộ lọc
            </Typography>
            <TextField
              label="Tìm kiếm tên loại phòng..."
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              name="tenLoaiPhong"
              value={searchTerm.tenLoaiPhong || ""}
              onChange={handleInputChange}
              onKeyUp={handleSearch}
            />
            <Box sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ fontSize: "0.9rem", mb: 1 }}>
                Khoảng diện tích
              </FormLabel>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Min"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dienTichMin"
                    value={searchTerm.dienTichMin || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dienTichMax"
                    value={searchTerm.dienTichMax || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
              </Grid>
            </Box>
            <TextField
              label="Số khách tối đa"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              name="soKhach"
              value={searchTerm.soKhach || ""}
              onChange={handleInputChange}
              onBlur={handleSearch}
            />
            <Box sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ fontSize: "0.9rem", mb: 1 }}>
                Khoảng đơn giá
              </FormLabel>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Min"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="donGiaMin"
                    value={searchTerm.donGiaMin || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="donGiaMax"
                    value={searchTerm.donGiaMax || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ fontSize: "0.9rem", mb: 1 }}>
                Khoảng đơn giá phụ thu
              </FormLabel>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Min"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="donGiaPhuThuMin"
                    value={searchTerm.donGiaPhuThuMin || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="donGiaPhuThuMax"
                    value={searchTerm.donGiaPhuThuMax || ""}
                    onChange={handleInputChange}
                    onBlur={handleSearch}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Bảng dữ liệu */}
      <Grid item xs={12} sm={9}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenFormAdd}
          >
            Thêm loại phòng
          </Button>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Hiển thị:
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              size="small"
              sx={{ minWidth: 60 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
            </Select>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="loai phong table">
            <TableHead>
              <TableRow>
                <TableCell>Mã loại phòng</TableCell>
                <TableCell>Tên loại phòng</TableCell>
                <TableCell>Diện tích</TableCell>
                <TableCell>Số khách tối đa</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Đơn giá phụ thu</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((ti) => (
                  <TableRow
                    key={ti.id}
                    hover
                    onClick={() => handleOpenFormDetail(ti.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{ti.maLoaiPhong}</TableCell>
                    <TableCell>{ti.tenLoaiPhong}</TableCell>
                    <TableCell>{ti.dienTich}</TableCell>
                    <TableCell>{ti.soKhachToiDa}</TableCell>
                    <TableCell>
                      {ti.donGia?.toLocaleString("vi-VN") || "N/A"}
                    </TableCell>
                    <TableCell>
                      {ti.donGiaPhuThu?.toLocaleString("vi-VN") || "N/A"}
                    </TableCell>
                    <TableCell>{ti.moTa || "N/A"}</TableCell>
                    <TableCell>{ti.trangThai ? "Hoạt động" : "Không hoạt động"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy loại phòng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <IconButton
              onClick={() => handleChangePage("prev")}
              disabled={page === 0}
              sx={{ p: 0.1 }}
            >
              <ArrowBackIos sx={{ fontSize: "16px" }} />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 2, alignSelf: "center" }}>
              {page + 1}
            </Typography>
            <IconButton
              onClick={() => handleChangePage("next")}
              disabled={page >= totalPages - 1}
              sx={{ p: 0.1 }}
            >
              <ArrowForwardIos sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        </TableContainer>
      </Grid>

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
    </Grid>
  );
};

export default LoaiPhong;