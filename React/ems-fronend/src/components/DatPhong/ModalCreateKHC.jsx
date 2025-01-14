import React, { useState } from 'react';
import './ModalCreateKHC.scss';
import { ThemKhachHangDatPhong } from '../../services/DatPhong';
import { them } from '../../services/KhachHangCheckin';
import { useNavigate } from 'react-router-dom';
const ModalCreateKHC = ({ isOpen, onClose, thongTinDatPhong }) => { 
    const navigate = useNavigate();
    const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        gioiTinh: '',
        diaChi: '',
        sdt: '',
        email: '',
        trangThai: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleCreate = async (e) =>{
        e.preventDefault(); 
        const khachHangRequest = {
            ho: formData.ho,
            ten: formData.ten,
            gioiTinh: formData.gioiTinh,
            diaChi: formData.diaChi,
            sdt: formData.sdt,
            email: formData.email,
            trangThai: formData.trangThai
        };
        // try {
        //     const response = await ThemKhachHangDatPhong(khachHangRequest);
        //     console.log('API ThemKhachHangDatPhong response:', response);
        // } catch (e) {
        //     console.error('Lỗi khi gọi ThemKhachHangDatPhong:', e);
        // }
        try{
            const response = await ThemKhachHangDatPhong(khachHangRequest); 
            if(response!=null){
                const KHCRequest = {
                    khachHang : response.data,
                    thongTinDatPhong: thongTinDatPhong,
                    trangThai: true
                }
                const response2 = await them(KHCRequest);
                console.log(response2);
                navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
            } 
        }catch(e){
            console.log(e);
            console.log('Lỗi khi thêm khách hàng')
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>Thêm Khách Hàng</h3>
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form className="modal-body" >
                    <div className="form-group">
                        <label>Họ:</label>
                        <input
                            type="text"
                            name="ho"
                            value={formData.ho}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tên:</label>
                        <input
                            type="text"
                            name="ten"
                            value={formData.ten}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Giới Tính:</label>
                        <select
                            name="gioiTinh"
                            value={formData.gioiTinh}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn --</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Địa Chỉ:</label>
                        <input
                            type="text"
                            name="diaChi"
                            value={formData.diaChi}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>SĐT:</label>
                        <input
                            type="text"
                            name="sdt"
                            value={formData.sdt}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật Khẩu:</label>
                        <input
                            type="password"
                            name="matKhau"
                            value={formData.matKhau}
                            onChange={handleChange}
                            required
                        />
                    </div> 
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                        <button onClick={handleCreate} className="save-btn">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreateKHC;
