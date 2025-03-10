import React, { useState } from 'react';
import { findXepPhong } from '../../services/KiemTraPhongService';
import { Box, Button, Container, IconButton, Input, Sheet, Stack, Table, Tooltip, Typography } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const KiemTraPhong = () => {
    const [key, setKey] = useState("");
    const [kiemTraPhong, setKiemTraPhong] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const searchRoom = (key) => {
        findXepPhong(key)
            .then((response) => {
                console.log("Data perform room check: ", response.data.data);
                setKiemTraPhong(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tìm kiếm thông tin!", error);
            });
    };

    const handleCheckRoom = (idXepPhong) => {
        navigate(`/tao-kiem-tra-phong/${idXepPhong}`);
    };

    return (
        <Container>
            {/* Tiêu đề + Ô tìm kiếm */}
            <Box
                sx={{
                    maxWidth: isMobile ? "100%" : 650,
                    margin: '0 auto',
                    textAlign: 'center',
                    mb: 3,
                    mt: isMobile ? 4 : 7,
                    px: isMobile ? 2 : 0
                }}
            >
                <Typography level="h4" sx={{ mb: 2, fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
                    Tìm kiếm thông tin kiểm tra phòng
                </Typography>
                <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center" justifyContent="center">
                    <Input
                        fullWidth
                        placeholder="Nhập mã hoặc từ khóa..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        startDecorator={<SearchIcon />}
                        sx={{ maxWidth: isMobile ? "100%" : 400 }}
                    />
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={() => searchRoom(key)}
                        sx={{ width: isMobile ? "100%" : "auto" }}
                    >
                        Tìm kiếm
                    </Button>
                </Stack>
            </Box>

            {/* Bảng kết quả tìm kiếm */}
            <Box>
                {kiemTraPhong.length > 0 ? (
                    <Sheet sx={{
                        marginTop: 2,
                        padding: "8px",
                        borderRadius: "5px",
                        overflowX: "auto", // Cho phép cuộn ngang trên màn hình nhỏ
                    }}>
                        <Table
                            borderAxis="x"
                            size="lg"
                            stickyHeader
                            variant="outlined"
                            sx={{
                                minWidth: isMobile ? "700px" : "100%", // Giữ bảng có thể cuộn trên màn hình nhỏ
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>Tên khách hàng</th>
                                    <th>Ngày nhận</th>
                                    <th>Ngày trả</th>
                                    <th>Loại phòng</th>
                                    <th>Phòng</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kiemTraPhong.map((value) => (
                                    <tr key={value.idXepPhong}>
                                        <td>{value.hoTenKhachHang}</td>
                                        <td>{value.ngayNhanPhong}</td>
                                        <td>{value.ngayTraPhong}</td>
                                        <td>{value.tenLoaiPhong}</td>
                                        <td>{value.tenPhong}</td>
                                        <td>
                                            <Tooltip title="Kiểm tra phòng" variant='plain'>
                                                <IconButton onClick={() => handleCheckRoom(value.idXepPhong)}>
                                                    <FactCheckIcon sx={{ color: '#ff9900', fontSize: 30 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <Typography level="body1" sx={{ marginBottom: 2 }}>
                            Không tìm thấy thông tin.
                        </Typography>
                        <Typography level="body2" color="neutral">
                            Hãy thử tìm kiếm lại bằng mã hoặc từ khóa khác.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default KiemTraPhong;
