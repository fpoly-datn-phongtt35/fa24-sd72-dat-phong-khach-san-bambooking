import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPhong, getLoaiPhong, getOnePhong, updatePhong } from '../../services/PhongService';
import { uploadImage, searchByIDPhong } from '../../services/ImageService';
import Swal from 'sweetalert2';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Phong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [maPhong, setMaPhong] = useState('');
  const [tenPhong, setTenPhong] = useState('');
  const [idLoaiPhong, setIdLoaiPhong] = useState('');
  const [lp, setLoaiPhong] = useState([]);
  const [tinhTrang, setTinhTrang] = useState('');
  const [trangThai, setTrangThai] = useState(true);
  const [errors, setErrors] = useState({});
  const [listImage, setlistImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getLoaiPhong()
      .then((response) => {
        setLoaiPhong(response.data);
      })
      .catch((error) => {
        console.log('Có lỗi khi lấy loại phòng: ' + error);
      });

    if (id) {
      getOnePhong(id)
        .then((response) => {
          const { maPhong, tenPhong, idLoaiPhong, tinhTrang, trangThai } = response.data;
          setMaPhong(maPhong);
          setTenPhong(tenPhong);
          setIdLoaiPhong(idLoaiPhong);
          setTinhTrang(tinhTrang);
          setTrangThai(trangThai);
        })
        .catch((error) => {
          console.log('Có lỗi khi lấy phòng: ' + error);
        });
    }

    searchByIDPhong(id)
      .then((response) => {
        setlistImage(response.data);
      })
      .catch((error) => {
        console.log('Có lỗi khi lấy ảnh phòng: ' + error);
      });
  }, [id]);

  const saveOrUpdate = (e) => {
    e.preventDefault();

    const phong = {
      maPhong,
      tenPhong,
      idLoaiPhong,
      tinhTrang: id ? tinhTrang : 'available',
      trangThai: trangThai ? 'true' : 'false',
    };

    const handleError = (error) => {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể hoàn thành thao tác. Vui lòng kiểm tra lại!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi không xác định.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    Swal.fire({
      title: id ? 'Xác nhận cập nhật' : 'Xác nhận thêm mới',
      text: id ? 'Bạn có chắc chắn muốn cập nhật thông tin phòng?' : 'Bạn có chắc chắn muốn thêm phòng mới?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: id ? 'Cập nhật' : 'Thêm mới',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          updatePhong(id, phong)
            .then((response) => {
              if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('tenAnh', tenPhong);
                formData.append('idPhong', id);
                formData.append('tinhTrang', tinhTrang);
                formData.append('trangThai', trangThai ? 'true' : 'false');
                return uploadImage(formData);
              }
            })
            .then((uploadResponse) => {
              Swal.fire({
                title: 'Thành công!',
                text: 'Thông tin phòng đã được cập nhật.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => navigate('/quan-ly-phong'));
            })
            .catch(handleError);
        } else {
          createPhong(phong)
            .then((response) => {
              const newPhongId = response.data.id;
              if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('tenAnh', tenPhong);
                formData.append('idPhong', newPhongId);
                formData.append('tinhTrang', 'available');
                formData.append('trangThai', 'true');
                return uploadImage(formData);
              }
            })
            .then((uploadResponse) => {
              Swal.fire({
                title: 'Thành công!',
                text: 'Phòng mới đã được thêm.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => navigate('/quan-ly-phong'));
            })
            .catch(handleError);
        }
      }
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listImage.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + listImage.length) % listImage.length);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Phần hiển thị ảnh */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Ảnh phòng
              </Typography>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                {listImage && listImage.length > 0 ? (
                  <>
                    <IconButton onClick={prevSlide} sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
                      <ArrowBackIosIcon />
                    </IconButton>
                    <img
                      src={listImage[currentIndex].duongDan}
                      alt={`Ảnh phòng ${currentIndex + 1}`}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                    <IconButton onClick={nextSlide} sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </>
                ) : (
                  <Typography>Chưa có ảnh</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Phần form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                {id ? 'Cập nhật phòng' : 'Thêm phòng'}
              </Typography>
              <form>
                <TextField
                  label="Mã phòng"
                  fullWidth
                  value={maPhong}
                  onChange={(e) => setMaPhong(e.target.value)}
                  error={!!errors.maPhong}
                  helperText={errors.maPhong}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Tên phòng"
                  fullWidth
                  value={tenPhong}
                  onChange={(e) => setTenPhong(e.target.value)}
                  error={!!errors.tenPhong}
                  helperText={errors.tenPhong}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Loại phòng</InputLabel>
                  <Select
                    value={idLoaiPhong}
                    onChange={(e) => setIdLoaiPhong(e.target.value)}
                    error={!!errors.idLoaiPhong}
                  >
                    <MenuItem value="">Chọn loại phòng</MenuItem>
                    {lp.map((loaiPhong) => (
                      <MenuItem key={loaiPhong.id} value={loaiPhong.id}>
                        {loaiPhong.tenLoaiPhong}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.idLoaiPhong && <Typography color="error">{errors.idLoaiPhong}</Typography>}
                </FormControl>
                {id && (
                  <>
                    <TextField
                      label="Tình trạng"
                      fullWidth
                      value={tinhTrang}
                      onChange={(e) => setTinhTrang(e.target.value)}
                      error={!!errors.tinhTrang}
                      helperText={errors.tinhTrang}
                      sx={{ mb: 2 }}
                    />
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <Typography>Trạng thái</Typography>
                      <RadioGroup
                        row
                        value={trangThai}
                        onChange={(e) => setTrangThai(e.target.value === 'true')}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="Hoạt động" />
                        <FormControlLabel value={false} control={<Radio />} label="Ngừng hoạt động" />
                      </RadioGroup>
                    </FormControl>
                  </>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography>Chọn ảnh:</Typography>
                  <input type="file" onChange={handleFileChange} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={saveOrUpdate}>
                    {id ? 'Cập nhật' : 'Thêm'}
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => navigate('/quan-ly-phong')}>
                    Quay lại
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Phong;