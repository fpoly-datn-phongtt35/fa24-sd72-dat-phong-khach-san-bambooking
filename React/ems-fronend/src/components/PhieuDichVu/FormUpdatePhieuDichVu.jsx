import React, { useState, useEffect } from 'react';
import { CapNhatPhieuDichVu, DanhSachDichVu, DanhSachThongTinDatPhong } from '../../services/PhieuDichVuService';

const FormUpdatePhieuDichVu = ({ show, handleClose, refreshData, phieuDichVu }) => {
    const [dichVu, setDichVu] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [giaSuDung, setGiaSuDung] = useState('');
    const [thanhTien, setThanhTien] = useState('');
    const [trangThai, setTrangThai] = useState('');
    const [thongTinDatPhong, setThongTinDatPhong] = useState('');
    const [soLuongSuDung, setSoLuongSuDung] = useState(''); // Thêm state cho số lượng sử dụng

    const [dichVuList, setDichVuList] = useState([]);
    const [thongTinDatPhongList, setThongTinDatPhongList] = useState([]);

    useEffect(() => {
        // Lấy danh sách dịch vụ
        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            });

        // Lấy danh sách thông tin đặt phòng
        DanhSachThongTinDatPhong()
            .then(response => {
                setThongTinDatPhongList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách thông tin đặt phòng:", error);
            });

        // Cập nhật giá trị hiện tại từ phiếu dịch vụ được truyền vào
        if (phieuDichVu) {
            setDichVu(phieuDichVu.dichVu?.id || '');
            setNgayBatDau(phieuDichVu.ngayBatDau ? new Date(phieuDichVu.ngayBatDau).toISOString().slice(0, 10) : '');
            setNgayKetThuc(phieuDichVu.ngayKetThuc ? new Date(phieuDichVu.ngayKetThuc).toISOString().slice(0, 10) : '');
            setGiaSuDung(phieuDichVu.giaSuDung || '');
            setThanhTien(phieuDichVu.thanhTien || '');
            setTrangThai(phieuDichVu.trangThai || '');
            setThongTinDatPhong(phieuDichVu.thongTinDatPhong?.id || '');
            setSoLuongSuDung(phieuDichVu.soLuongSuDung || ''); // Lấy số lượng sử dụng
        }
    }, [phieuDichVu]);

    const handleUpdate = (e) => {
        e.preventDefault();

        // Tạo đối tượng cập nhật theo định dạng yêu cầu
        const updatedPhieuDichVu = {
            id: phieuDichVu.id,
            dichVu: {
                id: dichVu
            },
            thongTinDatPhong: {
                id: thongTinDatPhong // Gửi id của thông tin đặt phòng
            },
            ngayBatDau: `${ngayBatDau}T00:00:00`, // Gửi ngày bắt đầu
            ngayKetThuc: `${ngayKetThuc}T00:00:00`,
            giaSuDung,
            thanhTien,
            trangThai,
            soLuongSuDung, // Gửi số lượng sử dụng
        };

        console.log('Dữ liệu gửi đi:', updatedPhieuDichVu);

        // Gọi service cập nhật
        CapNhatPhieuDichVu(updatedPhieuDichVu)
            .then((response) => {
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
                        <label>Thông Tin Đặt Phòng:</label>
                        <select
                            value={thongTinDatPhong}
                            onChange={(e) => setThongTinDatPhong(e.target.value)}
                            required
                        >
                            <option value="">Chọn thông tin đặt phòng</option>
                            {thongTinDatPhongList.map(thongTin => (
                                <option key={thongTin.id} value={thongTin.id}>
                                    {thongTin.id} {/* Thay đổi tên hiển thị theo thuộc tính phù hợp */}
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
                        <label>Thành Tiền:</label>
                        <input
                            type="number"
                            value={thanhTien}
                            onChange={(e) => setThanhTien(e.target.value)}
                            
                        />
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

export default FormUpdatePhieuDichVu;
