import React, { useState, useEffect } from 'react';
import { DuLieuDichVuSuDung, XoaDichVuSuDung } from '../../services/DichVuSuDungService';
import FormAddDichVuSuDung from './FormAddDichVuSuDung';
import FormUpdateDichVuSuDung from './FormUpdateDichVuSuDung';
import DetailDichVuSuDung from './DetailDichVuSuDung';

const DanhSachDichVuSuDung = () => {
    const [dichVuSuDungList, setDichVuSuDungList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVuSuDung, setCurrentDichVuSuDung] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    const loadDichVuSuDung = () => {
        DuLieuDichVuSuDung()
            .then(response => {
                if (response && response.data) {
                    const filteredData = response.data.filter(dichVu => {
                        const matchesKeyword = searchKeyword
                            ? dichVu.dichVu.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase())
                            : true;
                        const matchesStatus = filterStatus
                            ? (filterStatus === 'Hoạt động' ? dichVu.trangThai : !dichVu.trangThai)
                            : true;
                        return matchesKeyword && matchesStatus;
                    });

                    const startIndex = currentPage * itemsPerPage;
                    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
                    setDichVuSuDungList(paginatedData);
                    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
                } else {
                    setDichVuSuDungList([]);
                    setTotalPages(0);
                }
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ sử dụng:", error);
            });
    };

    useEffect(() => {
        loadDichVuSuDung();
    }, [searchKeyword, filterStatus, currentPage]);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const openUpdateForm = (dichVuSuDung) => { setCurrentDichVuSuDung(dichVuSuDung); setShowUpdateForm(true); };
    const closeUpdateForm = () => { setShowUpdateForm(false); setCurrentDichVuSuDung(null); };
    const openDetail = (dichVuSuDung) => { setCurrentDichVuSuDung(dichVuSuDung); setShowDetail(true); };
    const closeDetail = () => { setShowDetail(false); setCurrentDichVuSuDung(null); };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ sử dụng này?")) {
            XoaDichVuSuDung(id)
                .then(() => loadDichVuSuDung())
                .catch(error => console.error("Lỗi khi xóa dịch vụ sử dụng:", error));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h1>Danh Sách Dịch Vụ Sử Dụng</h1>

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

            <button onClick={openForm}>Thêm Dịch Vụ Sử Dụng</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Tên Dịch Vụ</th>
                        <th>Id xếp phòng</th>
                        <th>Số Lượng Sử Dụng</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Giá Sử Dụng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {dichVuSuDungList.map((dichVu) => (
                        <tr key={dichVu.id}>
                            <td>{dichVu.dichVu.tenDichVu}</td>
                            <td>{dichVu.xepPhong.id}</td>
                            <td>{dichVu.soLuongSuDung}</td>
                            <td>{new Date(dichVu.ngayBatDau).toLocaleDateString()}</td>
                            <td>{new Date(dichVu.ngayKetThuc).toLocaleDateString()}</td>
                            <td>{dichVu.giaSuDung}</td>
                            <td>{dichVu.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</td>
                            <td>
                                <button onClick={() => openUpdateForm(dichVu)}>Sửa</button>
                                <button onClick={() => handleDelete(dichVu.id)}>Xóa</button>
                                <button onClick={() => openDetail(dichVu)}>Chi Tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>Trang trước</button>
                <span>Trang {currentPage + 1} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Trang sau</button>
            </div>

            {showForm && <FormAddDichVuSuDung show={showForm} handleClose={closeForm} refreshData={loadDichVuSuDung} />}
            {showUpdateForm && <FormUpdateDichVuSuDung show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVuSuDung} dichVuSuDung={currentDichVuSuDung} />}
            {showDetail && <DetailDichVuSuDung dichVuSuDung={currentDichVuSuDung} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSachDichVuSuDung;
