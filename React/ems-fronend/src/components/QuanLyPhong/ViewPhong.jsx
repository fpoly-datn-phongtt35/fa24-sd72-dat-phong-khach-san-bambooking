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
} from '@mui/material';
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
  const [idLoaiPhong, setIdLoaiPhong] = useState([]); // Thay đổi thành mảng
  const [loaiPhongs, setLoaiPhongs] = useState([]);

  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const min = giaMin !== null ? Number(giaMin) : null;
    const max = giaMax !== null ? Number(giaMax) : null;

    // Truyền mảng idLoaiPhong thay vì giá trị đơn
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
          console.error('Dữ liệu trả về không phải là mảng:', roomList);
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
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách loại phòng:", error);
      });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [tinhTrang, giaMin, giaMax, keyword, idLoaiPhong, handleSearch]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setTinhTrang(value === 'all' ? null : value);
  };

  const handlePriceChange = () => {
    handleSearch();
  };

  // Xử lý khi checkbox thay đổi
  const handleLoaiPhongChange = (e) => {
    const value = Number(e.target.value);
    setIdLoaiPhong((prev) =>
      prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
    );
  };

  const handleViewDetail = (roomId) => {
    getRoomDetail(roomId)
      .then((response) => {
        if (!response) {
          throw new Error('Không có thông tin chi tiết phòng.');
        } else {
          const ngayNhanPhong = new Date(response.thongTinDatPhong.ngayNhanPhong);
          const ngayHienTai = new Date();

          if (ngayNhanPhong.getTime() > ngayHienTai.getTime()) {
            alert(
              `Giờ nhận phòng (${ngayNhanPhong.toLocaleString('vi-VN')}) lớn hơn thời gian hiện tại (${ngayHienTai.toLocaleString(
                'vi-VN'
              )}). Không thể xem chi tiết.`
            );
          } else {
            navigate(`/api/RoomDetail/${roomId}`);
          }
        }
      })
      .catch(() => {
        alert('Chưa có xếp phòng, không thể xem chi tiết.');
      });
  };

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
                    onChange={(e) =>
                      setGiaMin(e.target.value ? Number(e.target.value) : null)
                    }
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
                    onChange={(e) =>
                      setGiaMax(e.target.value ? Number(e.target.value) : null)
                    }
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
                <RadioGroup
                  value={tinhTrang === null ? 'all' : tinhTrang}
                  onChange={handleStatusChange}
                  row
                >
                  <FormControlLabel value="all" control={<Radio size="small" />} label="Tất cả" />
                  <FormControlLabel
                    value="Available"
                    control={<Radio size="small" />}
                    label="Available"
                  />
                  <FormControlLabel
                    value="Occupied"
                    control={<Radio size="small" />}
                    label="Occupied"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Bảng danh sách phòng */}
      <Grid item xs={12} sm={9}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Mã phòng</TableCell>
                <TableCell>Tên phòng</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell>Giá (VND)</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map((room) => (
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
                    <TableCell>{room.tinhTrang}</TableCell>
                    <TableCell>{room.loaiPhong?.donGia}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewDetail(room.id)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không tìm thấy phòng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default QuanLyPhong;