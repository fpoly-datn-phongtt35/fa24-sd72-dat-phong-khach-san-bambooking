import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDichVuSuDung, getHoaDonById, getThongTinHoaDonByHoaDonId, getPhuThuByHoaDonId, getListVatTuHongThieu } from "../../services/InfoHoaDon";
import { Container, Box, Sheet, Table, Button, Typography, Accordion, AccordionDetails } from "@mui/joy";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InfoHoaDon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState(null);
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [dichVuSuDung, setDichVuSuDung] = useState([]);
    const [phuThu, setPhuThu] = useState([]);
    const [danhSachVatTu, setDanhSachVatTu] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hoaDonResponse, thongTinHoaDonResponse, dichVuSuDungResponse, phuThuResponse, vatTuResponse] = await Promise.all([
                    getHoaDonById(id),
                    getThongTinHoaDonByHoaDonId(id),
                    getDichVuSuDung(id),
                    getPhuThuByHoaDonId(id),
                    getListVatTuHongThieu(id)
                ]);

                setHoaDon(hoaDonResponse?.data || null);
                setThongTinHoaDon(thongTinHoaDonResponse?.data || []);
                setDichVuSuDung(dichVuSuDungResponse?.data || []);
                setPhuThu(phuThuResponse?.data || []);
                setDanhSachVatTu(vatTuResponse?.data || []);
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

    const handleExpand = (maPhong) => {
        setExpanded(expanded === maPhong ? null : maPhong);
    };

    const calculateDays = (ngayNhanPhong, ngayTraPhong) => {
        const [day, month, year, time] = ngayNhanPhong.split(/\/| /);
        const start = new Date(`${year}-${month}-${day}`);

        const [dayEnd, monthEnd, yearEnd, timeEnd] = ngayTraPhong.split(/\/| /);
        const end = new Date(`${yearEnd}-${monthEnd}-${dayEnd}`);

        const diffTime = end - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(diffDays, 1);
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

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "nowrap",
                }}
            >
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Mã hóa đơn</Typography>
                    <Typography>{hoaDon.maHoaDon}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Mã đặt phòng</Typography>
                    <Typography>{hoaDon.maDatPhong}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Ngày tạo</Typography>
                    <Typography>{hoaDon.ngayTao}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Tên nhân viên</Typography>
                    <Typography>{hoaDon.tenNhanVien}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Tên khách hàng</Typography>
                    <Typography>{hoaDon.tenKhachHang}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Tổng tiền</Typography>
                    <Typography>{formatCurrency(hoaDon.tongTien)}</Typography>
                </Sheet>
                <Sheet sx={{ p: 2, borderRadius: 2, boxShadow: 3, minWidth: 150, flexShrink: 0, bgcolor: "#fff" }}>
                    <Typography level="h6" sx={{ fontWeight: 'bold' }}>Trạng thái</Typography>
                    <Typography>{hoaDon.trangThai}</Typography>
                </Sheet>
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Sheet sx={{ padding: '2px', borderRadius: '5px' }}>
                    <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                        <thead>
                            <tr>
                                <th>Tên phòng</th>
                                <th>Ngày nhận phòng</th>
                                <th>Ngày trả phòng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thongTinHoaDon.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr onClick={() => handleExpand(item.tenPhong)} style={{ cursor: 'pointer' }}>
                                        <td>{item.tenPhong}</td>
                                        <td>{item.ngayNhanPhong}</td>
                                        <td>{item.ngayTraPhong}</td>
                                    </tr>
                                    {expanded === item.tenPhong && (
                                        <tr>
                                            <td colSpan={3}>
                                                <Accordion expanded={true}>
                                                    <AccordionDetails sx={{ m: 2 }}>
                                                        <Box>
                                                            <Sheet>
                                                                <Typography variant="h6">Tiền phòng</Typography>
                                                                <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Số ngày ở</th>
                                                                            <th>Giá phòng</th>
                                                                            <th>Tiền phòng</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{calculateDays(item.ngayNhanPhong, item.ngayTraPhong)}</td>
                                                                            <td>{formatCurrency(item.giaPhong)}</td>
                                                                            <td>{formatCurrency(item.tienPhong)}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>

                                                                {dichVuSuDung.some(dv => dv.tenPhong === item.tenPhong) && (
                                                                    <>
                                                                        <Typography variant="h6" sx={{ mt: 3 }}>Dịch vụ sử dụng</Typography>
                                                                        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên dịch vụ</th>
                                                                                    <th>Giá dịch vụ</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Tổng tiền</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {dichVuSuDung.filter(dv => dv.tenPhong === item.tenPhong).map((dv, i) => (
                                                                                    <tr key={i}>
                                                                                        <td>{dv.tenDichVu}</td>
                                                                                        <td>{formatCurrency(dv.giaDichVu)}</td>
                                                                                        <td>{dv.soLuongSuDung}</td>
                                                                                        <td>{formatCurrency(dv.giaDichVu * dv.soLuongSuDung)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                    </>
                                                                )}

                                                                {phuThu.some(pt => pt.tenPhong === item.tenPhong) && (
                                                                    <>
                                                                        <Typography variant="h6" sx={{ mt: 3 }}>Phụ thu</Typography>
                                                                        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Loại phụ thu</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Số tiền</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {phuThu.filter(pt => pt.tenPhong === item.tenPhong).map((pt, i) => (
                                                                                    <tr key={i}>
                                                                                        <td>{pt.tenPhuThu}</td>
                                                                                        <td>{pt.soLuong}</td>
                                                                                        <td>{formatCurrency(pt.tienPhuThu)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                    </>
                                                                )}

                                                                {danhSachVatTu.some(vt => vt.tenPhong === item.tenPhong) && (
                                                                    <>
                                                                        <Typography variant="h6" sx={{ mt: 3 }}>Danh sách vật tư hỏng/thiếu</Typography>
                                                                        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Tên vật tư</th>
                                                                                    <th>Giá vật tư</th>
                                                                                    <th>Số lượng thiếu</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {danhSachVatTu.filter(vt => vt.tenPhong === item.tenPhong).map((vt, i) => (
                                                                                    <tr key={i}>
                                                                                        <td>{vt.tenVatTu}</td>
                                                                                        <td>{formatCurrency(vt.donGia)}</td>
                                                                                        <td>{vt.soLuongThieu}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                    </>
                                                                )}

                                                                {item.tienKhauTru > 0 && (
                                                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                                                        Tiền khấu trừ của phòng: {formatCurrency(item.tienKhauTru)}
                                                                    </Typography>
                                                                )}

                                                            </Sheet>
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </Sheet>
            </Box>
        </Container>
    );
};

export default InfoHoaDon;
