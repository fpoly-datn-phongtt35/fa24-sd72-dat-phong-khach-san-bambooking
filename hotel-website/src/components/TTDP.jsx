import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTTDPByidDatPhong } from "../services/TTDP.js";

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
} from "@mui/material";

export default function TTDP() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { idDatPhong } = useParams();
  const navigate = useNavigate();

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
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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
                  <TableCell  align="center" sx={{ fontWeight: 'bold' }}>Loại phòng</TableCell>
                  <TableCell  align="center" sx={{ fontWeight: 'bold' }}>Giá Đặt</TableCell>
                  <TableCell  align="center" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                  <TableCell  align="center" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.loaiPhong.id}>
                    <TableCell align="center" >{booking.loaiPhong.tenLoaiPhong}</TableCell>
                    <TableCell align="center" >{formatCurrency(booking.giaDat)}</TableCell>
                    <TableCell align="center" >{booking.soluong}</TableCell>
                    <TableCell align="center" >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: '#1976d2' }}
                        onClick={() => handleViewDetail(booking.loaiPhong.id)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}