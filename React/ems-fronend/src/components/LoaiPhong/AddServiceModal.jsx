import React, { useState, useEffect,useRef } from 'react';
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
    const dialogRef = useRef(null); // Thêm ref cho Dialog

    useEffect(() => {
        DanhSachDichVu()
            .then(response => setDichVuList(response.data))
            .catch(console.error);
    }, []);

    const handleAddDichVuDiKem = () => {
        if (!selectedDichVu || !soLuongDichVu) {
            Swal.fire({ title: 'Lỗi!', text: 'Vui lòng chọn dịch vụ và nhập số lượng.', icon: 'error',target: dialogRef.current,
            backdrop: true, });
            return;
        }
        const soLuong = parseInt(soLuongDichVu);
        if (soLuong < 1) {
            Swal.fire({ title: 'Lỗi!', text: 'Số lượng phải lớn hơn hoặc bằng 1.', icon: 'error',target: dialogRef.current,
            backdrop: true, });
            return;
        }
        const dichVuDiKemRequest = {
            loaiPhong: { id: loaiPhongId },
            dichVu: { id: selectedDichVu },
            soLuong: soLuong,
            trangThai: true,
        };
        ThemDichVuDiKem(dichVuDiKemRequest)
            .then(() => {
                Swal.fire({ title: 'Thành công!', text: 'Dịch vụ đã được thêm.', icon: 'success' ,target: dialogRef.current,
                backdrop: true,});
                setSelectedDichVu('');
                setSoLuongDichVu('');
                onAddSuccess();
                handleClose();
            })
            .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể thêm dịch vụ.', icon: 'error',target: dialogRef.current,
            backdrop: true, }));
    };

    const handleSoLuongChange = (e) => {
        const value = e.target.value;
        // Chỉ cho phép cập nhật nếu giá trị là chuỗi rỗng hoặc số >= 1
        if (value === '' || (parseInt(value) >= 1 && !isNaN(value))) {
            setSoLuongDichVu(value);
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} ref={dialogRef} maxWidth="sm" fullWidth>
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
                    onChange={handleSoLuongChange}
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