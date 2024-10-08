import React, { useState, useEffect } from 'react';
import { CapNhatDichVuDiKem, DanhSachDichVu, DanhSachLoaiPhong } from '../../services/DichVuDiKemService';

const FormUpdateDichVuDiKem = ({ show, handleClose, refreshData, dichVuDiKem }) => {
    const [dichVu, setDichVu] = useState('');
    const [loaiPhong, setLoaiPhong] = useState('');
    const [trangThai, setTrangThai] = useState('');

    const [dichVuList, setDichVuList] = useState([]);
    const [loaiPhongList, setLoaiPhongList] = useState([]);

    useEffect(() => {
        // Lấy danh sách dịch vụ
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        // Lấy danh sách loại phòng
        DanhSachLoaiPhong()
            .then(response => {
                setLoaiPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách loại phòng:", error);
            });

        // Cập nhật giá trị hiện tại từ dịch vụ đi kèm được truyền vào
        if (dichVuDiKem) {
            setDichVu(dichVuDiKem.dichVu?.id || '');
            setLoaiPhong(dichVuDiKem.loaiPhong?.id || '');
            setTrangThai(dichVuDiKem.trangThai || '');
        }
    }, [dichVuDiKem]);

    const handleUpdate = (e) => {
        e.preventDefault();
    
        // Tạo đối tượng cập nhật theo định dạng yêu cầu
        const updatedDichVuDiKem = {
            id: dichVuDiKem.id,
            dichVu: {
                id: dichVu // Lấy id dịch vụ từ state
            },
            loaiPhong: {
                id: loaiPhong // Lấy id loại phòng từ state
            },
            trangThai: trangThai, // Trạng thái từ state
        };
    
        console.log('Dữ liệu gửi đi:', updatedDichVuDiKem);
    
        // Gọi service cập nhật
        CapNhatDichVuDiKem(updatedDichVuDiKem)
            .then((response) => {
                console.log("Cập nhật thành công:", response.data);
                refreshData();  // Làm mới dữ liệu sau khi cập nhật
                handleClose();  // Đóng form
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
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Dịch Vụ:</label>
                        <select
                            value={dichVu}
                            onChange={(e) => setDichVu(e.target.value)}
                            required
                        >
                            <option value="">Chọn dịch vụ</option>
                            {dichVuList.map(dichVu => (
                                <option key={dichVu.id} value={dichVu.id}>
                                    {dichVu.tenDichVu}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Loại Phòng:</label>
                        <select
                            value={loaiPhong}
                            onChange={(e) => setLoaiPhong(e.target.value)}
                            required
                        >
                            <option value="">Chọn loại phòng</option>
                            {loaiPhongList.map(loaiPhong => (
                                <option key={loaiPhong.id} value={loaiPhong.id}>
                                    {loaiPhong.tenLoaiPhong}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Trạng Thái:</label>
                        <select
                            value={trangThai}
                            onChange={(e) => setTrangThai(e.target.value)} 
                            required
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                        </select>
                    </div>
                    <button type="submit">Cập Nhật</button>
                    <button type="button" onClick={handleClose}>Đóng</button>
                </form>
            </div>
        </div>
    );
};

export default FormUpdateDichVuDiKem;
