import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listPhong, updateStatus } from '../../services/PhongService';
import Swal from 'sweetalert2';
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    Button, TextField, TableContainer, Paper, Pagination
} from '@mui/material';

const ListPhong = () => {

    const navigate = useNavigate();
    const [p, setPhong] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemPerPage = 5;

    const getAllPhong = () => {
        listPhong({ page: currentPage, size: itemPerPage }, searchQuery)
            .then((response) => {
                setPhong(response.data.content);
                console.log(response.data.content)
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
            console.log(p)
    };

    useEffect(() => {
        getAllPhong();
    }, [currentPage, searchQuery]);

    const handleCreatePhong = () => {
        navigate('/add-phong');
    }

    const handleUpdatePhong = (id) => {
        navigate(`/update-phong/${id}`)
    }

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handleUpdateStatus = (phongId) => {
        Swal.fire({
            title: 'Xác nhận cập nhật trạng thái',
            text: 'Bạn có chắc chắn muốn thay đổi trạng thái của phòng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(phongId)
                    .then(() => {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Trạng thái phòng đã được cập nhật.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        getAllPhong(); // Làm mới danh sách phòng sau khi cập nhật
                    })
                    .catch((error) => {
                        console.error("Cập nhật trạng thái phòng thất bại:", error);
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau!',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };
    

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // reset lại trang khi tìm kiếm
    }

    return (
        <div className='container'>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCreatePhong}
                        startIcon={<i className="bi bi-plus-circle"></i>}
                    >
                        Thêm Phòng
                    </Button>
                    <TextField
                        variant="outlined"
                        label="Tìm kiếm phòng..."
                        value={searchQuery}
                        onChange={handleSearchInput}
                        size="small"
                    />
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID Phòng</b></TableCell>
                                <TableCell><b>Tên loại phòng</b></TableCell>
                                <TableCell><b>Mã phòng</b></TableCell>
                                <TableCell><b>Tên phòng</b></TableCell>
                                <TableCell><b>Tình trạng</b></TableCell>
                                <TableCell><b>Trạng thái</b></TableCell>
                                <TableCell><b>Chức năng</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {p.length > 0 ? (
                                p.map(phong => (
                                    <TableRow key={phong.id}>
                                        <TableCell>{phong.id}</TableCell>
                                        <TableCell>{phong.loaiPhong?.tenLoaiPhong}</TableCell>
                                        <TableCell>{phong.maPhong}</TableCell>
                                        <TableCell>{phong.tenPhong}</TableCell>
                                        <TableCell>{phong.tinhTrang}</TableCell>
                                        <TableCell>{phong.trangThai ? "Hoạt động" : "Không hoạt động"}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => handleUpdateStatus(phong.id)}
                                            >
                                                Đổi trạng thái
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                sx={{ marginLeft: '10px' }}
                                                onClick={() => handleUpdatePhong(phong.id)}
                                            >
                                                Thông tin
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Không có phòng</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={(_, value) => setCurrentPage(value - 1)}
                        color="primary"
                    />
                </div>
            </Paper>
        </div>
    );
}

export default ListPhong;
