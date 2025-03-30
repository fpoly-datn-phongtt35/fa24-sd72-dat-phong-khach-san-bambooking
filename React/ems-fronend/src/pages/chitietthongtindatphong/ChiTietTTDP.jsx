import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTTDPByMaTTDP } from '../../services/TTDP';
import { phongDaXep } from '../../services/XepPhongService';
import XepPhong from "../xepphong/XepPhong";
import { hienThi } from '../../services/KhachHangCheckin';
import ModalKhachHangCheckin from '../../components/DatPhong/ModalKhachHangCheckin';
import ModalDoiNgay from '../../components/DatPhong/ModalDoiNgay';
import { updateThongTinDatPhong } from '../../services/TTDP';

const ChiTietTTDP = () => {
  const navigate = useNavigate();
  const [thongTinDatPhong, setThongTinDatPhong] = useState(null);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [phongData, setPhongData] = useState({});
  const location = useLocation();
  const { maThongTinDatPhong } = location.state || {};
  const [khachHangCheckin, setKhachHangCheckin] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalDoiNgayOpen, setModalDoiNgayOpen] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);

  const getDetailTTDP = (maThongTinDatPhong) => {
    getTTDPByMaTTDP(maThongTinDatPhong)
      .then((response) => {
        setThongTinDatPhong(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin đặt phòng:', error);
      });
  };

  const fetchKhachHangCheckin = (maThongTinDatPhong) => {
    hienThi(maThongTinDatPhong)
      .then((response) => {
        setKhachHangCheckin(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
      });
  };

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setPhongData(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin phòng đã xếp:', error);
      });
  };

  const capNhatTTDP = () => {
    const TTDPRequest = {
      id: thongTinDatPhong.id,
      datPhong: thongTinDatPhong.datPhong,
      idLoaiPhong: thongTinDatPhong.loaiPhong.id,
      maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong,
      ngayNhanPhong: thongTinDatPhong.ngayNhanPhong,
      ngayTraPhong: thongTinDatPhong.ngayTraPhong,
      soNguoi: thongTinDatPhong.soNguoi,
      giaDat: thongTinDatPhong.giaDat,
      ghiChu: thongTinDatPhong.ghiChu,
      trangThai: thongTinDatPhong.trangThai,
    };
    updateThongTinDatPhong(TTDPRequest)
      .then((response) => {
        console.log(response.data);
        navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật thông tin đặt phòng:', error);
      });
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const calculateTotalPrice = (donGia, start, end) => {
    const days = calculateDays(start, end);
    return donGia * days;
  };

  useEffect(() => {
    if (maThongTinDatPhong) {
      getDetailTTDP(maThongTinDatPhong);
      fetchPhongDaXep(maThongTinDatPhong);
      fetchKhachHangCheckin(maThongTinDatPhong);
    }
  }, [maThongTinDatPhong]);

  const handleModalKHC = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const openXepPhongModal = (thongTinDatPhong) => {
    setSelectedTTDPs([thongTinDatPhong]); // Gán thành mảng chứa phần tử duy nhất
    setShowXepPhongModal(true);
  };

  const closeXepPhongModal = () => {
    setShowXepPhongModal(false);
    navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
  };

  const handleModalDoiNgay = () => {
    setModalDoiNgayOpen(true);
  };

  const handleCloseModalDoiNgay = () => {
    setModalDoiNgayOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Thông tin đặt phòng */}
      <Grid container spacing={2}>
        {/* Box thông tin đặt phòng */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin đặt phòng
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Mã đặt phòng:</Typography>
                <Typography variant="body1">
                  {thongTinDatPhong?.maThongTinDatPhong || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Số người:</Typography>
                <Typography variant="body1">
                  {thongTinDatPhong?.soNguoi || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Tổng tiền:</Typography>
                <Typography variant="body1" color="primary">
                  {calculateTotalPrice(
                    thongTinDatPhong?.giaDat || 0,
                    thongTinDatPhong?.ngayNhanPhong,
                    thongTinDatPhong?.ngayTraPhong
                  ).toLocaleString('vi-VN')}{' '}
                  VND
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Trạng thái:</Typography>
                <Typography variant="body1">
                  {thongTinDatPhong?.trangThai || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Box thông tin ngày */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Ngày</Typography>
                <Button variant="outlined" size="small" onClick={handleModalDoiNgay}>
                  Sửa
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                {/* Ngày nhận phòng */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2">Ngày nhận phòng</Typography>
                  <Typography variant="body1">
                    {thongTinDatPhong?.ngayNhanPhong
                      ? new Date(thongTinDatPhong.ngayNhanPhong).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
                {/* Số đêm */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">🌙</Typography>
                  <Typography variant="body1">
                    {calculateDays(thongTinDatPhong?.ngayNhanPhong, thongTinDatPhong?.ngayTraPhong)}
                  </Typography>
                </Box>
                {/* Ngày trả phòng */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2">Ngày trả phòng</Typography>
                  <Typography variant="body1">
                    {thongTinDatPhong?.ngayTraPhong
                      ? new Date(thongTinDatPhong.ngayTraPhong).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Box trạng thái phòng */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng thái phòng
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Phòng:</Typography>
                <Typography variant="body1">
                  {phongData?.phong?.tenPhong || 'Chưa xếp phòng'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => openXepPhongModal(thongTinDatPhong)}
                disabled={!!phongData?.phong}
                sx={{ mb: 2 }}
              >
                {phongData?.phong ? 'Đã xếp phòng' : 'Xếp phòng'}
              </Button>
              <Box>
                <Typography variant="subtitle2">Ghi chú:</Typography>
                <TextField
                  multiline
                  fullWidth
                  minRows={3}
                  placeholder="Nhập ghi chú ở đây..."
                  value={thongTinDatPhong?.ghiChu || ""}
                  onChange={(e) =>
                    setThongTinDatPhong({ ...thongTinDatPhong, ghiChu: e.target.value })
                  }
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Thông tin khách hàng */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin khách hàng
        </Typography>
        <Grid container spacing={2}>
          {khachHangCheckin.length > 0 ? (
            khachHangCheckin.map((khc, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color={khc?.khachHang?.trangThai === true ? 'success.main' : 'error.main'}
                      >
                        {khc?.khachHang?.trangThai === true ? 'Verified' : 'Unverified'}
                      </Typography>
                      <Typography variant="h6">
                        {khc?.khachHang?.ho + ' ' + khc?.khachHang?.ten ||
                          'Khách chưa xác định'}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Ngày đến: {khc.thongTinDatPhong.ngayNhanPhong}
                      </Typography>
                      <Typography variant="body2">
                        Ngày đi: {khc.thongTinDatPhong.ngayTraPhong}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Giới tính:</Typography>
                      <Typography variant="body1">
                        {khc.khachHang.gioiTinh || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Địa chỉ:</Typography>
                      <Typography variant="body1">
                        {khc.khachHang.diaChi || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Email:</Typography>
                      <Typography variant="body1">
                        {khc.khachHang.email || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Phone:</Typography>
                      <Typography variant="body1">
                        {khc.khachHang.sdt || 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="outlined">
                      Chỉnh sửa
                    </Button>
                    <Button size="small" variant="outlined" color="error">
                      Xóa
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                      Xác nhận
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">Không có dữ liệu khách hàng</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleModalKHC}>
                + Add verified guest
              </Button>
              <Button variant="contained">+ Add unverified guest</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Các nút hành động */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={capNhatTTDP}>
          Update
        </Button>
        <Button variant="contained" color="success">
          Checkin
        </Button>
      </Box>

      {/* Các modal */}
      <ModalKhachHangCheckin
        isOpen={isModalOpen}
        onClose={handleClose}
        thongTinDatPhong={thongTinDatPhong}
      />
      <XepPhong
        show={showXepPhongModal}
        handleClose={closeXepPhongModal}
        selectedTTDPs={selectedTTDPs}
      />
      <ModalDoiNgay
        isOpen={isModalDoiNgayOpen}
        onClose={handleCloseModalDoiNgay}
        thongTinDatPhong={thongTinDatPhong}
      />
    </Box>
  );
};

export default ChiTietTTDP;
