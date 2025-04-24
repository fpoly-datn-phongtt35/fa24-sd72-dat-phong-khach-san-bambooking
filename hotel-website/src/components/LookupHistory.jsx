import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getLSDPbyEmail } from '../services/DatPhong.js';
import { Table, TableBody,Box, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, CircularProgress, Container } from '@mui/material';

export default function LookupHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { email } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, [email]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getLSDPbyEmail(email);
            setBookings(response.data.content || response.data);
            console.log(response)
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (idDatPhong) => {
        navigate(`/lookup/ttdp/${idDatPhong}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                Danh sách đặt phòng
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                    <Typography variant="body1" ml={2}>Đang tải...</Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="bảng đặt phòng">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Mã đặt phòng</strong></TableCell>
                                <TableCell align="center"><strong>Số phòng</strong></TableCell>
                                <TableCell align="center"><strong>Số người</strong></TableCell>
                                <TableCell align="center"><strong>Tổng tiền</strong></TableCell>
                                <TableCell align="center"><strong>Ngày đặt</strong></TableCell>
                                <TableCell align="center"><strong>Ghi chú</strong></TableCell>
                                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                                <TableCell align="center"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id} hover>
                                    <TableCell align="center">{booking.maDatPhong}</TableCell>
                                    <TableCell align="center">{booking.soPhong}</TableCell>
                                    <TableCell align="center">{booking.soNguoi}</TableCell>
                                    <TableCell align="center">{booking.tongTien.toLocaleString()} VNĐ</TableCell>
                                    <TableCell align="center">{new Date(booking.ngayDat).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{booking.ghiChu}</TableCell>
                                    <TableCell align="center">{booking.trangThai}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleViewDetail(booking.id)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}