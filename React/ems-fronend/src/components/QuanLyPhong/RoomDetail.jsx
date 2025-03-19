import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomDetail, getDichVuSuDungByIDXepPhong, AddDichVuSuDung, AddDVDK } from '../../services/ViewPhong';
import { CapNhatDichVuSuDung } from "../../services/DichVuSuDungService";
import DVSVDetail from './DVSDDetail';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { Switch } from '@mui/joy'

const RoomDetail = () => {
  const { roomId } = useParams();
  const [idXepPhong, setIdXepPhong] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [ListDVSD, setListDVSD] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [newDichVu, setNewDichVu] = useState({
    dichVu: { id: '' },
    xepPhong: { id: '' },
    soLuongSuDung: '',
    ngayKetThuc: '',
    giaSuDung: '',
    trangThai: 1,
  });

  useEffect(() => {
    getRoomDetail(roomId)
      .then((response) => {
        setRoomDetail(response);
        setIdXepPhong(response.id);
        return getDichVuSuDungByIDXepPhong(response.id);
      })
      .then((dichVuResponse) => {
        const responseArray = Array.isArray(dichVuResponse) ? dichVuResponse : [dichVuResponse];
        setListDVSD(responseArray);
      })
      .catch((error) => {
      });
  }, [roomId, ListDVSD]);

  useEffect(() => {
    if (roomDetail) {
      setNewDichVu((prev) => ({
        ...prev,
        xepPhong: { id: roomDetail.id },
      }));
    }
    if (idXepPhong != null) {
      handleAddDVDK(idXepPhong);
    }
  }, [roomDetail]);

  const handleAddDVDK = (idxp) => {
    AddDVDK(idXepPhong)
      .then(() => {
        return getDichVuSuDungByIDXepPhong(idxp);
      })
      .then((updatedList) => {
        setListDVSD(updatedList);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formattedData = {
      ...newDichVu,
      ngayKetThuc: `${newDichVu.ngayKetThuc}:00`,
    };
    AddDichVuSuDung(formattedData)
      .then(() => {
        console.log("Dữ liệu thêm dịch vụ:", formattedData);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding service:", error);
      });
  };

 
  const handleCloseFormDetail = () => {
    setShowFormDetail(false);
    setSelectedDichVu(null);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Thông tin khách hàng */}
      <Grid item xs={12} sm={3.5}>
        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Thông tin khách hàng
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Họ tên:</strong> {roomDetail?.thongTinDatPhong?.datPhong?.khachHang ? `${roomDetail.thongTinDatPhong.datPhong.khachHang.ho} ${roomDetail.thongTinDatPhong.datPhong.khachHang.ten}` : "Chưa có thông tin"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Số điện thoại:</strong> {roomDetail?.thongTinDatPhong?.datPhong?.khachHang?.sdt || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Ngày nhận phòng:</strong> {roomDetail?.thongTinDatPhong?.ngayNhanPhong || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Ngày trả phòng:</strong> {roomDetail?.thongTinDatPhong?.ngayTraPhong || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Giá đặt:</strong> {roomDetail?.thongTinDatPhong?.giaDat} VND
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Thông tin dịch vụ sử dụng */}
      <Grid item xs={12} sm={8.5}>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Giá sử dụng (VND)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số lượng sử dụng</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tổng chi phí (VND)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(ListDVSD) && ListDVSD.length > 0 ? (
                ListDVSD.map((dv) => (
                  <TableRow key={dv.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{dv.dichVu?.tenDichVu}</TableCell>
                    <TableCell>
                      <img src={dv.dichVu?.hinhAnh}
                        style={{
                          width: '130px',
                          height: '86px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      ></img></TableCell>

                    <TableCell>{dv.giaSuDung}</TableCell>
                    <TableCell>{dv.soLuongSuDung}</TableCell>
                    <TableCell>{dv.giaSuDung* dv.soLuongSuDung}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSelectedDichVu(dv);
                          setShowFormDetail(true);
                        }}
                        sx={{
                          backgroundColor: '#1976d2',
                          '&:hover': { backgroundColor: '#1565c0' },
                          textTransform: 'none',
                        }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontSize: '1.2rem' }}>
                    Không tìm thấy thông tin dịch vụ nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: 'none' }}
          onClick={() => {
            setShowFormDetail(true);
            setSelectedDichVu(null);
          }}
        >
          Thêm dịch vụ
        </Button>
      </Grid>

      {/* Form chi tiết dịch vụ */}
      {showFormDetail && <DVSVDetail show={showFormDetail} handleClose={handleCloseFormDetail} data={selectedDichVu} idxp={roomDetail?.id} />}
    </Grid>
  );
};

export default RoomDetail;