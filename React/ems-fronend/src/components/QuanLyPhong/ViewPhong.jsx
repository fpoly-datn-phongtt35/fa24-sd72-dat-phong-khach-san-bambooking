import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
  MenuItem,
  Select,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import dayjs from 'dayjs';
import { searchRooms, getRoomDetail } from '../../services/ViewPhong';
import { searchByIDPhong } from '../../services/ImageService';
import { getAllLoaiPhong } from '../../services/LoaiPhongService';

const QuanLyPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [tinhTrang, setTinhTrang] = useState(null);
  const [giaMin, setGiaMin] = useState(null);
  const [giaMax, setGiaMax] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [listImage, setlistImage] = useState({});
  const [soTang, setSoTang] = useState(null);
  const [idLoaiPhong, setIdLoaiPhong] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // Hàm tìm kiếm phòng
  const handleSearch = useCallback(() => {
    const min = giaMin !== null ? Number(giaMin) : null;
    const max = giaMax !== null ? Number(giaMax) : null;

    searchRooms(tinhTrang, min, max, keyword, idLoaiPhong.length > 0 ? idLoaiPhong : null, soTang)
      .then(async (roomList) => {
        if (Array.isArray(roomList)) {
          setRooms(roomList);
          const images = await Promise.all(
            roomList.map((room) =>
              searchByIDPhong(room.id).then((response) => ({
                id: room.id,
                data: response.data,
              }))
            )
          );

          const imageMap = images.reduce((acc, img) => {
            acc[img.id] = img.data;
            return acc;
          }, {});
          setlistImage(imageMap);
        } else {
          setRooms([]);
        }
      })
      .catch((error) => {
        console.error('Không thể tìm kiếm phòng:', error);
        setRooms([]);
      });
  }, [tinhTrang, giaMin, giaMax, keyword, idLoaiPhong, soTang]);

  useEffect(() => {
    getAllLoaiPhong()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setLoaiPhongs(response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách loại phòng:", error);
      });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [tinhTrang, giaMin, giaMax, keyword, idLoaiPhong, handleSearch]);

 
  const handleChangePage = (direction) => {
    if (direction === 'next' && page < totalPages - 1) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 0) {
      setPage(page - 1);
    }
  };

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const handleAddRoom = () => {
    navigate('/add-phong');
  };

  
  const handleEditRoom = (room) => {
    navigate(`/update-phong/${room.id}`, {
      state: { loaiPhong: room.loaiPhong },
    });
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setTinhTrang(value === 'all' ? null : value);
  };

  const handlePriceChange = () => {
    handleSearch();
  };

  const handleLoaiPhongChange = (e) => {
    const value = Number(e.target.value);
    setIdLoaiPhong((prev) =>
      prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
    );
  };

  const handleViewDetail = (roomId) => {
    const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    getRoomDetail(roomId, currentDate)
      .then((response) => {
        if (!response) {
          throw new Error('Không có thông tin chi tiết phòng.');
        }
        navigate(`/api/RoomDetail/${roomId}/${currentDate}`);
      })
      .catch(() => {
        alert('Chưa có xếp phòng, không thể xem chi tiết.');
      });
  };

  const paginatedRooms = rooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(rooms.length / rowsPerPage);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} sm={3}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bộ lọc
            </Typography>
            <TextField
              label="Tìm kiếm tên phòng..."
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyUp={handleSearch}
            />
            <Box sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
                Khoảng giá
              </FormLabel>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Min"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={giaMin !== null ? giaMin : ''}
                    onChange={(e) => setGiaMin(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handlePriceChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={giaMax !== null ? giaMax : ''}
                    onChange={(e) => setGiaMax(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handlePriceChange}
                  />
                </Grid>
              </Grid>
            </Box>
            <TextField
              label="Số tầng"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              value={soTang !== null ? soTang : ''}
              onChange={(e) => setSoTang(e.target.value ? Number(e.target.value) : null)}
              onBlur={handleSearch}
            />
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
                  Loại phòng
                </FormLabel>
                <FormGroup>
                  {loaiPhongs.map((loai) => (
                    <FormControlLabel
                      key={loai.id}
                      control={
                        <Checkbox
                          checked={idLoaiPhong.includes(loai.id)}
                          onChange={handleLoaiPhongChange}
                          value={loai.id}
                          size="small"
                        />
                      }
                      label={loai.tenLoaiPhong}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>
                  Tình trạng
                </FormLabel>
                <RadioGroup value={tinhTrang === null ? 'all' : tinhTrang} onChange={handleStatusChange} row>
                  <FormControlLabel value="all" control={<Radio size="small" />} label="Tất cả" />
                  <FormControlLabel value="Trống" control={<Radio size="small" />} label="Trống" />
                  <FormControlLabel value="Đang ở" control={<Radio size="small" />} label="Đang ở" />
                  <FormControlLabel value="Cần kiểm tra" control={<Radio size="small" />} label="Cần kiểm tra" />
                </RadioGroup>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={9}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" color="success" onClick={handleAddRoom}>
            Thêm phòng mới
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Mã phòng</TableCell>
                <TableCell>Tên phòng</TableCell>
                <TableCell>Giá (VND)</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(paginatedRooms) && paginatedRooms.length > 0 ? (
                paginatedRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      {listImage[room.id] && listImage[room.id][0] ? (
                        <img
                          src={listImage[room.id][0].duongDan}
                          alt="Phòng"
                          style={{
                            width: '80px',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        <Typography variant="caption">Không có hình ảnh</Typography>
                      )}
                    </TableCell>
                    <TableCell>{room.maPhong}</TableCell>
                    <TableCell>{room.tenPhong}</TableCell>
                    <TableCell>{room.loaiPhong?.donGia}</TableCell>
                    <TableCell>{room.tinhTrang}</TableCell>
                    <TableCell>{room.trangThai === true ? "Hoạt động" : "Ngừng hoạt động"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewDetail(room.id)}
                        sx={{ mr: 1 }}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleEditRoom(room)}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không tìm thấy phòng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <IconButton
              onClick={() => handleChangePage('prev')}
              disabled={page === 0}
              sx={{ p: 0.1 }} 
            >
              <ArrowBackIos sx={{ fontSize: '16px' }} /> 
            </IconButton>
            <Typography variant="body2" sx={{ mx: 2, alignSelf: 'center' }}>
              {page + 1}
              </Typography>
            <IconButton
              onClick={() => handleChangePage('next')}
              disabled={page >= totalPages - 1}
              sx={{ p: 0.1 }} 
            >
              <ArrowForwardIos sx={{ fontSize: '16px' }} /> 
            </IconButton>
          </Box>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default QuanLyPhong;