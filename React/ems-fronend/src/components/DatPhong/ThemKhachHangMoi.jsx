import React, { useState } from 'react';
import './ThemKhachHangMoi.scss'; 
import { createKhachHang } from '../../services/KhachHangService';
const ThemKhachHangMoi = ({ handleCloseModal }) => { 
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        gioiTinh: '',
        diaChi: '',
        sdt: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Khách hàng mới:', formData);
        createKhachHang(formData)
        .then(response => {
            alert('Thêm khách hàng mới thành công!');
            console.log(response.data);
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert('Thêm khách hàng mới thất bại, vui lòng thử lại.');
        })
        handleCloseModal(); 
    };

    return (
        <div className="form-container-TMKH">
            <h2 className="form-title">Thêm Khách Hàng Mới</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Họ</label>
                    <input
                        type="text"
                        name="ho"
                        value={formData.ho}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nhập họ"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Tên</label>
                    <input
                        type="text"
                        name="ten"
                        value={formData.ten}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nhập tên"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Giới Tính</label>
                    <select
                        name="gioiTinh"
                        value={formData.gioiTinh}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Địa Chỉ</label>
                    <input
                        type="text"
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nhập địa chỉ"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Số Điện Thoại</label>
                    <input
                        type="tel"
                        name="sdt"
                        value={formData.sdt}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nhập email"
                    />
                </div>

                <div className="button-group">
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Thêm Khách Hàng
                    </button>
                    <button
                        type="button"
                        className="close-button"
                        onClick={handleCloseModal}
                    >
                        Đóng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ThemKhachHangMoi;
