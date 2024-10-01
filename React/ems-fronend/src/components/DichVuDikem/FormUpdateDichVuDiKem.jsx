import React, { useState, useEffect } from 'react';
import { CapNhatDichVuDiKem } from '../../services/DichVuDiKemService';

const FormUpdateDichVuDiKem = ({ show, handleClose, refreshData, dichVuDiKem }) => {
    const [formData, setFormData] = useState({
        id_dich_vu: '',
        id_loai_phong: '',
        trang_thai: ''
    });

    useEffect(() => {
        if (dichVuDiKem) {
            setFormData(dichVuDiKem);
        }
    }, [dichVuDiKem]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        CapNhatDichVuDiKem(formData)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật dịch vụ đi kèm:", error);
            });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Cập Nhật Dịch Vụ Đi Kèm</h2>
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

export default FormUpdateDichVuDiKem;
