import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTTDPByidDatPhong } from "../services/TTDP.js";
import {
  getDichVuSuDung,
  getHoaDonById,
  getThongTinHoaDonByHoaDonId,
  getPhuThuByHoaDonId,
  getHDByidDatPhong,
  getListVatTuHongThieu,
  findDatCocByidHoaDon
} from "../services/InfoHoaDon";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Tooltip,
  Container,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  Sheet,
} from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function TTDP() {
  const [bookings, setBookings] = useState([]);
  const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
  const [dichVuSuDung, setDichVuSuDung] = useState([]);
  const [phuThu, setPhuThu] = useState([]);
  const [loading, setLoading] = useState(false);
  const { idDatPhong } = useParams();
  const navigate = useNavigate();
  const [datCoc, setDatCoc] = useState([]);

  useEffect(() => {
    fetchData();
  }, [idDatPhong]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const bookingResponse = await getTTDPByidDatPhong(idDatPhong);
      const bookingData = Array.isArray(bookingResponse.data)
        ? bookingResponse.data
        : [bookingResponse.data];
      setBookings(groupBookingsByLoaiPhong(bookingData));
  
      // Lấy danh sách hóa đơn
      const hoaDonResponse = await getHDByidDatPhong(idDatPhong);
      const hoaDonList = Array.isArray(hoaDonResponse.data)
        ? hoaDonResponse.data
        : [hoaDonResponse.data].filter(Boolean);
  
      if (!hoaDonList || hoaDonList.length === 0) {
        console.error("Không tìm thấy hóa đơn!");
        setLoading(false);
        return;
      }
  
      // Tạo mảng để lưu trữ dữ liệu từ tất cả hóa đơn
      let allThongTinHoaDon = [];
      let allDichVuSuDung = [];
      let allPhuThu = [];
      let allDatCoc = [];
      let allVatTu = [];
  
      // Lặp qua từng hóa đơn để lấy dữ liệu
      for (const hoaDon of hoaDonList) {
        const hoaDonId = hoaDon.id;
        if (!hoaDonId) continue; // Bỏ qua nếu không có hoaDonId
  
        const [
          datCocResponse,
          thongTinHoaDonResponse,
          dichVuSuDungResponse,
          phuThuResponse,
          vatTuResponse,
        ] = await Promise.all([
          findDatCocByidHoaDon(hoaDonId),
          getThongTinHoaDonByHoaDonId(hoaDonId),
          getDichVuSuDung(hoaDonId),
          getPhuThuByHoaDonId(hoaDonId),
          getListVatTuHongThieu(hoaDonId),
        ]);
  
        // Gộp dữ liệu từ các API
        allDatCoc = [...allDatCoc, ...(datCocResponse?.data ? [datCocResponse.data] : [])];
        allThongTinHoaDon = [...allThongTinHoaDon, ...(thongTinHoaDonResponse?.data || [])];
        allDichVuSuDung = [...allDichVuSuDung, ...(dichVuSuDungResponse?.data || [])];
        allPhuThu = [...allPhuThu, ...(phuThuResponse?.data || [])];
        allVatTu = [...allVatTu, ...(vatTuResponse?.data || [])];
      }
  
      // Cập nhật state với dữ liệu gộp
      setDatCoc(allDatCoc);
      setThongTinHoaDon(allThongTinHoaDon);
      setDichVuSuDung(allDichVuSuDung);
      setPhuThu(allPhuThu);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Tính toán tổng tiền
  const tongTienPhong = thongTinHoaDon.reduce((sum, item) => sum + (item.tienPhong || 0), 0);
  const tongTienDichVu = dichVuSuDung.reduce(
    (sum, dv) => sum + (dv.giaDichVu * dv.soLuongSuDung || 0),
    0
  );
  const tongTienPhuThu = phuThu.reduce((sum, pt) => sum + (pt.tienPhuThu || 0), 0);
  const tongTienKhauTru = thongTinHoaDon.reduce((sum, item) => sum + (item.tienKhauTru || 0), 0);
  const tienDatCoc = datCoc.reduce((sum, dc) => sum + (dc.tienThanhToan || 0), 0); // Tính tổng tiền đặt cọc
  const tongTienHoaDon = tongTienPhong + tongTienDichVu + tongTienPhuThu - tongTienKhauTru;
  const tongCong = tongTienHoaDon + tienDatCoc;
  
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleViewDetail = (idLoaiPhong) => {
    navigate(`/detail-ttdp/${idDatPhong}/${idLoaiPhong}`);
  };

  const groupBookingsByLoaiPhong = (bookings) => {
    const grouped = bookings.reduce((acc, booking) => {
      const idLoaiPhong = booking.loaiPhong.id;
      if (!acc[idLoaiPhong]) {
        acc[idLoaiPhong] = {
          ...booking,
          soluong: Number(booking.soluong) || 1,
        };
      } else {
        acc[idLoaiPhong].soluong += Number(booking.soluong) || 1;
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  return (
    <Container
      sx={{
        minHeight: "66vh",
      }}
    >
      <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thông Tin Đặt Phòng</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1976d2' }}
            onClick={() => navigate(-1)}
          >
            ← Quay Lại
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Loại phòng</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Giá Đặt</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.loaiPhong.id}>
                      <TableCell align="center" >{booking.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell align="center" >{formatCurrency(booking.giaDat)}</TableCell>
                      <TableCell align="center" >{booking.soluong}</TableCell>
                      <TableCell align="center" >
                        <Tooltip title="Xem chi tiết thông tin đặt phòng">
                          <InfoIcon
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetail(booking.loaiPhong.id)}
                          >
                          </InfoIcon></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>


        )}
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Sheet
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography level="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Tóm tắt hóa đơn 
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography level="body1">Tổng tiền phòng:</Typography>
            <Typography level="body1">{formatCurrency(tongTienPhong)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography level="body1">Tổng tiền dịch vụ:</Typography>
            <Typography level="body1">{formatCurrency(tongTienDichVu)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography level="body1">Tổng tiền phụ thu:</Typography>
            <Typography level="body1">{formatCurrency(tongTienPhuThu)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography level="body1">Tiền khấu trừ:</Typography>
            <Typography level="body1">{formatCurrency(tongTienKhauTru)}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #e0e0e0",
              pt: 1,
            }}
          >
            <Typography level="h6" sx={{ fontWeight: "bold" }}>
              Tổng tiền hóa đơn:
            </Typography>
            <Typography level="h6" sx={{ fontWeight: "bold" }}>
              {formatCurrency(tongTienHoaDon)}
            </Typography>
          </Box>
          
          {datCoc && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography level="body1">Tiền đặt cọc:</Typography>
              <Typography level="body1">{formatCurrency(tienDatCoc)}</Typography>
            </Box>
          )}
  
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #e0e0e0",
              pt: 1,
            }}
          >
            <Typography level="h6" sx={{ fontWeight: "bold" }}>
              Tổng tiền thanh toán:
            </Typography>
            <Typography level="h6" sx={{ fontWeight: "bold" }}>
              {formatCurrency(tongCong)}
            </Typography>
          </Box>
        </Sheet>
      </Box>


    </Container>
  );
}