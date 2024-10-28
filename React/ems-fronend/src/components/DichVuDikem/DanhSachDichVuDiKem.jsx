import React, { useState, useEffect } from 'react';
import { LayDanhSachDichVuDiKem, XoaDichVuDiKem } from '../../services/DichVuDiKemService';
import FormAddDichVuDiKem from './FormAddDichVuDiKem';
import FormUpdateDichVuDiKem from './FormUpdateDichVuDiKem';
import DetailDichVuDiKem from './DetailDichVuDiKem';

const DanhSachDichVuDiKem = () => {
    const [dichVuDiKemList, setDichVuDiKemList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVuDiKem, setCurrentDichVuDiKem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // Lọc trạng thái
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    const loadDichVuDiKem = () => {
        LayDanhSachDichVuDiKem()
            .then(response => {
                if (response && response.data) {
                    const filteredData = response.data.filter(dvDiKem => {
                        const matchesKeyword = searchKeyword
                            ? (dvDiKem.dichVu?.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                dvDiKem.loaiPhong?.tenLoaiPhong.toLowerCase().includes(searchKeyword.toLowerCase()))
                            : true;

                        const matchesStatus = filterStatus
                            ? (filterStatus === 'Hoạt động' ? dvDiKem.trangThai : !dvDiKem.trangThai) // Kiểm tra trạng thái tương ứng
                            : true;

                        return matchesKeyword && matchesStatus;
                    });

                    // Phân trang dữ liệu
                    const startIndex = currentPage * itemsPerPage;
                    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
                    setDichVuDiKemList(paginatedData);
                    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
                } else {
                    setDichVuDiKemList([]);
                    setTotalPages(0);
                }
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ đi kèm:", error);
            });
    };

    useEffect(() => {
        loadDichVuDiKem();
    }, [searchKeyword, filterStatus, currentPage]);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const openUpdateForm = (dvDiKem) => { setCurrentDichVuDiKem(dvDiKem); setShowUpdateForm(true); };
    const closeUpdateForm = () => { setShowUpdateForm(false); setCurrentDichVuDiKem(null); };
    const openDetail = (dvDiKem) => { setCurrentDichVuDiKem(dvDiKem); setShowDetail(true); };
    const closeDetail = () => { setShowDetail(false); setCurrentDichVuDiKem(null); };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ đi kèm này?")) {
            XoaDichVuDiKem(id)
                .then(() => loadDichVuDiKem())
                .catch(error => console.error("Lỗi khi xóa dịch vụ đi kèm:", error));
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
            <h1>Danh Sách Dịch Vụ Đi Kèm</h1>
            <div>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên dịch vụ hoặc loại phòng"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
            </div><br />

            <button onClick={openForm}>Thêm Dịch Vụ Đi Kèm</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Tên Dịch Vụ</th>
                        <th>Tên Loại Phòng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {dichVuDiKemList.map((dvDiKem) => (
                        <tr key={dvDiKem.id}>
                            <td>{dvDiKem.dichVu?.tenDichVu}</td>
                            <td>{dvDiKem.loaiPhong?.tenLoaiPhong}</td>
                            <td>{dvDiKem.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</td>
                            <td>
                                <button onClick={() => openUpdateForm(dvDiKem)}>Sửa</button>
                                <button onClick={() => handleDelete(dvDiKem.id)}>Xóa</button>
                                <button onClick={() => openDetail(dvDiKem)}>Chi Tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>Trang trước</button>
                <span>Trang {currentPage + 1} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Trang sau</button>
            </div>

            {showForm && <FormAddDichVuDiKem show={showForm} handleClose={closeForm} refreshData={loadDichVuDiKem} />}
            {showUpdateForm && <FormUpdateDichVuDiKem show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVuDiKem} dichVuDiKem={currentDichVuDiKem} />}
            {showDetail && <DetailDichVuDiKem dichVuDiKem={currentDichVuDiKem} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSachDichVuDiKem;
