import React, { useState, useEffect } from 'react';
import { addTienIchPhong , DSTienIch, DSLoaiPhong } from '../../services/TienIchPhongService';

const FormAdd = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        tienIch: null,  
        loaiPhong: null,
    });

    const [ListLoaiPhong, setListLoaiPhong] = useState([]); // State để lưu danh sách nhân viên
    const [ListTienIch, setListTienIch] = useState([]); // State để lưu danh sách khách hàng

    // Lấy danh sách nhân viên và khách hàng khi component render
    useEffect(() => {
        // Gọi API để lấy danh sách nhân viên
        DSTienIch()
            .then(response => {
                setListTienIch(response.data); // Lưu danh sách nhân viên vào state
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            });

        // Gọi API để lấy danh sách khách hàng
        DSLoaiPhong()
            .then(response => {
                setListLoaiPhong(response.data); // Lưu danh sách khách hàng vào state
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách khách hàng:", error);
            });
    }, []); // Chỉ chạy một lần khi component render lần đầu

    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm xử lý khi chọn nhân viên
    const handleTienIchChange = (e) => {
        const selectedTienIch = ListTienIch.find(nv => nv.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            tienIch: selectedTienIch // Lưu toàn bộ đối tượng nhân viên
        });
    };

    // Hàm xử lý khi chọn khách hàng
    const handleLoaiPhongChange = (e) => {
        const selectedLoaiPhong = ListLoaiPhong.find(kh => kh.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            loaiPhong: selectedLoaiPhong // Lưu toàn bộ đối tượng khách hàng
        });
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API thêm mới đặt phòng với đối tượng khách hàng và nhân viên
        addTienIchPhong(formData)
            .then(response => {
                console.log("Thêm mới thành công:", response.data);
                handleClose(); // Đóng modal sau khi thêm thành công
            })
            .catch(error => {
                console.error("Lỗi khi thêm mới:", error);
            });
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document"> {/* Sử dụng lớp modal-lg để tăng chiều ngang */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm tiện ích</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                           

                            {/* Tiện ích */}
                            <div className="mb-3">
                                <label htmlFor="nhanVien" className="form-label">Tiện ích</label>
                                <select className="form-select" id="tienIch" name="tienIch" value={formData.tienIch?.id || ''} onChange={handleTienIchChange} required>
                                    <option value="">Chọn tiện ích</option>
                                    {ListTienIch.map(nv => (
                                        <option key={nv.id} value={nv.id}>{nv.tenTienIch}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Loại phòng */}
                            <div className="mb-3">
                                <label htmlFor="khachHang" className="form-label">Loại phòng</label>
                                <select className="form-select" id="loaiPhong" name="loaiPhong" value={formData.loaiPhong?.id || ''} onChange={handleLoaiPhongChange} required>
                                    <option value="">Chọn loại phòng</option>
                                    {ListLoaiPhong.map(kh => (
                                        <option key={kh.id} value={kh.id}>{kh.tenLoaiPhong}</option>
                                    ))}
                                </select>
                            </div>        

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAdd;
