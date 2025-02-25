import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Typography,
  Grid,
  Card,
  CardContent,
  FormLabel,
} from '@mui/material';
import { listLoaiPhong, filterLoaiPhong } from '../../services/LoaiPhongService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const LoaiPhong = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 7;
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

  const getAllSanPham = () => {
    const apicall = filterLoaiPhong(
      searchTerm.tenLoaiPhong,
      searchTerm.dienTichMin,
      searchTerm.dienTichMax,
      searchTerm.soKhach,
      searchTerm.donGiaMin,
      searchTerm.donGiaMax,
      searchTerm.donGiaPhuThuMin,
      searchTerm.donGiaPhuThuMax,
      { page: currentPage, size: itemsPerPage }
    );
    apicall
      .then((response) => {
        setData(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllSanPham();
  }, [currentPage, searchTerm]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);

  const handleOpenFormAdd = () => {
    setShowAddForm(true);
  };

  const handleCloseFormAdd = () => {
    setShowAddForm(false);
  };

  const handleOpenFormDetail = (id) => {
    const selectedItem = data.find((item) => item.id === id);
    setSelectedData(selectedItem);
    setShowDetailForm(true);
  };

  const handleCloseFormDetail = () => {
    setShowDetailForm(false);
    setSelectedData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setCurrentPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
        
      <Grid container spacing={3}>
        
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
                value={searchTerm.tenLoaiPhong || ''}
                onChange={handleInputChange}
              />

              {/* Diện tích */}
              <Box sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
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
                      value={searchTerm.dienTichMin || ''}
                      onChange={handleInputChange}
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
                      value={searchTerm.dienTichMax || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Số khách */}
              <TextField
                label="Số khách tối đa"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                name="soKhach"
                value={searchTerm.soKhach || ''}
                onChange={handleInputChange}
              />

              {/* Đơn giá */}
              <Box sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
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
                      value={searchTerm.donGiaMin || ''}
                      onChange={handleInputChange}
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
                      value={searchTerm.donGiaMax || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Đơn giá phụ thu */}
              <Box sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
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
                      value={searchTerm.donGiaPhuThuMin || ''}
                      onChange={handleInputChange}
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
                      value={searchTerm.donGiaPhuThuMax || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table */}
        <Grid item xs={12} sm={9}>
            {/* Add Button */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="secondary" onClick={handleOpenFormAdd}>
              Thêm mới
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="loai phong table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên loại phòng</TableCell>
                  <TableCell>Mã loại phòng</TableCell>
                  <TableCell>Diện tích</TableCell>
                  <TableCell>Số khách tối đa</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Đơn giá phụ thu</TableCell>
                  <TableCell>Mô tả</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((ti) => (
                    <TableRow
                      key={ti.id}
                      hover
                      onClick={() => handleOpenFormDetail(ti.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{ti.id}</TableCell>
                      <TableCell>{ti.tenLoaiPhong}</TableCell>
                      <TableCell>{ti.maLoaiPhong}</TableCell>
                      <TableCell>{ti.dienTich}</TableCell>
                      <TableCell>{ti.soKhachToiDa}</TableCell>
                      <TableCell>{ti.donGia}</TableCell>
                      <TableCell>{ti.donGiaPhuThu}</TableCell>
                      <TableCell>{ti.moTa}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Không có dữ liệu tìm kiếm
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>

          
        </Grid>
      </Grid>

      {/* Forms */}
      {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}
      {showDetailForm && (
        <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />
      )}
    </Box>
  );
};

export default LoaiPhong;