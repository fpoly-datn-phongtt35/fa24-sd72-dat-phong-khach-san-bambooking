import React, { useEffect, useState } from 'react';
import { listImage } from '../../services/VatTuService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';
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

const VatTu = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 4;
    const [selectedData, setSelectedData] = useState(null);
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const getAllSanPham = () => {
        listImage({ page: currentPage, size: itemsPerPage }, searchQuery)
            .then((response) => {
                setImages(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log("Lỗi : " + error);
            });
    };

    useEffect(() => {
        getAllSanPham();
    }, [totalPages, currentPage, searchQuery]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [showDetailForm, setShowDetailForm] = useState(false);

    const handleOpenFormAdd = () => {
        setShowAddForm(true);
    };

    const handleCloseFormAdd = () => {
        setShowAddForm(false);
        getAllSanPham();
    };

    const handleOpenFormDetail = (id) => {
        const selectedItem = images.find(item => item.id === id);
        setSelectedData(selectedItem);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false);
        setSelectedData(null);
        getAllSanPham();
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    {/* Thanh công cụ chứa nút thêm và ô tìm kiếm */}
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Button variant="contained" color="success" onClick={handleOpenFormAdd}>
                                Thêm Vật Tư
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Tìm kiếm theo tên vật tư"
                                variant="outlined"
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Bảng danh sách vật tư */}
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên vật tư</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell>Hình ảnh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {images.length > 0 ? (
                                    images.map(image => (
                                        <TableRow key={image.id} onClick={() => handleOpenFormDetail(image.id)}>
                                            <TableCell>{image.id}</TableCell>
                                            <TableCell>{image.tenVatTu}</TableCell>
                                            <TableCell>{image.gia}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={image.hinhAnh}
                                                    alt={image.tenVatTu}
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="4" align="center">Không có dữ liệu tìm kiếm</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Phân trang */}
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                            count={totalPages}
                            page={currentPage + 1}
                            onChange={(event, value) => setCurrentPage(value - 1)}
                            color="primary"
                        />
                    </Box>

                    {/* Form thêm và chi tiết */}
                    {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}
                    {showDetailForm && <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />}
                </CardContent>
            </Card>
        </Box>
    );
};

export default VatTu;