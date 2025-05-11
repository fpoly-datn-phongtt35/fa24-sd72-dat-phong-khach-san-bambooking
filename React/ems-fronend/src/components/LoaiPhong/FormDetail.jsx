import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateLoaiPhong, deleteLoaiPhong, DanhSachVatTuLoaiPhong } from '../../services/LoaiPhongService';
import { deleteVatTuLoaiPhong, listVatTuLoaiPhong, addVatTuLoaiPhong } from '../../services/VatTuLoaiPhong';
import { DanhSachDichVu, XoaDichVuDiKem } from '../../services/DichVuDiKemService';
import { ThemDichVuDiKem, DanhSachDichVuDiKem } from '../../services/LoaiPhongService';
import AddServiceModal from './AddServiceModal';
import AddUtilityModal from './AddUtilityModal';
import './Detail.css';
import Swal from 'sweetalert2';

const FormDetail = ({ show, handleClose, data }) => {
    const [formData, setFormData] = useState({
        id: data?.id || '',
        tenLoaiPhong: data?.tenLoaiPhong || '',
        maLoaiPhong: data?.maLoaiPhong || '',
        dienTich: data?.dienTich || '',
        soKhachToiDa: data?.soKhachToiDa || '',
        donGia: data?.donGia || '',
        moTa: data?.moTa || '',
        donGiaPhuThu: data?.donGiaPhuThu || '',
        trangThai: data?.trangThai || 'Hoạt động',
    });

    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showAddUtilityModal, setShowAddUtilityModal] = useState(false);
    const [ListVatTuLoaiPhong, setListVatTuLoaiPhong] = useState([]);
    const [ListDichVuDiKem, setListDichVuDiKem] = useState([]);
    const itemsPerPage = 3;
    const [currentPage] = useState(0);

    useEffect(() => {
        if (formData.id) {
            fetchDanhSachVatTu();
            fetchDanhSachDichVu();
        }
        if (data?.trangThai !== undefined) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                trangThai: data.trangThai ? 'Hoạt động' : 'Không hoạt động',
            }));
        }
    }, [formData.id]);

    const fetchDanhSachVatTu = () => {
        DanhSachVatTuLoaiPhong(formData.id)
            .then(response => setListVatTuLoaiPhong(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách vật tư:", error));
    };

    const fetchDanhSachDichVu = () => {
        DanhSachDichVuDiKem(formData.id, { page: currentPage, size: itemsPerPage })
            .then(response => setListDichVuDiKem(response.data.content))
            .catch(error => console.error("Lỗi khi lấy danh sách dịch vụ đi kèm:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') return; // Không cho phép thay đổi id
        if (['donGia', 'dienTich', 'donGiaPhuThu', 'soKhachToiDa'].includes(name)) {
            // Chỉ cho phép số không âm hoặc chuỗi rỗng
            if (value >= 0 || value === '') {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra các trường không được nhỏ hơn 0 hoặc rỗng
        if (formData.donGia === '' || formData.donGia < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Đơn giá phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.dienTich === '' || formData.dienTich < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Diện tích phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.donGiaPhuThu === '' || formData.donGiaPhuThu < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Đơn giá phụ thu phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (formData.soKhachToiDa === '' || formData.soKhachToiDa < 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Số khách tối đa phải là số không âm!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Thông tin loại phòng sẽ được cập nhật!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedFormData = {
                    ...formData,
                    trangThai: formData.trangThai === 'Hoạt động',
                };

                updateLoaiPhong(updatedFormData)
                    .then(() => {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Thông tin loại phòng đã được cập nhật.',
                            icon: 'success'
                        });
                        handleClose();
                    })
                    .catch(() => {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể cập nhật loại phòng.',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const handleDeleteDichVuDiKem = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Dịch vụ đi kèm này sẽ bị xóa!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                XoaDichVuDiKem(id)
                    .then(() => {
                        Swal.fire({ title: 'Thành công!', text: 'Dịch vụ đi kèm đã được xóa.', icon: 'success' });
                        fetchDanhSachDichVu();
                    })
                    .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể xóa dịch vụ.', icon: 'error' }));
            }
        });
    };

    const handleDeleteVatTuLoaiPhong = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Vật tư này sẽ bị xóa!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteVatTuLoaiPhong(id)
                    .then(() => {
                        Swal.fire({ title: 'Thành công!', text: 'Vật tư đã được xóa.', icon: 'success' });
                        fetchDanhSachVatTu();
                    })
                    .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể xóa vật tư.', icon: 'error' }));
            }
        });
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Chi tiết loại phòng</Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ID"
                                name="id"
                                value={formData.id}
                                disabled
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Tên Loại Phòng"
                                name="tenLoaiPhong"
                                value={formData.tenLoaiPhong}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Diện tích"
                                name="dienTich"
                                value={formData.dienTich}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                fullWidth
                                label="Số khách tối đa"
                                name="soKhachToiDa"
                                value={formData.soKhachToiDa}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mã Loại Phòng"
                                name="maLoaiPhong"
                                value={formData.maLoaiPhong}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Đơn giá"
                                name="donGia"
                                value={formData.donGia}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                fullWidth
                                label="Đơn giá phụ thu"
                                name="donGiaPhuThu"
                                value={formData.donGiaPhuThu}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                fullWidth
                                label="Mô tả"
                                name="moTa"
                                value={formData.moTa}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng thái</label>
                                <select
                                    className="form-select"
                                    id="trangThai"
                                    name="trangThai"
                                    value={formData.trangThai}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Không hoạt động">Không hoạt động</option>
                                </select>
                            </div>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button variant="contained" color="primary" type="submit">Lưu thay đổi</Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" color="primary" gutterBottom>Danh sách dịch vụ đi kèm</Typography>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <List>
                                    {ListDichVuDiKem.length > 0 ? (
                                        ListDichVuDiKem.map(dv => (
                                            <ListItem
                                                key={dv.id}
                                                button
                                                onClick={() => handleDeleteDichVuDiKem(dv.id)}
                                                secondaryAction={<Chip label={dv.soLuong || 'Chưa có'} color="secondary" size="small" />}
                                            >
                                                <ListItemText primary={dv.tenDichVu} />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText primary="Chưa có dịch vụ đi kèm." primaryTypographyProps={{ color: 'text.secondary' }} />
                                        </ListItem>
                                    )}
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" color="primary" gutterBottom>Danh sách vật tư loại phòng</Typography>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <List>
                                    {ListVatTuLoaiPhong.length > 0 ? (
                                        ListVatTuLoaiPhong.map(ti => (
                                            <ListItem
                                                key={ti.id}
                                                button
                                                onClick={() => handleDeleteVatTuLoaiPhong(ti.id)}
                                                secondaryAction={<Chip label={ti.soLuong || 'Chưa có'} color="secondary" size="small" />}
                                            >
                                                <ListItemText primary={ti.tenVatTu} />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText primary="Không có vật tư nào" primaryTypographyProps={{ color: 'text.secondary' }} />
                                        </ListItem>
                                    )}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => setShowAddServiceModal(true)}>
                    Thêm dịch vụ
                </Button>
                <Button variant="contained" color="primary" onClick={() => setShowAddUtilityModal(true)}>
                    Thêm vật tư
                </Button>
            </DialogActions>

            <AddServiceModal
                show={showAddServiceModal}
                handleClose={() => setShowAddServiceModal(false)}
                loaiPhongId={formData.id}
                onAddSuccess={() => fetchDanhSachDichVu()}
            />
            <AddUtilityModal
                show={showAddUtilityModal}
                handleClose={() => setShowAddUtilityModal(false)}
                loaiPhongId={formData.id}
                onAddSuccess={() => fetchDanhSachVatTu()}
            />
        </Dialog>
    );
};

export default FormDetail;