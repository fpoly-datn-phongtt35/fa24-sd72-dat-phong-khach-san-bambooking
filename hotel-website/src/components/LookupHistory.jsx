import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getLSDPbyEmail } from '../services/DatPhong.js';
import {
    Table, TableBody, Box, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, CircularProgress, Container, TablePagination, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Tùy chỉnh nút trang (hình tròn)
const PageButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50%',
    minWidth: '36px',
    height: '36px',
    margin: '0 4px',
    backgroundColor: active ? theme.palette.primary.main : 'transparent',
    color: active ? theme.palette.common.white : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
    },
}));

// Tùy chỉnh nút "..." (ellipsis)
const Ellipsis = styled(Typography)(({ theme }) => ({
    margin: '0 4px',
    display: 'flex',
    alignItems: 'center',
    height: '36px',
    color: theme.palette.text.primary,
}));

// Tùy chỉnh nút điều hướng (mũi tên)
const NavigationButton = styled(IconButton)(({ theme }) => ({
    width: '24px',
    height: '24px',
    '& .MuiSvgIcon-root': {
        fontSize: '16px', 
    },
}));

export default function LookupHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); 
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
            console.log(response);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (idDatPhong) => {
        navigate(`/lookup/ttdp/${idDatPhong}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedBookings = bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Tùy chỉnh các nút phân trang
    const CustomPaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
        const totalPages = Math.ceil(count / rowsPerPage);
        const maxVisiblePages = 4; // Số lượng nút trang tối đa hiển thị (trước khi dùng "...")

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
        };

        const handlePageButtonClick = (event, pageNumber) => {
            onPageChange(event, pageNumber);
        };

        //  hiển thị các nút trang
        const getPageNumbers = () => {
            const pages = [];
            const startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }

            for (let i = Math.max(1, startPage); i <= endPage; i++) {
                if (i < totalPages - 1) {
                    pages.push(i);
                }
            }

            if (endPage < totalPages - 2) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages - 1);
            }
            return pages;
        };

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                <NavigationButton onClick={handleBackButtonClick} disabled={page === 0}>
                    <ArrowBackIosIcon />
                </NavigationButton>
                {getPageNumbers().map((pageNum, index) =>
                    pageNum === '...' ? (
                        <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
                    ) : (
                        <PageButton
                            key={pageNum}
                            active={page === pageNum}
                            onClick={(event) => handlePageButtonClick(event, pageNum)}
                        >
                            {pageNum + 1}
                        </PageButton>
                    )
                )}
                <NavigationButton onClick={handleNextButtonClick} disabled={page >= totalPages - 1}>
                    <ArrowForwardIosIcon />
                </NavigationButton>
            </Box>
        );
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
                <>
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
                                {paginatedBookings.map((booking) => (
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={bookings.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={CustomPaginationActions}
                            labelDisplayedRows={() => ''}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
}