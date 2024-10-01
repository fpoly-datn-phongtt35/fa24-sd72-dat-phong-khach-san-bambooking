import React, { useState } from 'react';
import { ThemDichVuDiKem } from '../../services/DichVuDiKemService';

const FormAddDichVuDiKem = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        id_dich_vu: '',
        id_loai_phong: '',
        trang_thai: 'active', 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        ThemDichVuDiKem(formData)
            .then(response => {
                console.log("Thêm thành công:", response.data);
                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
            });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Thêm Dịch Vụ Đi Kèm Mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID Dịch Vụ:</label>
                        <input
                            type="number"
                            name="id_dich_vu"
                            value={formData.id_dich_vu}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>ID Loại Phòng:</label>
                        <input
                            type="number"
                            name="id_loai_phong"
                            value={formData.id_loai_phong}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Trạng Thái:</label>
                        <select
                            name="trang_thai"
                            value={formData.trang_thai}
                            onChange={handleInputChange}
                        >
                            <option value="active">Kích Hoạt</option>
                            <option value="inactive">Không Kích Hoạt</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={handleClose}>Đóng</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAddDichVuDiKem;
