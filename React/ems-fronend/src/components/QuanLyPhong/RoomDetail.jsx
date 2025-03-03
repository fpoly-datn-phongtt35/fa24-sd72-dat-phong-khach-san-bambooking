import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomDetail, getDichVuSuDungByIDXepPhong, AddDichVuSuDung , AddDVDK} from '../../services/ViewPhong';
import { DuLieu } from '../../services/DichVuService';
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

const RoomDetail = () => {
  const { roomId } = useParams();
  const [ idXepPhong, setIdXepPhong ] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [ListDVSD, setListDVSD] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [selectedDichVu, setSelectedDichVu] = useState(null); // Lưu dịch vụ được chọn
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
        console.log("Error fetching data:", error);
      });
      
  }, [roomId,ListDVSD]);

  useEffect(() => {
    // Cập nhật id của xepPhong trong newDichVu khi roomDetail được load
    if (roomDetail) {
      setNewDichVu((prev) => ({
        ...prev,
        xepPhong: { id: roomDetail.id },
      }));
    }
    if(idXepPhong != null){
      handleAddDVDK(idXepPhong)
    }
      
    
  }, [roomDetail]);

  const handleAddDVDK = (idxp) => {
    AddDVDK(idXepPhong)
      .then(() => {
        return getDichVuSuDungByIDXepPhong(idxp); // Lấy danh sách mới
      })
      .then((updatedList) => {
        setListDVSD(updatedList); // Cập nhật danh sách
      })
      .catch((error) => {
        console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
      });
  };
  

  const handleAddDV = () => {
    setShowForm(true); // Hiển thị form khi nhấn nút
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Định dạng ngày giờ sang chuẩn LocalDateTime trước khi gửi lên backend
    const formattedData = {
      ...newDichVu,
      ngayKetThuc: `${newDichVu.ngayKetThuc}:00`, // Đảm bảo đúng định dạng ISO 8601
    };
    console.log(formattedData)
    AddDichVuSuDung(formattedData)
      .then(() => {
        console.log("Dữ liệu thêm dịch vụ:", formattedData);
        setShowForm(false); // Đóng form sau khi thêm
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
      <Grid item xs={12} sm={4}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent >
            <Typography variant="h5" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography sx={{ fontSize: '1.3rem' }}><strong>Họ tên:</strong> {roomDetail?.thongTinDatPhong?.datPhong?.khachHang ? `${roomDetail.thongTinDatPhong.datPhong.khachHang.ho} ${roomDetail.thongTinDatPhong.datPhong.khachHang.ten}` : "Chưa có thông tin"}</Typography>
            <Typography sx={{ fontSize: '1.3rem' }}><strong>Số điện thoại:</strong> {roomDetail?.thongTinDatPhong?.datPhong?.khachHang?.sdt || "N/A"}</Typography>
            <Typography sx={{ fontSize: '1.3rem' }}><strong>Ngày nhận phòng:</strong> {roomDetail?.thongTinDatPhong?.ngayNhanPhong || "N/A"}</Typography>
            <Typography sx={{ fontSize: '1.3rem' }}><strong>Ngày trả phòng:</strong> {roomDetail?.thongTinDatPhong?.ngayTraPhong || "N/A"}</Typography>
            <Typography sx={{ fontSize: '1.3rem' }}><strong>Giá đặt:</strong> {roomDetail?.thongTinDatPhong?.giaDat} VND</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Thông tin dịch vụ sử dụng */}
      <Grid item xs={12} sm={8}>
        <TableContainer component={Paper}>
          <Table sx={{ fontSize: '1.6rem' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1.6rem' }}>Tên dịch vụ</TableCell>
                <TableCell sx={{ fontSize: '1.6rem' }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontSize: '1.6rem' }}>Giá sử dụng (VND)</TableCell>
                <TableCell sx={{ fontSize: '1.6rem' }}>Số lượng sử dụng</TableCell>
                <TableCell sx={{ fontSize: '1.6rem' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(ListDVSD) && ListDVSD.length > 0 ? (
                ListDVSD.map((dv) => (
                  <TableRow key={dv.id}>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{dv.dichVu?.tenDichVu}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{dv.dichVu?.hinhAnh}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{dv.giaSuDung}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{dv.soLuongSuDung}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSelectedDichVu(dv);
                          setShowFormDetail(true);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ fontSize: '1.2rem' }}>
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
          sx={{ mt: 2 }}
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
