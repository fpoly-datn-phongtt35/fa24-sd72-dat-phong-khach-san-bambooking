import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  TextareaAutosize,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { findTTDPByMaDatPhong } from '../../services/TTDP';
import { findDatPhongByMaDatPhong, CapNhatDatPhong } from '../../services/DatPhong';
import { phongDaXep } from '../../services/XepPhongService';
import XepPhong from '../XepPhong/XepPhong';
import DeleteIcon from '@mui/icons-material/Delete';

const ChiTietDatPhong = () => {
  const [datPhong, setDatPhong] = useState();
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [phongData, setPhongData] = useState({});
  const location = useLocation();
  const { maDatPhong } = location.state || {};
  const navigate = useNavigate();

  const getDetailDatPhong = (maDatPhong) => {
    findDatPhongByMaDatPhong(maDatPhong)
      .then((response) => setDatPhong(response.data))
      .catch((error) => console.error(error));

    findTTDPByMaDatPhong(maDatPhong)
      .then((response) => setThongTinDatPhong(response.data))
      .catch((error) => console.error(error));
  };

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setPhongData((prevData) => ({
          ...prevData,
          [maThongTinDatPhong]: response.data,
        }));
      })
      .catch((error) => console.error(error));
  };

  const openXepPhongModal = (ttdp) => {
    setSelectedTTDPs([ttdp]);
    setShowXepPhongModal(true);
  };

  const closeXepPhongModal = () => setShowXepPhongModal(false);

  const updateDatPhong = () => {
    CapNhatDatPhong(datPhong)
      .then(() => alert('Lưu thành công'))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (thongTinDatPhong.length > 0) {
      thongTinDatPhong.forEach((ttdp) => fetchPhongDaXep(ttdp.maThongTinDatPhong));
    }
  }, [thongTinDatPhong]);

  useEffect(() => {
    if (maDatPhong) {
      getDetailDatPhong(maDatPhong);
    }
  }, [maDatPhong]);

  const calculateTotalGuests = () =>
    thongTinDatPhong.reduce((total, ttdp) => total + ttdp.soNguoi, 0);

  const calculateTotalPrice = (donGia, start, end) => {
    const days = Math.max(
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)),
      1
    );
    return donGia * days;
  };

  const handleCheckboxChange = (ttdp) => {
    setSelectedTTDPs((prevSelected) => {
      if (prevSelected.includes(ttdp)) {
        return prevSelected.filter((item) => item !== ttdp);
      } else {
        return [...prevSelected, ttdp];
      }
    });
  };

  const handleTTDPClick = (maThongTinDatPhong) => {
    navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chi Tiết Đặt Phòng
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 300, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Thông tin người đặt</Typography>
            <Typography><strong>Tên khách đặt:</strong> {datPhong?.khachHang?.ho} {datPhong?.khachHang?.ten || 'Không có thông tin'}</Typography>
            <Typography><strong>Email:</strong> {datPhong?.khachHang?.email || 'Không có thông tin'}</Typography>
            <Typography><strong>Số điện thoại:</strong> {datPhong?.khachHang?.sdt || 'Không có thông tin'}</Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Thông tin đặt phòng</Typography>
            <Typography><strong>Ngày đặt:</strong> {datPhong?.ngayDat}</Typography>
            <Typography><strong>Số phòng:</strong> {thongTinDatPhong.length}</Typography>
            <Typography><strong>Số người:</strong> {calculateTotalGuests()}</Typography>
            <Typography><strong>Tổng tiền:</strong> {datPhong?.tongTien}</Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Ghi chú</Typography>
            <TextareaAutosize
              minRows={4}
              style={{ width: '100%' }}
              placeholder="Nhập ghi chú ở đây..."
              value={datPhong?.ghiChu || ''}
              onChange={(e) => setDatPhong({ ...datPhong, ghiChu: e.target.value })}
            />
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chọn</TableCell>
                <TableCell>Thông Tin Đặt Phòng</TableCell>
                <TableCell>Tên Khách Hàng</TableCell>
                <TableCell>Số Người</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Ngày Nhận</TableCell>
                <TableCell>Ngày Trả</TableCell>
                <TableCell>Tiền Phòng</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {thongTinDatPhong.length > 0 ? (
                thongTinDatPhong.map((ttdp) => (
                  <TableRow key={ttdp.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTTDPs.includes(ttdp)}
                        onChange={() => handleCheckboxChange(ttdp)}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleTTDPClick(ttdp.maThongTinDatPhong)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {ttdp.maThongTinDatPhong}
                    </TableCell>
                    <TableCell>{ttdp?.datPhong?.khachHang?.ho} {ttdp?.datPhong?.khachHang?.ten}</TableCell>
                    <TableCell>{ttdp.soNguoi}</TableCell>
                    <TableCell>{phongData[ttdp.maThongTinDatPhong]?.phong?.tenPhong || ttdp.loaiPhong.tenLoaiPhong}</TableCell>
                    <TableCell>{ttdp.ngayNhanPhong}</TableCell>
                    <TableCell>{ttdp.ngayTraPhong}</TableCell>
                    <TableCell>{calculateTotalPrice(ttdp.giaDat, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()}</TableCell>
                    <TableCell>
                      {!phongData[ttdp.maThongTinDatPhong]?.phong?.tenPhong && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => openXepPhongModal(ttdp)}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant="contained" color="primary" onClick={updateDatPhong}>
            Lưu
          </Button>
          <Button variant="outlined" color="primary" onClick={() => setShowXepPhongModal(true)}>
            Assign
          </Button>
        </Box>
      </Box>

      <XepPhong
        show={showXepPhongModal}
        handleClose={closeXepPhongModal}
        selectedTTDPs={selectedTTDPs}
      />
    </Container>
  );
};

export default ChiTietDatPhong;
