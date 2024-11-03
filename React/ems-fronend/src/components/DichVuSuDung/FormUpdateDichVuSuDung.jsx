import React, { useState, useEffect } from 'react';
import { CapNhatDichVuSuDung, DanhSachDichVu, DanhSachXepPhong } from '../../services/DichVuSuDungService';

const FormUpdateDichVuSuDung = ({ show, handleClose, refreshData, dichVuSuDung }) => {
    const [dichVu, setDichVu] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [giaSuDung, setGiaSuDung] = useState('');
    const [thanhTien, setThanhTien] = useState('');
    const [trangThai, setTrangThai] = useState(false); // Đặt trạng thái mặc định là boolean
    const [xepPhong, setXepPhong] = useState('');
    const [soLuongSuDung, setSoLuongSuDung] = useState('');

    const [dichVuList, setDichVuList] = useState([]);
    const [xepPhongList, setXepPhongList] = useState([]);

    useEffect(() => {
        // Fetching service and room allocation data
        DanhSachDichVu()
            .then(response => setDichVuList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách dịch vụ:", error));

        DanhSachXepPhong()
            .then(response => setXepPhongList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách xếp phòng:", error));

        // Updating state with the current service ticket details
        if (dichVuSuDung) {
            setDichVu(dichVuSuDung.dichVu?.id || '');
            setNgayBatDau(dichVuSuDung.ngayBatDau ? new Date(dichVuSuDung.ngayBatDau).toISOString().slice(0, 10) : '');
            setNgayKetThuc(dichVuSuDung.ngayKetThuc ? new Date(dichVuSuDung.ngayKetThuc).toISOString().slice(0, 10) : '');
            setGiaSuDung(dichVuSuDung.giaSuDung || '');
            setTrangThai(dichVuSuDung.trangThai === true); // Cập nhật trạng thái từ boolean
            setXepPhong(dichVuSuDung.xepPhong?.id || '');
            setSoLuongSuDung(dichVuSuDung.soLuongSuDung || '');
        }
    }, [dichVuSuDung]);

    const handleUpdate = (e) => {
        e.preventDefault();

        // Creating update object
        const updatedDichVuSuDung = {
            id: dichVuSuDung.id,
            dichVu: { id: dichVu },
            xepPhong: { id: xepPhong },
            ngayBatDau: `${ngayBatDau}T00:00:00`,
            ngayKetThuc: `${ngayKetThuc}T00:00:00`,
            giaSuDung,
            trangThai, // Gửi giá trị boolean
            soLuongSuDung,
        };

        console.log('Dữ liệu gửi đi:', updatedDichVuSuDung);

        // Calling the update service
        CapNhatDichVuSuDung(updatedDichVuSuDung)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                refreshData();
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật phiếu dịch vụ:", error);
            });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Cập Nhật Phiếu Dịch Vụ</h2>
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
                        <label>Xếp Phòng:</label>
                        <select
                            value={xepPhong}
                            onChange={(e) => setXepPhong(e.target.value)}
                            required
                        >
                            <option value="">Chọn xếp phòng</option>
                            {xepPhongList.map(xepPhong => (
                                <option key={xepPhong.id} value={xepPhong.id}>
                                    {xepPhong.id} {/* Hiển thị id hoặc thuộc tính khác nếu cần */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Ngày Bắt Đầu:</label>
                        <input
                            type="date"
                            value={ngayBatDau}
                            onChange={(e) => setNgayBatDau(e.target.value)}
                            required disabled
                        />
                    </div>
                    <div>
                        <label>Ngày Kết Thúc:</label>
                        <input
                            type="date"
                            value={ngayKetThuc}
                            onChange={(e) => setNgayKetThuc(e.target.value)}
                            required disabled
                        />
                    </div>
                    <div>
                        <label>Số Lượng Sử Dụng:</label>
                        <input
                            type="number"
                            value={soLuongSuDung}
                            onChange={(e) => setSoLuongSuDung(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Giá Sử Dụng:</label>
                        <input
                            type="number"
                            value={giaSuDung}
                            onChange={(e) => setGiaSuDung(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Trạng Thái:</label>
                        <select
                            value={trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}
                            onChange={(e) => setTrangThai(e.target.value === 'Hoạt động')}
                            required
                        >
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

export default FormUpdateDichVuSuDung;
