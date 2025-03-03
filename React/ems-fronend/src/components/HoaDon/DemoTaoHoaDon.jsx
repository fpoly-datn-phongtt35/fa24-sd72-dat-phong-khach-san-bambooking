import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { taoHoaDon } from '../../services/HoaDonService';
import { createThongTinHoaDon } from '../../services/HoaDonDat';
import { Box, Container, Table, Typography, Button, Sheet } from '@mui/joy';

const DemoTaoHoaDon = () => {
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [idHoaDon, setIdHoaDon] = useState(null);
    const hoaDonDaTaoRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hoaDonDaTaoRef.current) {
            createHoaDon();
            hoaDonDaTaoRef.current = true;
        }
    }, []);

    const createHoaDon = async () => {
        try {
            // Lấy idTraPhong từ localStorage (giả sử đã lưu là mảng các id)
            const storedIdTraPhong = JSON.parse(localStorage.getItem('traPhong'));
            console.log("Stored idTraPhong from localStorage:", storedIdTraPhong);
            
            // Nếu storedIdTraPhong là mảng và có phần tử, lấy phần tử đầu tiên
            const idTraPhong = (storedIdTraPhong && storedIdTraPhong.length > 0)
                ? Number(storedIdTraPhong[0].id)
                : null;
            console.log("Using idTraPhong:", idTraPhong);
            
            // if (!idTraPhong) {
            //     console.error("Không có idTraPhong trong localStorage");
            //     return;
            // }
            
            // Gọi hàm taoHoaDon với idTraPhong (backend sẽ xử lý chuyển đổi qua idDatPhong)
            const hdResponse = await taoHoaDon(idTraPhong);
            console.log("Hoa don: ", hdResponse)
            setIdHoaDon(hdResponse.id);
        
            const traPhongData = JSON.parse(localStorage.getItem('traPhong')) || [];
            const tthdRequest = {
                idHoaDon: hdResponse.id,
                listTraPhong: traPhongData,
            };
        
            const response = await createThongTinHoaDon(tthdRequest);
            setThongTinHoaDon(response.data || []);
        } catch (error) {
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const totalAmount = useMemo(() => {
        return thongTinHoaDon.reduce(
            (total, item) => total + item.tienPhong + item.tienPhuThu + item.tienDichVu,
            0
        );
    }, [thongTinHoaDon]);

    return (
        <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                <Typography level="h4">Thông tin chi tiết hóa đơn</Typography>
            </Box>

            <Sheet
                sx={{
                    marginTop: 2,
                    padding: "2px",
                    borderRadius: "5px",
                }}
            >
                <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Trả phòng</th>
                            <th>Mã Hóa Đơn</th>
                            <th>Phòng</th>
                            <th>Tiền Phòng</th>
                            <th>Tiền Phụ Thu</th>
                            <th>Tiền Dịch Vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thongTinHoaDon.length > 0 ? (
                            thongTinHoaDon.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.traPhong?.id}</td>
                                    <td>{item.hoaDon?.maHoaDon}</td>
                                    <td>{item.traPhong?.xepPhong?.phong?.tenPhong}</td>
                                    <td>{formatCurrency(item.tienPhong)}</td>
                                    <td>{formatCurrency(item.tienPhuThu)}</td>
                                    <td>{formatCurrency(item.tienDichVu)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} align="center">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Sheet>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography level="h6">
                    <b>Tổng tiền:</b> {isNaN(totalAmount) ? formatCurrency(0) : formatCurrency(totalAmount)}
                </Typography>
                <Button color="primary" variant='soft' onClick={() => navigate(`/thanh-toan/${idHoaDon}`)}>
                    Thanh toán
                </Button>
            </Box>
        </Container>
    );
};

export default DemoTaoHoaDon;
