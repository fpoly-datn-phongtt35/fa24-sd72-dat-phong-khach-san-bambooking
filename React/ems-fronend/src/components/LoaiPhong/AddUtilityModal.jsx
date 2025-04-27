import React, { useState, useEffect } from 'react';
import { listVatTuLoaiPhong, addVatTuLoaiPhong } from '../../services/VatTuLoaiPhong';
import Swal from 'sweetalert2';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';

const AddUtilityModal = ({ show, handleClose, loaiPhongId, onAddSuccess }) => {
    const [allTienIch, setAllTienIch] = useState([]);
    const [selectedVatTu, setSelectedVatTu] = useState('');
    const [soLuongVatTu, setSoLuongVatTu] = useState('');

    useEffect(() => {
        listVatTuLoaiPhong()
            .then(response => setAllTienIch(response.data))
            .catch(console.error);
    }, []);

    const handleAddTienIch = () => {
        if (!selectedVatTu || !soLuongVatTu) {
            Swal.fire({ title: 'Lỗi!', text: 'Vui lòng chọn vật tư và nhập số lượng.', icon: 'error' });
            return;
        }
        const soLuong = parseInt(soLuongVatTu);
        if (soLuong < 1) {
            Swal.fire({ title: 'Lỗi!', text: 'Số lượng phải lớn hơn hoặc bằng 1.', icon: 'error' });
            return;
        }
        const vatTuPhongRequest = {
            loaiPhong: { id: loaiPhongId },
            vatTu: { id: selectedVatTu },
            soLuong: soLuong,
        };
        addVatTuLoaiPhong(vatTuPhongRequest)
            .then(() => {
                Swal.fire({ title: 'Thành công!', text: 'Vật tư đã được thêm.', icon: 'success' });
                setSelectedVatTu('');
                setSoLuongVatTu('');
                onAddSuccess();
                handleClose();
            })
            .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể thêm vật tư.', icon: 'error' }));
    };

    const handleSoLuongVatTuChange = (e) => {
        const value = e.target.value;
        // Chỉ cho phép cập nhật nếu giá trị là chuỗi rỗng hoặc số >= 1
        if (value === '' || (parseInt(value) >= 1 && !isNaN(value))) {
            setSoLuongVatTu(value);
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                <Typography variant="h6">Thêm Vật Tư Loại Phòng</Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="vat-tu-label">Chọn vật tư</InputLabel>
                    <Select
                        labelId="vat-tu-label"
                        value={selectedVatTu}
                        label="Chọn vật tư"
                        onChange={(e) => setSelectedVatTu(e.target.value)}
                    >
                        <MenuItem value="">-- Chọn vật tư --</MenuItem>
                        {allTienIch.map(ti => (
                            <MenuItem key={ti.id} value={ti.id}>{ti.tenVatTu}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Số lượng"
                    type="number"
                    value={soLuongVatTu}
                    onChange={handleSoLuongVatTuChange}
                    margin="normal"
                    inputProps={{ min: 1 }}
                    placeholder="Nhập số lượng"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleAddTienIch}>
                    Thêm Vật Tư
                </Button>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUtilityModal;