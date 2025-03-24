import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { taoHoaDon, updateTienKhauTru } from "../../services/HoaDonService";
import { createThongTinHoaDon } from "../../services/HoaDonDat";
import { Box, Container, Table, Typography, Button, Sheet, Input } from "@mui/joy";

const DemoTaoHoaDon = () => {
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [idHoaDon, setIdHoaDon] = useState(null);
    const [tienKhauTru, setTienKhauTru] = useState({});
    const hoaDonDaTaoRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hoaDonDaTaoRef.current) {
            createHoaDon();
            hoaDonDaTaoRef.current = true;
        }
    }, []);

    // const createHoaDon = async () => {
    //     try {
    //         const storedIdTraPhong = JSON.parse(localStorage.getItem("traPhong"));
    //         const idTraPhong = storedIdTraPhong?.length ? Number(storedIdTraPhong[0].id) : null;
    //         if (!idTraPhong) return;

    //         const hdResponse = await taoHoaDon(idTraPhong);
    //         setIdHoaDon(hdResponse.id);

    //         const response = await createThongTinHoaDon({
    //             idHoaDon: hdResponse.id,
    //             listTraPhong: storedIdTraPhong,
    //         });
    //         setThongTinHoaDon(response.data || []);
    //     } catch (error) {
    //         console.error("Lỗi tạo hóa đơn:", error);
    //     }
    // };

    const createHoaDon = async () => {
        try {
            const storedIdTraPhong = JSON.parse(localStorage.getItem("traPhong"));
            console.log("storedIdTraPhong:", JSON.stringify(storedIdTraPhong, null, 2));
    
            const idTraPhong = storedIdTraPhong?.length ? Number(storedIdTraPhong[0].id) : null;
            if (!idTraPhong) {
                console.error("Không tìm thấy idTraPhong trong localStorage.");
                return;
            }
    
            // Chuyển TraPhongResponse thành TraPhong entity
            const listTraPhong = storedIdTraPhong.map(item => ({
                id: item.id,
                ngayTraThucTe: item.ngayTraThucTe,
                trangThai: item.trangThai,
                xepPhong: item.idXepPhong ? { id: item.idXepPhong } : null
            }));
            console.log(listTraPhong);
            const hdResponse = await taoHoaDon(idTraPhong);
            setIdHoaDon(hdResponse.id);
    
            const response = await createThongTinHoaDon({
                idHoaDon: hdResponse.id,
                listTraPhong: listTraPhong,
            });
            setThongTinHoaDon(response.data || []);
        } catch (error) {
            console.error("Lỗi tạo hóa đơn:", error);
            alert("Không thể tạo hóa đơn: " + (error.response?.data?.message || "Lỗi không xác định"));
        }
    };

    const handleTienKhauTruChange = (id, value) => {
        setTienKhauTru((prev) => ({ ...prev, [id]: Number(value) || 0 }));
    };

    const handleUpdateTienKhauTru = async (idThongTinHoaDon) => {
        if (!idHoaDon || !idThongTinHoaDon || tienKhauTru[idThongTinHoaDon] === undefined) {
            console.error("Dữ liệu không hợp lệ để cập nhật tiền khấu trừ.");
            return;
        }

        try {
            await updateTienKhauTru(idHoaDon, idThongTinHoaDon, tienKhauTru[idThongTinHoaDon]);
        } catch (error) {
            console.error("Lỗi khi cập nhật tiền khấu trừ:", error);
        }
    };

    const handleThanhToan = async () => {
        try {
            await Promise.all(
                thongTinHoaDon.map((item) =>
                    updateTienKhauTru(idHoaDon, item.id, tienKhauTru[item.id] || 0)
                )
            );

            // Nếu tất cả cập nhật thành công, chuyển hướng sang trang thanh toán
            navigate(`/thanh-toan/${idHoaDon}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật tiền khấu trừ trước khi thanh toán:", error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const totalAmount = useMemo(() => {
        return thongTinHoaDon.reduce((total, item) => {
            const khauTru = tienKhauTru[item.id] || 0;
            return total + item.tienPhong + item.tienPhuThu + item.tienDichVu - khauTru;
        }, 0);
    }, [thongTinHoaDon, tienKhauTru]);

    return (
        <Container>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                <Typography level="h4">Thông tin chi tiết hóa đơn</Typography>
            </Box>

            <Sheet sx={{ marginTop: 2, padding: "2px", borderRadius: "5px" }}>
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
                            <th>Tiền Khấu Trừ</th>
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
                                    <td>
                                        <Input
                                            type="number"
                                            value={tienKhauTru[item.id] || ""}
                                            onChange={(e) => handleTienKhauTruChange(item.id, e.target.value)}
                                            onBlur={() => handleUpdateTienKhauTru(item.id)}
                                            sx={{ width: "120px" }}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} align="center">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Sheet>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                <Typography level="h6">
                    <b>Tổng tiền:</b> {isNaN(totalAmount) ? formatCurrency(0) : formatCurrency(totalAmount)}
                </Typography>
                <Button color="primary" variant="soft" onClick={handleThanhToan}>
                    Thanh toán
                </Button>
            </Box>
        </Container>
    );
};

export default DemoTaoHoaDon;
