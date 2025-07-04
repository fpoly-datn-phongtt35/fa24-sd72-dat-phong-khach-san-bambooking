import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

import { ThemPhuThu, CapNhatPhuThu, CheckPhuThuExistsByName } from "../../services/PhuThuService";
import Swal from "sweetalert2";


const PhuThuForm = ({ show, handleClose, data, idxp }) => {
    const [formData, setFormData] = useState({
        id: data?.id || "",
        xepPhong: { id: idxp },
        tenPhuThu: data?.tenPhuThu || "",
        tienPhuThu: data?.tienPhuThu || 0,
        soLuong: data?.soLuong || 1,
        trangThai: 0,
    });

    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id || "",
                xepPhong: { id: idxp },
                tenPhuThu: data.tenPhuThu || "",
                tienPhuThu: data.tienPhuThu || 0,
                soLuong: data.soLuong || 1,
                trangThai: 0,
            });
        } else {
            setFormData({
                id: "",
                xepPhong: { id: idxp },
                tenPhuThu: "",
                tienPhuThu: 0,
                soLuong: 1,
                trangThai: 0,
            });
        }
    }, [data, idxp]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let parsedValue = value;
        if (name === "tienPhuThu") parsedValue = parseFloat(value) || 0;
        else if (name === "soLuong") parsedValue = parseInt(value, 10) || 1;

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };
    
    const [errors, setErrors] = useState({});
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.tenPhuThu.trim()) {
            newErrors.tenPhuThu = "Tên phụ thu không được để trống";
        }

        if (isNaN(formData.tienPhuThu) || formData.tienPhuThu < 0) {
            newErrors.tienPhuThu = "Tiền phụ thu phải là số không âm";
        }

        if (!Number.isInteger(formData.soLuong) || formData.soLuong < 1) {
            newErrors.soLuong = "Số lượng phải là số nguyên >= 1";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            if (data) {
                // Nếu đang ở chế độ sửa
                await CapNhatPhuThu(formData);
                Swal.fire("Thành công", "Cập nhật phụ thu thành công!", "success");
                handleClose();
            } else {
                // Nếu đang ở chế độ thêm mới
                const { xepPhong, tenPhuThu } = formData;

                try {
                    // Gọi API mới để kiểm tra theo idXepPhong + tenPhuThu
                    const response = await CheckPhuThuExistsByName(xepPhong.id, tenPhuThu);
                    const existingPhuThu = response.data;

                    const updatedPhuThu = {
                        ...formData,
                        id: existingPhuThu.id,
                    };

                    await CapNhatPhuThu(updatedPhuThu);
                    Swal.fire("Đã cập nhật", "Phụ thu đã tồn tại và đã được cập nhật!", "success");
                    handleClose();
                } catch (err) {
                    if (err.response?.status === 404) {
                        // Không tìm thấy phụ thu với tên đó => thêm mới
                        await ThemPhuThu(formData);
                        Swal.fire("Thành công", "Đã thêm phụ thu mới!", "success");
                        handleClose();
                    } else {
                        throw err;
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi xử lý phụ thu:", err);
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi xử lý phụ thu!", "error");
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{data ? "Cập nhật phụ thu" : "Thêm phụ thu"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Tên phụ thu"
                        name="tenPhuThu"
                        fullWidth
                        margin="dense"
                        value={formData.tenPhuThu}
                        onChange={handleChange}
                        error={!!errors.tenPhuThu}
                        helperText={errors.tenPhuThu}
                    />

                    <TextField
                        label="Tiền phụ thu"
                        name="tienPhuThu"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={formData.tienPhuThu}
                        onChange={handleChange}
                        inputProps={{ min: 0 }}
                        error={!!errors.tienPhuThu}
                        helperText={errors.tienPhuThu}
                    />

                    <TextField
                        label="Số lượng"
                        name="soLuong"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={formData.soLuong}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        error={!!errors.soLuong}
                        helperText={errors.soLuong}
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PhuThuForm;
