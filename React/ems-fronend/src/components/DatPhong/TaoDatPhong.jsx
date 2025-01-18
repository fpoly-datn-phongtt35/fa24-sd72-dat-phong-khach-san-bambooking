import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Grid, TextField, Button, Card, CardContent, CardActions, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './TaoDatPhong.scss';
import { ThemKhachHangDatPhong, ThemMoiDatPhong } from '../../services/DatPhong';
import { addThongTinDatPhong } from '../../services/TTDP';

const TaoDatPhong = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { startDate, endDate, adults } = location.state || {};
    const [selectedRooms, setSelectedRooms] = useState(location.state?.selectedRooms || []);
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        email: '',
        sdt: '',
    });

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

    const calculateTotalAmount = () => {
        return selectedRooms.reduce((total, room) => {
            return total + calculateTotalPrice(room.donGia, startDate, endDate);
        }, 0);
    };

    const handleRemoveRoom = (roomIndex) => {
        setSelectedRooms((prevRooms) => prevRooms.filter((_, index) => index !== roomIndex));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleConfirmBooking = async () => {
        const khachHangRequest = {
            ho: formData.ho,
            ten: formData.ten,
            email: formData.email,
            sdt: formData.sdt,
            matKhau: '',
            trangThai: false,
        };

        const datPhongRequest = {
            khachHang: null,
            maDatPhong: 'DP' + Date.now(),
            soNguoi: adults,
            soPhong: 1,
            ngayDat: new Date().toISOString(),
            tongTien: calculateTotalAmount(),
            datCoc: 0,
            ghiChu: 'Ghi chú thêm nếu cần',
            trangThai: '',
        };

        try {
            const khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
            if (khachHangResponse) {
                datPhongRequest.khachHang = khachHangResponse.data;
                const datPhongResponse = await ThemMoiDatPhong(datPhongRequest);

                const dp = datPhongResponse.data;
                const thongTinDatPhongRequestList = selectedRooms.map((room) => ({
                    datPhong: dp,
                    idLoaiPhong: room.id,
                    maThongTinDatPhong: '',
                    ngayNhanPhong: startDate,
                    ngayTraPhong: endDate,
                    soNguoi: adults,
                    giaDat: room.donGia,
                    trangThai: 'Chua xep',
                }));

                for (const thongTinDatPhong of thongTinDatPhongRequestList) {
                    await addThongTinDatPhong(thongTinDatPhong);
                }

                alert('Đặt phòng thành công');
                navigate('/quan-ly-dat-phong');
            }
        } catch (error) {
            console.error('Lỗi khi đặt phòng:', error);
            alert('Đã xảy ra lỗi trong quá trình đặt phòng');
        }
    };

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Tạo Đặt Phòng
                </Typography>

                <Grid container spacing={4}>
                    {/* Thông tin người đặt */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Thông Tin Người Đặt
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ"
                                        id="ho"
                                        value={formData.ho}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Tên"
                                        id="ten"
                                        value={formData.ten}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số Điện Thoại"
                                        id="sdt"
                                        value={formData.sdt}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Danh sách phòng đã chọn */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Chi Tiết Phòng Đã Chọn ({selectedRooms.length})
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                Thời gian: từ {startDate} đến {endDate}
                            </Typography>
                            {selectedRooms.length > 0 ? (
                                selectedRooms.map((room, index) => (
                                    <Card key={`${room.id}-${index}`} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography>Loại phòng: {room.tenLoaiPhong}</Typography>
                                            <Typography>Số người: {adults}</Typography>
                                            <Typography>Giá mỗi đêm: {room.donGia.toLocaleString()} VND</Typography>
                                            <Typography>Số đêm: {calculateDays(startDate, endDate)}</Typography>
                                            <Typography>
                                                Thành tiền: {calculateTotalPrice(room.donGia, startDate, endDate).toLocaleString()} VND
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton onClick={() => handleRemoveRoom(index)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))
                            ) : (
                                <Typography>Không có phòng nào được chọn</Typography>
                            )}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Tổng tiền: {calculateTotalAmount().toLocaleString()} VND
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleConfirmBooking}
                            >
                                Xác nhận đặt phòng
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TaoDatPhong;
