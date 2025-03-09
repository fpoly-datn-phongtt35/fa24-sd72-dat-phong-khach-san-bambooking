import React, { useState, useEffect } from 'react';
import { DuLieu, XoaDichVu } from '../../services/DichVuService';
import FormAdd from './FormAdd';
import FormUpdate from './FormUpdate';
import DetailDichVu from './DetailDichVu';
import Swal from 'sweetalert2'; // down npm install sweetalert2

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
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Màu nút xác nhận
            cancelButtonColor: '#3085d6', // Màu nút hủy
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                XoaDichVu(id)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Dịch vụ đã được xóa thành công.',
                            confirmButtonColor: '#6a5acd' // Màu nút OK
                        });
                        loadDichVu();
                    })
                    .catch(error => {
                        console.error("Lỗi khi xóa dịch vụ:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể xóa dịch vụ. Vui lòng thử lại!',
                            confirmButtonColor: '#d33'
                        });
                    });
            }
        });
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
        <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button className='btn btn-outline-success btn-lg fs-6' onClick={openForm}>
                            <i className='bi bi-plus-circle'></i> Thêm Dịch Vụ
                        </button>
                        <div className='d-flex w-50'>
                            <input
                                type='text'
                                className='form-control form-control-lg fs-6 me-2'
                                placeholder='Tìm kiếm theo tên hoặc mô tả...'
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <select className='form-select form-select-lg fs-6' value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value=''>Tất cả trạng thái</option>
                                <option value='true'>Hoạt động</option>
                                <option value='false'>Ngừng hoạt động</option>
                            </select>
                            <button className='btn btn-outline-primary btn-lg ms-2' onClick={loadDichVu}>Lọc</button>
                        </div>
                    </div>

                    <table className='table table-hover'>
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
                            {dichVuList.length > 0 ? (
                                dichVuList.map((dv) => (
                                    <tr key={dv.id}>
                                        <td>{dv.tenDichVu}</td>
                                        <td>{dv.donGia}</td>
                                        <td>{dv.moTa}</td>
                                        <td>
                                            <img src={dv.hinhAnh} alt={dv.tenDichVu} style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{dv.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</td>
                                        <td>
                                            <button className='btn btn-outline-warning me-2' onClick={() => openUpdateForm(dv)}>Sửa</button>
                                            <button className='btn btn-outline-danger me-2' onClick={() => handleDelete(dv.id)}>Xóa</button>
                                            {/* <button className='btn btn-outline-info' onClick={() => openDetail(dv)}>Chi Tiết</button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='6' className='text-center'>Không có dịch vụ</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    <div className='d-flex justify-content-center my-3'>
                        <button
                            className='btn btn-outline-primary me-2'
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}>
                            Previous
                        </button>
                        <span className='align-self-center' style={{ marginTop: '7px' }}>
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            className='btn btn-outline-primary ms-2'
                            onClick={handleNextPage}
                            disabled={currentPage + 1 >= totalPages}>
                            Next
                        </button>
                    </div>

                    {showForm && <FormAdd show={showForm} handleClose={closeForm} refreshData={loadDichVu} />}
                    {showUpdateForm && <FormUpdate show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVu} dichVu={currentDichVu} />}
                    {/* {showDetail && <DetailDichVu dichVu={currentDichVu} handleClose={closeDetail} />} */}
                </div>
            </div>
        </div>
    );
};

export default DanhSach;
