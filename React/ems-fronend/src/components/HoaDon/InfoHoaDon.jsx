import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDichVuSuDung, getHoaDonById, getThongTinHoaDonByHoaDonId } from "../../services/InfoHoaDon";
import { Container, Box, Sheet, Table, Button, Typography } from "@mui/joy";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InfoHoaDon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState(null);
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [dichVuSuDung, setDichVuSuDung] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hoaDonResponse, thongTinHoaDonResponse, dichVuSuDungResponse] = await Promise.all([
                    getHoaDonById(id),
                    getThongTinHoaDonByHoaDonId(id),
                    getDichVuSuDung(id),
                ]);

                setHoaDon(hoaDonResponse?.data || null);
                setThongTinHoaDon(thongTinHoaDonResponse?.data || []);
                setDichVuSuDung(dichVuSuDungResponse?.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    if (!hoaDon) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" color="error">
                    Không tìm thấy thông tin hóa đơn.
                </Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
                <Button variant="outlined" color="neutral" startDecorator={<ArrowBackIcon />} onClick={() => navigate('/hoa-don')}>
                    Back
                </Button>
                <Typography level="h4" sx={{ fontWeight: 'bold', marginBottom: 2, flex: 1, textAlign: 'center' }}>
                    Thông tin hóa đơn
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
                <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: 3 }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Mã hóa đơn</Typography>
                    <Typography>{hoaDon.maHoaDon}</Typography>
                </Box>

                <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: 3 }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Ngày tạo</Typography>
                    <Typography>{hoaDon.ngayTao}</Typography>
                </Box>

                <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: 3 }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Tên nhân viên</Typography>
                    <Typography>{hoaDon.tenNhanVien}</Typography>
                </Box>

                <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: 3 }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Tổng tiền</Typography>
                    <Typography>{formatCurrency(hoaDon.tongTien)}</Typography>
                </Box>

                <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: 3 }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Trạng thái</Typography>
                    <Typography>{hoaDon.trangThai}</Typography>
                </Box>
            </Box>

            {/* Thông tin tiền phòng */}
            <Box sx={{ marginTop: 3 }}>
                <Typography level="h4" sx={{ marginBottom: 1 }}>Tiền phòng</Typography>
                {thongTinHoaDon.length > 0 && (
                    <Sheet sx={{ padding: '2px', borderRadius: '5px' }}>
                        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                            <thead>
                                <tr>
                                    <th>Tên phòng</th>
                                    <th>Ngày nhận phòng</th>
                                    <th>Ngày trả phòng</th>
                                    <th>Giá phòng</th>
                                    <th>Tiền phòng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {thongTinHoaDon.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.tenPhong}</td>
                                        <td>{item.ngayNhanPhong}</td>
                                        <td>{item.ngayTraPhong}</td>
                                        <td>{formatCurrency(item.giaPhong)}</td>
                                        <td>{formatCurrency(item.tienPhong)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                )}
            </Box>

            {/* Thông tin dịch vụ sử dụng */}
            <Box sx={{ marginTop: 3 }}>
                <Typography level="h4" sx={{ marginBottom: 1 }}>Tiền dịch vụ</Typography>
                {dichVuSuDung.length > 0 && (
                    <Sheet sx={{ padding: '2px', borderRadius: '5px' }}>
                        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                            <thead>
                                <tr>
                                    <th>Tên phòng</th>
                                    <th>Tên dịch vụ</th>
                                    <th>Giá dịch vụ</th>
                                    <th>Số lượng sử dụng</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dichVuSuDung.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.tenPhong}</td>
                                        <td>{item.tenDichVu}</td>
                                        <td>{formatCurrency(item.giaDichVu)}</td>
                                        <td>{item.soLuongSuDung}</td>
                                        <td>{formatCurrency(item.tongTien)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                )}
            </Box>
        </Container>
    );
};

export default InfoHoaDon;
