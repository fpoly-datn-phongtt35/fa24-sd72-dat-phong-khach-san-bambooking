import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCheckOut, checkOut } from '../../services/HoaDonDat';
import { Box, Button, Card, Container, IconButton, Input, Stack, Typography } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { ThemPhuThu } from '../../services/PhuThuService';

const Demo = ({ thongTinDatPhong }) => {
    const [key, setKey] = useState('');
    const [traPhong, setTraPhong] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // Thêm state để lưu thông báo lỗi
    const navigate = useNavigate();

    const FindCheckOut = (key) => {
        findCheckOut(key)
            .then((response) => {
                console.log(response.data);
                setTraPhong(response.data);
                setErrorMessage(''); // Xóa thông báo lỗi khi tìm kiếm thành công
            })
            .catch((error) => {
                console.log('Lỗi khi tìm kiếm thông tin phòng', error);
            });
    };

    const CheckOut = async () => {
        try {
            for (const item of traPhong) {
                await checkOut(item.id);
                console.log(`✅ Checkout thành công cho phòng ID: ${item.id}`);

                if (!item.xepPhong) {
                    console.warn(`⚠️ Không tìm thấy thông tin xếp phòng cho phòng ID: ${item.id}`);
                    continue;
                }

                const ngayTraPhong = new Date(item.xepPhong.ngayTraPhong);
                const ngayTraThucTe = new Date(item.ngayTraThucTe);

                if (isNaN(ngayTraPhong) || isNaN(ngayTraThucTe)) {
                    console.warn(`⚠️ Ngày không hợp lệ cho phòng ID: ${item.id}`);
                    continue;
                }

                const gio12Trua = new Date(ngayTraPhong);
                gio12Trua.setHours(12, 0, 0, 0);

                console.log("⏳ Kiểm tra phụ thu...");
                console.log("Ngày trả phòng dự kiến:", ngayTraPhong);
                console.log("Ngày trả thực tế:", ngayTraThucTe);
                console.log("Mốc 12h trưa:", gio12Trua);

                if (ngayTraThucTe > gio12Trua) {
                    const phuThuRequest = {
                        xepPhong: { id: item.xepPhong.id },
                        tenPhuThu: 'Phụ thu do trả phòng muộn',
                        tienPhuThu: 70000,
                        soLuong: 1,
                        trangThai: true,
                    };

                    console.log('➕ Đang thêm phụ thu:', phuThuRequest);
                    await ThemPhuThu(phuThuRequest);
                    console.log(`💰 Phụ thu đã được thêm cho phòng ${item.xepPhong.id}`);
                    alert(`Phụ thu do trả phòng muộn đã được thêm cho phòng ${item.xepPhong.id}`);
                } else {
                    console.log(`✅ Không cần phụ thu: Phòng ${item.xepPhong.id} trả trước 12h trưa.`);
                }
            }

            localStorage.setItem('traPhong', JSON.stringify(traPhong));
            navigate('/tao-hoa-don');
        } catch (error) {
            console.error('❌ Lỗi khi thực hiện checkout:', error);
            // Lấy thông báo lỗi từ response của BE
            const message = error.response?.data?.message || 'Đã xảy ra lỗi khi thực hiện thao tác.';
            setErrorMessage(message); // Cập nhật state để hiển thị lỗi
        }
    };

    const removeTraPhong = (id) => {
        setTraPhong(traPhong.filter((item) => item.id !== id));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', options);
    };

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', options);
    };

    return (
        <Container>
            <Box sx={{ padding: 3 }}>
                {/* Tìm kiếm */}
                <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                    <Typography level="h4" sx={{ marginBottom: 2 }}>
                        Tìm kiếm thông tin trả phòng
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Input
                            fullWidth
                            placeholder="Nhập mã hoặc từ khóa..."
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            startDecorator={<SearchIcon />}
                            sx={{ maxWidth: 400 }}
                        />
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={() => FindCheckOut(key)}
                        >
                            Tìm kiếm
                        </Button>
                    </Stack>
                </Box>

                {/* Hiển thị thông báo lỗi nếu có */}
                {errorMessage && (
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <Typography level="body1" color="danger">
                            {errorMessage}
                        </Typography>
                    </Box>
                )}

                {/* Hiển thị danh sách trả phòng */}
                <Box sx={{ marginTop: 4 }}>
                    {traPhong.length === 0 ? (
                        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                            <Typography level="body1" sx={{ marginBottom: 2 }}>
                                Không có thông tin trả phòng được tìm thấy.
                            </Typography>
                            <Typography level="body2" color="neutral">
                                Hãy thử tìm kiếm lại bằng mã hoặc từ khóa khác.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2,
                                }}
                            >
                                <Typography level="h4">Chi tiết trả phòng</Typography>
                                <Button
                                    variant="solid"
                                    color="success"
                                    onClick={CheckOut}
                                >
                                    Trả phòng
                                </Button>
                            </Box>

                            {traPhong.map((item, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        position: 'relative',
                                        padding: 3,
                                        gap: 2,
                                        maxWidth: 300,
                                        margin: '0 auto',
                                        textAlign: 'center',
                                        boxShadow: 'sm',
                                    }}
                                >
                                    <IconButton
                                        color="danger"
                                        onClick={() => removeTraPhong(item.id)}
                                        size="sm"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>

                                    <Box>
                                        <Typography level="h6" sx={{ fontSize: '1rem' }}>
                                            Tên phòng: {item.xepPhong.phong.tenPhong}
                                        </Typography>
                                        <Typography level="body2" sx={{ fontSize: '0.85rem' }}>
                                            <strong>Ngày nhận phòng:</strong> {formatDate(item.xepPhong.ngayNhanPhong)} <br />
                                            <strong>Ngày trả phòng:</strong> {formatDateTime(item.ngayTraThucTe)}
                                        </Typography>
                                    </Box>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Demo;