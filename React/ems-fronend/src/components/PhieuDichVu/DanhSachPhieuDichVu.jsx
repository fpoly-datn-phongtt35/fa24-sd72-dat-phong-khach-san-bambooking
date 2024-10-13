import React, { useState, useEffect } from 'react';
import { DuLieuPhieuDichVu, XoaPhieuDichVu } from '../../services/PhieuDichVuService';
import FormAddPhieuDichVu from './FormAddPhieuDichVu';
import FormUpdatePhieuDichVu from './FormUpdatePhieuDichVu';
import DetailPhieuDichVu from './DetailPhieuDichVu';

const DanhSachPhieuDichVu = () => {
    const [phieuDichVuList, setPhieuDichVuList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentPhieuDichVu, setCurrentPhieuDichVu] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(''); // Tìm kiếm
    const [filterStatus, setFilterStatus] = useState(''); // Lọc trạng thái

    const loadPhieuDichVu = () => {
        DuLieuPhieuDichVu()
            .then(response => {
                const filteredData = response.data.filter(phieu => {
                    const matchesKeyword = searchKeyword
                        ? phieu.dichVu.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase())
                        : true;
                    const matchesStatus = filterStatus
                        ? phieu.trangThai === filterStatus
                        : true;
                    return matchesKeyword && matchesStatus;
                });
                setPhieuDichVuList(filteredData);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách phiếu dịch vụ:", error);
            });
    };

    useEffect(() => {
        loadPhieuDichVu();
    }, [searchKeyword, filterStatus]); // Khi searchKeyword hoặc filterStatus thay đổi, gọi lại loadPhieuDichVu

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const openUpdateForm = (phieuDichVu) => { setCurrentPhieuDichVu(phieuDichVu); setShowUpdateForm(true); };
    const closeUpdateForm = () => { setShowUpdateForm(false); setCurrentPhieuDichVu(null); };
    const openDetail = (phieuDichVu) => { setCurrentPhieuDichVu(phieuDichVu); setShowDetail(true); };
    const closeDetail = () => { setShowDetail(false); setCurrentPhieuDichVu(null); };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phiếu dịch vụ này?")) {
            XoaPhieuDichVu(id)
                .then(() => loadPhieuDichVu())
                .catch(error => console.error("Lỗi khi xóa phiếu dịch vụ:", error));
        }
    };

    return (
        <div>
            <h1>Danh Sách Phiếu Dịch Vụ</h1>

            {/* Tìm kiếm và lọc trạng thái */}
            <div>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên dịch vụ"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
            </div>

            <button onClick={openForm}>Thêm Phiếu Dịch Vụ</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Tên Dịch Vụ</th>
                        <th>Id thông tin đặt phòng</th>
                        <th>Số Lượng Sử Dụng</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Giá Sử Dụng</th>
                        <th>Thành Tiền</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {phieuDichVuList.map((phieu) => (
                        <tr key={phieu.id}>
                            <td>{phieu.dichVu.tenDichVu}</td>
                            <td>{phieu.thongTinDatPhong.id}</td>
                            <td>{phieu.soLuongSuDung}</td>
                            <td>{new Date(phieu.ngayBatDau).toLocaleDateString()}</td>
                            <td>{new Date(phieu.ngayKetThuc).toLocaleDateString()}</td>
                            <td>{phieu.giaSuDung}</td>
                            <td>{phieu.thanhTien}</td>
                            <td>{phieu.trangThai}</td>
                            <td>
                                <button onClick={() => openUpdateForm(phieu)}>Sửa</button>
                                <button onClick={() => handleDelete(phieu.id)}>Xóa</button>
                                <button onClick={() => openDetail(phieu)}>Chi Tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && <FormAddPhieuDichVu show={showForm} handleClose={closeForm} refreshData={loadPhieuDichVu} />}
            {showUpdateForm && <FormUpdatePhieuDichVu show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadPhieuDichVu} phieuDichVu={currentPhieuDichVu} />}
            {showDetail && <DetailPhieuDichVu phieuDichVu={currentPhieuDichVu} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSachPhieuDichVu;
