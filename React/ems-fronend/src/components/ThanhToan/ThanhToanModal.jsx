import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Typography,
    Button,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Chip,
    Stack,
    Divider,
    Paper,
    DialogContent,
    FormControl,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    Input
} from '@mui/material';
import { getHoaDonById, updateThanhToan } from '../../services/ThanhToanService';

const ThanhToanModal = ({ show, onClose, thanhToan, setHoaDon }) => {
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState(false);
    const [tienThanhToan, setTienThanhToan] = useState(thanhToan?.tienThanhToan || 0);
    const [hoaDon, setHoaDonLocal] = useState(thanhToan?.hoaDon || null);

    const bankInfo = {
        bankName: "Ngân hàng TMCP Quân Đội",
        accountNumber: "0374135106",
        accountName: "BUI HOANG LONG",
    };

    useEffect(() => {
        const fetchHoaDon = async () => {
            const hoaDonResponse = await getHoaDonById(thanhToan.hoaDon.id);
            setHoaDonLocal(hoaDonResponse.data);
            setHoaDon(hoaDonResponse.data);
            setTienThanhToan(hoaDonResponse.data.tongTien);
        };

        if (thanhToan?.hoaDon?.id) {
            fetchHoaDon();
        }
    }, [thanhToan, setHoaDon]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleTienThanhToanChange = (event) => {
        const value = event.target.value;
        let numericValue = value.replace(/[^0-9]/g, '');
        setTienThanhToan(numericValue);
    };

    const handleUpdateTienThanhToan = async () => {
        try {
            const data = {
                id: thanhToan.id,
                idHoaDon: thanhToan.hoaDon.id,
                tienThanhToan: Number(tienThanhToan),
                phuongThucThanhToan: phuongThucThanhToan
            };

            await updateThanhToan(thanhToan.id, data);
            const updatedHoaDon = await getHoaDonById(thanhToan.hoaDon.id);
            setHoaDonLocal(updatedHoaDon.data);
            setHoaDon(updatedHoaDon.data);

            alert('Thanh toán thành công');
            onClose();
        } catch (error) {
            console.error('Lỗi khi thực hiện thanh toán: ', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán, vui lòng thử lại.');
        }
    };

    return (
        <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth sx={{ marginLeft: 18 }}>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    Thanh Toán
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={4}>
                    <ToggleButtonGroup
                        value={phuongThucThanhToan}
                        exclusive
                        onChange={(e, value) => setPhuongThucThanhToan(value)}
                        fullWidth
                        color="primary"
                    >
                        <ToggleButton value={false} sx={{ textTransform: 'none', fontSize: '1rem' }}>
                            Tiền mặt
                        </ToggleButton>
                        <ToggleButton value={true} sx={{ textTransform: 'none', fontSize: '1rem' }}>
                            Chuyển khoản
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {phuongThucThanhToan === false ? (
                        hoaDon ? (
                            <Paper elevation={2} sx={{ paddingLeft: 13, paddingTop: 5, paddingBottom: 4, backgroundColor: '#f9f9f9' }}>
                                <Stack spacing={3}>
                                    <Typography><b>Ngày thanh toán:</b> {thanhToan.ngayThanhToan ? formatDate(thanhToan.ngayThanhToan) : 'Chưa có'}</Typography>
                                    <Typography><b>Tổng tiền:</b> <Chip label={formatCurrency(hoaDon.tongTien)} color="success" variant="outlined" sx={{ fontSize: '16px' }} /></Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography><b>Tiền thanh toán:</b></Typography>
                                        <FormControl variant="standard" sx={{ width: '15ch' }}>
                                            <Input
                                                type="text"
                                                value={tienThanhToan}
                                                onChange={handleTienThanhToanChange}
                                                endAdornment={<InputAdornment position="end">vnđ</InputAdornment>}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Typography><b>Tiền thừa:</b> <Chip label={formatCurrency(tienThanhToan - hoaDon.tongTien)} color={tienThanhToan - hoaDon.tongTien >= 0 ? 'warning' : 'error'} variant='outlined' sx={{ fontSize: '16px' }} /></Typography>
                                </Stack>
                            </Paper>
                        ) : (
                            <Typography align="center">Không có thông tin thanh toán tiền mặt.</Typography>
                        )
                    ) : (
                        hoaDon ? (
                            <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
                                <Stack spacing={2} alignItems="center">
                                    <Typography variant="h6" fontWeight="bold">Thanh toán qua Banking</Typography>
                                    <Typography><b>Tổng tiền:</b> {formatCurrency(hoaDon.tongTien)}</Typography>
                                    <img src={`https://api.vietqr.io/image/970422-0374135106-Q5S7ZXh.jpg?accountName=${encodeURIComponent(bankInfo.accountName)}&amount=${hoaDon.tongTien}&addInfo=${encodeURIComponent(`Thanh toan hoa don ${hoaDon.id}`)}`}
                                        style={{
                                            width: '210px',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }} />
                                    <Stack spacing={1} alignItems="center">
                                        <Typography><b>Ngân hàng:</b> {bankInfo.bankName}</Typography>
                                        <Typography><b>Số tài khoản:</b> {bankInfo.accountNumber}</Typography>
                                        <Typography><b>Chủ tài khoản:</b> {bankInfo.accountName}</Typography>
                                        <Typography><b>Nội dung:</b> Thanh toan hoa don {hoaDon.id}</Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" align="center">
                                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                                    </Typography>
                                </Stack>
                            </Paper>
                        ) : (
                            <Typography align="center">Không có thông tin thanh toán chuyển khoản.</Typography>
                        )
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', p: 3, pt: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleUpdateTienThanhToan}
                    disabled={tienThanhToan <= 0}
                >
                    Xác nhận Thanh Toán
                </Button>
                <Button variant="outlined" color="error" onClick={onClose}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ThanhToanModal;