import React, { useState, useEffect } from 'react';
import { DuLieu, XoaDichVu } from '../../services/DichVuService';
import FormAdd from './FormAdd';
import FormUpdate from './FormUpdate';
import DetailDichVu from './DetailDichVu';

const DanhSach = () => {
    const [dichVuList, setDichVuList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVu, setCurrentDichVu] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(''); // Tìm kiếm
    const [filterStatus, setFilterStatus] = useState(''); // Lọc trạng thái
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const itemsPerPage = 5; // Số lượng item trên mỗi trang

    const loadDichVu = () => {
        DuLieu()
            .then(response => {
                const filteredData = response.data.filter(dv => {
                    // Lọc theo trạng thái boolean
                    const matchesStatus = filterStatus !== ''
                        ? dv.trangThai === (filterStatus === 'true')
                        : true;

                    const matchesKeyword = searchKeyword
                        ? dv.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        dv.moTa.toLowerCase().includes(searchKeyword.toLowerCase())
                        : true;

                    return matchesStatus && matchesKeyword;
                });

                // Phân trang dữ liệu
                const startIndex = currentPage * itemsPerPage;
                const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
                setDichVuList(paginatedData);
                setTotalPages(Math.ceil(filteredData.length / itemsPerPage)); // Cập nhật tổng số trang
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ:", error);
            });
    };

    useEffect(() => {
        loadDichVu();
    }, [searchKeyword, filterStatus, currentPage]); // Tự động tải lại khi từ khóa, trạng thái hoặc trang thay đổi

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

    const openUpdateForm = (dv) => {
        setCurrentDichVu(dv);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setCurrentDichVu(null);
    };

    const openDetail = (dv) => {
        setCurrentDichVu(dv);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setCurrentDichVu(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
            XoaDichVu(id)
                .then(() => {
                    loadDichVu();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa dịch vụ:", error);
                });
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
            <div>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mô tả"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="true">Hoạt động</option>
                    <option value="false">Ngừng hoạt động</option>
                </select>
                <button onClick={loadDichVu}>Lọc</button>
            </div> <br />

            <button onClick={openForm}>Thêm Dịch Vụ</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Tên Dịch Vụ</th>
                        <th>Giá</th>
                        <th>Mô Tả</th>
                        <th>Hình ảnh</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {dichVuList.map((dv) => (
                        <tr key={dv.id}>
                            <td>{dv.tenDichVu}</td>
                            <td>{dv.donGia}</td>
                            <td>{dv.moTa}</td>
                            <td>
                                <img src={dv.hinhAnh} alt={dv.tenDichVu} style={{ width: '200px', height: 'auto' }} />
                            </td>

                            {/* Hiển thị trạng thái dưới dạng chuỗi dựa trên giá trị boolean */}
                            <td>{dv.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</td>
                            <td>
                                <button onClick={() => openUpdateForm(dv)}>Sửa</button>
                                <button onClick={() => handleDelete(dv.id)}>Xóa</button>
                                <button onClick={() => openDetail(dv)}>Chi Tiết</button>
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

            {showForm && <FormAdd show={showForm} handleClose={closeForm} refreshData={loadDichVu} />}
            {showUpdateForm && <FormUpdate show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVu} dichVu={currentDichVu} />}
            {showDetail && <DetailDichVu dichVu={currentDichVu} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSach;
