import React, { useState, useEffect } from 'react';
import { createHoaDon, DanhSachNhanVien, DanhSachDatPhong } from '../../services/HoaDonService';
import './DetailHD.css'; // Nhớ import stylesheet để tạo kiểu cho form

const FormAddHoaDon = ({ handleClose }) => {
    const [newHoaDon, setNewHoaDon] = useState({
        maHoaDon: '',
        nhanVien: null,  // Thay 'nhanVien' thành id nhân viên
        datPhong: null,  // Thay 'datPhong' thành id đặt phòng
        tongTien: 0,
        trangThai: 'Chưa thanh toán',
    });

    const [nhanVienList, setNhanVienList] = useState([]);
    const [datPhongList, setDatPhongList] = useState([]);

    useEffect(() => {
        DanhSachNhanVien()
            .then((response) => {
                setNhanVienList(response.data);
            })
            .catch((error) => {
                console.log('Lỗi khi lấy danh sách nhân viên:', error);
                alert('Không thể lấy danh sách nhân viên');
            });

        DanhSachDatPhong()
            .then((response) => {
                setDatPhongList(response.data);
            })
            .catch((error) => {
                console.log('Lỗi khi lấy danh sách đặt phòng:', error);
                alert('Không thể lấy danh sách đặt phòng');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewHoaDon((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNhanVienChange = (e) => {
        const selectedNhanVienId = e.target.value;
        setNewHoaDon({
            ...newHoaDon,
            nhanVien: selectedNhanVienId  // Chỉ cập nhật id nhân viên
        });
    };

    const handleDatPhongChange = (e) => {
        const selectedDatPhongId = e.target.value;
        setNewHoaDon({
            ...newHoaDon,
            datPhong: selectedDatPhongId  // Chỉ cập nhật id đặt phòng
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        if (!newHoaDon.nhanVien || !newHoaDon.datPhong) {
            alert("Vui lòng chọn nhân viên và đặt phòng!");
            return;
        }

        // Xây dựng dữ liệu gửi lên API
        const dataToSend = {
            maHoaDon: newHoaDon.maHoaDon,
            nhanVien: { id: newHoaDon.nhanVien }, // Đảm bảo gửi id nhân viên
            datPhong: { id: newHoaDon.datPhong }, // Đảm bảo gửi id đặt phòng
            tongTien: newHoaDon.tongTien,
            trangThai: newHoaDon.trangThai
        };

        // Kiểm tra lại dữ liệu gửi lên API
        console.log("Dữ liệu gửi lên API:", dataToSend);

        // Gửi request lên API
        createHoaDon(dataToSend)
            .then(() => {
                // Reset form sau khi thành công
                setNewHoaDon({
                    maHoaDon: '',
                    nhanVien: null,
                    datPhong: null,
                    tongTien: 0,
                    trangThai: 'Chưa thanh toán',
                });

                handleClose();  // Đóng form thêm hóa đơn
                alert('Hóa đơn đã được thêm thành công!');
            })
            .catch((error) => {
                console.log('Lỗi khi thêm hóa đơn:', error);
                alert('Lỗi khi thêm hóa đơn!');
            });
    };


    return (
        <div className="modal_hd" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="detail_hd_modal-dialog">
                <div className="modal-content-hd">
                    <div className="modal-header-hd">
                        <h5 className="modal-title-hd">Thêm Hóa Đơn</h5>
                        <button type="button" className="detail_hd_close-button" onClick={handleClose}>×</button>
                    </div>
                    <div className="modal-body-hd">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row-hd">
                                <div className="form-column-hd">
                                    <div className="form-group-hd">
                                        <label><strong>Mã hóa đơn:</strong></label>
                                        <input
                                            type="text"
                                            name="maHoaDon"
                                            value={newHoaDon.maHoaDon}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <select
                                        className="form-select"
                                        id="nhanVien"
                                        name="nhanVien"
                                        value={newHoaDon.nhanVien?.id} 
                                        onChange={handleNhanVienChange}
                                        required
                                    >
                                        <option value="">Chọn nhân viên</option>
                                        {nhanVienList.map((nv) => (
                                            <option key={nv.id} value={nv.id}>
                                                {nv.hoTenNhanVien}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="mb-3">
                                        <label htmlFor="maDatPhong" className="form-label"><strong>Mã đặt phòng:</strong></label>
                                        <select
                                            className="form-select"
                                            id="datPhong"
                                            name="datPhong"
                                            value={newHoaDon.datPhong?.id}
                                            onChange={handleDatPhongChange}
                                            required
                                        >
                                            <option value="">Chọn mã đặt phòng</option>
                                            {datPhongList.map((dp) => (
                                                <option key={dp.id} value={dp.id}>
                                                    {dp.maDatPhong}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-column-hd">
                                    <div className="form-group-hd">
                                        <label><strong>Tổng tiền:</strong></label>
                                        <input
                                            type="number"
                                            name="tongTien"
                                            value={newHoaDon.tongTien}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-hd">
                                        <label><strong>Trạng thái:</strong></label>
                                        <select
                                            name="trangThai"
                                            value={newHoaDon.trangThai}
                                            onChange={handleChange}
                                        >
                                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                                            <option value="Đã thanh toán">Đã thanh toán</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAddHoaDon;

