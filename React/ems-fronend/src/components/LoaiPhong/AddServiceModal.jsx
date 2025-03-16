import React, { useState, useEffect } from 'react';
import { DanhSachDichVu } from '../../services/DichVuDiKemService';
import { ThemDichVuDiKem } from '../../services/LoaiPhongService';
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

const AddServiceModal = ({ show, handleClose, loaiPhongId, onAddSuccess }) => {
    const [dichVuList, setDichVuList] = useState([]);
    const [selectedDichVu, setSelectedDichVu] = useState('');
    const [soLuongDichVu, setSoLuongDichVu] = useState('');

    useEffect(() => {
        DanhSachDichVu()
            .then(response => setDichVuList(response.data))
            .catch(console.error);
    }, []);

    const handleAddDichVuDiKem = () => {
        if (!selectedDichVu || !soLuongDichVu) {
            Swal.fire({ title: 'Lỗi!', text: 'Vui lòng chọn dịch vụ và nhập số lượng.', icon: 'error' });
            return;
        }
        const dichVuDiKemRequest = {
            loaiPhong: { id: loaiPhongId },
            dichVu: { id: selectedDichVu },
            soLuong: parseInt(soLuongDichVu),
            trangThai: true,
        };
        ThemDichVuDiKem(dichVuDiKemRequest)
            .then(() => {
                Swal.fire({ title: 'Thành công!', text: 'Dịch vụ đã được thêm.', icon: 'success' });
                setSelectedDichVu('');
                setSoLuongDichVu('');
                onAddSuccess();
                handleClose();
            })
            .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể thêm dịch vụ.', icon: 'error' }));
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
                <Typography variant="h6">Thêm Dịch Vụ Đi Kèm</Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="dich-vu-label">Chọn dịch vụ</InputLabel>
                    <Select
                        labelId="dich-vu-label"
                        value={selectedDichVu}
                        label="Chọn dịch vụ"
                        onChange={(e) => setSelectedDichVu(e.target.value)}
                    >
                        <MenuItem value="">-- Chọn dịch vụ --</MenuItem>
                        {dichVuList.map(dv => (
                            <MenuItem key={dv.id} value={dv.id}>{dv.tenDichVu}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Số lượng"
                    type="number"
                    value={soLuongDichVu}
                    onChange={(e) => setSoLuongDichVu(e.target.value)}
                    margin="normal"
                    inputProps={{ min: 1 }}
                    placeholder="Nhập số lượng"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleAddDichVuDiKem}>
                    Thêm Dịch Vụ
                </Button>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddServiceModal;