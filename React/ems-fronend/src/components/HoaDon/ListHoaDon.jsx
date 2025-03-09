import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listHoaDon } from '../../services/HoaDonService';
import {Box, Container, Input, Option, Select, Sheet, Table, Tooltip, Typography} from '@mui/joy';
import { IconButton, Pagination, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';

const ListHoaDon = () => {
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [trangThai, setTrangThai] = useState("Chưa thanh toán");
    const [keyword, setKeyword] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const getAllHoaDon = () => {
        const pageable = {
            page: currentPage,
            size: itemsPerPage
        };

        listHoaDon(pageable, trangThai, keyword)
            .then((response) => {
                setHoaDon(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getAllHoaDon();
    }, [currentPage, itemsPerPage, trangThai, keyword]);

    const handleSearch = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleTrangThaiChange = (value) => {
        setTrangThai(value);
        setCurrentPage(0);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
    };

    const formatCurrency = (amount) => {
        if (amount == null) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography level="h3">Quản lý hóa đơn</Typography>
            </Box>
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                <Stack>
                    <Input
                        placeholder="Tìm kiếm hóa đơn..."
                        startDecorator={<SearchIcon />}
                        sx={{ width: '400px' }}
                        onChange={handleSearch}
                    />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography level="title-sm">Trạng thái:</Typography>
                    <Select
                        value={trangThai}
                        onChange={(e, value) => handleTrangThaiChange(value)}
                        sx={{ width: '200px' }}
                    >
                        <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                        <Option value="Chờ xác nhận">Chờ xác nhận</Option>
                        <Option value="Đã thanh toán">Đã thanh toán</Option>
                    </Select>
                    <Typography level="title-sm">Hiển thị:</Typography>
                    <Select
                        value={itemsPerPage}
                        onChange={(e, value) => setItemsPerPage(value)}
                        sx={{ width: '80px' }}
                    >
                        <Option value={5}>5</Option>
                        <Option value={10}>10</Option>
                        <Option value={25}>25</Option>
                        <Option value={50}>50</Option>
                    </Select>
                </Stack>
            </Box>
            <Sheet sx={{ marginTop: 2, padding: '2px', borderRadius: '5px' }}>
                <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                    <thead>
                        <tr>
                            <th>Mã hóa đơn</th>
                            <th>Tên nhân viên</th>
                            {/* <th>Tên khách hàng</th> */}
                            <th>Ngày tạo</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hoaDon.map((item) => (
                            <tr key={item.id}>
                                <td>{item.maHoaDon}</td>
                                <td>{item.tenNhanVien}</td>
                                {/* <td>{item.tenKhachHang}</td> */}
                                <td>{item.ngayTao}</td>
                                <td>{formatCurrency(item.tongTien)}</td>
                                <td>{item.trangThai}</td>
                                <td className="text-center">
                                    <Tooltip title="Thanh toán">
                                        <IconButton
                                            color="success"
                                            variant="plain"
                                            onClick={() => navigate(`/thanh-toan/${item.id}`)}
                                            disabled={item.trangThai === "Đã thanh toán"}
                                        >
                                            <PaymentIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Thông tin">
                                        <IconButton
                                            color="warning"
                                            variant="plain"
                                            onClick={() => navigate(`/hoa-don/${item.id}`)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, marginBottom: 3}}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </Box>
            )}
        </Container>
    );
};

export default ListHoaDon;
