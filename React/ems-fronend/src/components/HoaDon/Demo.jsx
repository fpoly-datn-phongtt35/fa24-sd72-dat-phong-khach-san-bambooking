import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCheckOut, checkOut } from '../../services/HoaDonDat';
import { Box, Button, Container, Input, Stack, Table, Typography } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import { ThemPhuThu } from '../../services/PhuThuService';

const Demo = () => {
    const [key, setKey] = useState('');
    const [traPhong, setTraPhong] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const FindCheckOut = (key) => {
        findCheckOut(key)
            .then((response) => {
                console.log(response.data)
                setTraPhong(response.data);
                setErrorMessage('');
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Không tìm thấy thông tin trả phòng.');
            });
    };

    const CheckOut = async () => {
        try {
            await Promise.all(
                traPhong.map(async (item) => {
                    await checkOut(item.id);

                    if (!item.xepPhong) return;

                    const ngayTraPhong = new Date(item.xepPhong.ngayTraPhong);
                    const ngayTraThucTe = new Date(item.ngayTraThucTe);

                    if (isNaN(ngayTraPhong) || isNaN(ngayTraThucTe)) {
                        throw new Error(`Ngày không hợp lệ cho phòng ID: ${item.id}`);
                    }

                    const gio12Trua = new Date(ngayTraPhong);
                    gio12Trua.setHours(12, 0, 0, 0);

                    if (ngayTraThucTe > gio12Trua) {
                        const phuThuRequest = {
                            xepPhong: { id: item.xepPhong.id },
                            tenPhuThu: 'Phụ thu do trả phòng muộn',
                            tienPhuThu: 70000,
                            soLuong: 1,
                            trangThai: true,
                        };
                        await ThemPhuThu(phuThuRequest);
                        alert(`Phụ thu đã được thêm cho phòng ${item.xepPhong.id}`);
                    }
                })
            );

            localStorage.setItem('traPhong', JSON.stringify(traPhong));
            navigate('/tao-hoa-don');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi thực hiện thao tác.';
            setErrorMessage(message);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const formatDateTime = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleString('vi-VN', options);
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
                        <Button variant="solid" color="primary" onClick={() => FindCheckOut(key)}>
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
                        <Box sx={{ overflowX: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Typography level="h4">Chi tiết trả phòng</Typography>
                                <Button variant="solid" color="success" onClick={CheckOut}>
                                    Trả phòng
                                </Button>
                            </Box>

                            <Table borderAxis="x" size="md" stickyHeader variant="outlined">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên phòng</th>
                                        <th>Ngày nhận</th>
                                        <th>Ngày trả thực tế</th>
                                        <th>Trạng thái KTP</th>
                                        <th>Thời gian KTP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {traPhong.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.tenPhong || 'Không có dữ liệu'}</td>
                                            {/* <td>{item.xepPhong?.phong?.tenPhong || 'Không có dữ liệu'}</td> */}
                                            <td>{formatDate(item.ngayNhan)}</td>
                                            {/* <td>{formatDate(item.xepPhong?.ngayNhanPhong)}</td> */}
                                            <td>{formatDateTime(item.ngayTraThucTe)}</td>
                                            <td>{item.trangThaiKTP}</td>
                                            <td>{item.thoiGianKTP ? formatDateTime(item.thoiGianKTP) : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Demo;