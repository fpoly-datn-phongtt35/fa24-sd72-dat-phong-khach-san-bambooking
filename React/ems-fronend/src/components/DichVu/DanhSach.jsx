import React, { useState, useEffect } from 'react';
import { DuLieu, XoaDichVu } from '../../services/DichVuService';
import FormAdd from './FormAdd';
import FormUpdate from './FormUpdate';
import Swal from 'sweetalert2';
import {
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
} from '@mui/material';

const DanhSach = () => {
    const [dichVuList, setDichVuList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVu, setCurrentDichVu] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        loadDichVu();
    }, [searchKeyword, filterStatus, currentPage]);

    const loadDichVu = () => {
        DuLieu()
            .then(response => {
                const filteredData = response.data.filter(dv => {
                    const matchesStatus = filterStatus !== '' ? dv.trangThai === (filterStatus === 'true') : true;
                    const matchesKeyword = searchKeyword
                        ? dv.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        dv.moTa.toLowerCase().includes(searchKeyword.toLowerCase())
                        : true;

                    return matchesStatus && matchesKeyword;
                });

                const startIndex = currentPage * itemsPerPage;
                const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
                setDichVuList(paginatedData);
                setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ:", error);
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                XoaDichVu(id)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Dịch vụ đã được xóa thành công.',
                            confirmButtonColor: '#6a5acd'
                        });
                        loadDichVu();
                    })
                    .catch(error => {
                        console.error("Lỗi khi xóa dịch vụ:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể xóa dịch vụ. Vui lòng thử lại!',
                            confirmButtonColor: '#d33'
                        });
                    });
            }
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Button variant="contained" color="success" onClick={() => setShowForm(true)}>
                                Thêm Dịch Vụ
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Tìm kiếm..."
                                variant="outlined"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="true">Hoạt động</MenuItem>
                                    <MenuItem value="false">Ngừng hoạt động</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <Button variant="outlined" onClick={loadDichVu}>
                                Lọc
                            </Button>
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Dịch Vụ</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell>Mô Tả</TableCell>
                                    <TableCell>Hình ảnh</TableCell>
                                    <TableCell>Trạng Thái</TableCell>
                                    <TableCell>Hành Động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dichVuList.length > 0 ? (
                                    dichVuList.map((dv) => (
                                        <TableRow key={dv.id}>
                                            <TableCell>{dv.tenDichVu}</TableCell>
                                            <TableCell>{dv.donGia}</TableCell>
                                            <TableCell>{dv.moTa}</TableCell>
                                            <TableCell>
                                                <img src={dv.hinhAnh} alt={dv.tenDichVu} style={{ width: '100px', height: 'auto' }} />
                                            </TableCell>
                                            <TableCell>{dv.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="warning" onClick={() => { setCurrentDichVu(dv); setShowUpdateForm(true); }}>Sửa</Button>
                                                <Button variant="outlined" color="error" onClick={() => handleDelete(dv.id)} sx={{ ml: 1 }}>Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="6" align="center">Không có dịch vụ</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                            count={totalPages}
                            page={currentPage + 1}
                            onChange={(event, page) => setCurrentPage(page - 1)}
                            color="primary"
                        />
                    </Box>

                    {showForm && <FormAdd show={showForm} handleClose={() => setShowForm(false)} refreshData={loadDichVu} />}
                    {showUpdateForm && <FormUpdate show={showUpdateForm} handleClose={() => setShowUpdateForm(false)} refreshData={loadDichVu} dichVu={currentDichVu} />}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DanhSach;
