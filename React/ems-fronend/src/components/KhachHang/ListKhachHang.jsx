import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listKhachHang, deleteKhachHang } from '../../services/KhachHangService';

const ListKhachHang = () => {
    const navigate = useNavigate();
    const [khachHangList, setKhachHangList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;

    const getAllKhachHang = () => {
        listKhachHang({ page: currentPage, size: itemsPerPage }, searchQuery)
            .then((response) => {
                setKhachHangList(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllKhachHang();
    }, [currentPage, searchQuery]);

    const handleCreateKhachHang = () => {
        navigate('/add-khach-hang');
    }

    const handleUpdateKhachHang = (id) => {
        navigate(`/update-khach-hang/${id}`);
    }

    const handleDeleteKhachHang = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            deleteKhachHang(id).then(() => {
                getAllKhachHang();
            }).catch((error) => {
                console.log("Xóa khách hàng thất bại: " + error);
            });
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset lại trang khi tìm kiếm
    }

    return (
        <div className='container'>
            <h5>Danh sách Khách Hàng</h5>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between'>
                        <button
                            className='btn btn-outline-success btn-lg fs-6'
                            onClick={handleCreateKhachHang}>
                            <i className='bi bi-plus-circle'></i> Thêm Khách Hàng
                        </button>
                        <div className="input-group ms-2 w-25">
                            <input
                                type="text"
                                className='form-control form-control-lg fs-6'
                                placeholder='Tìm kiếm khách hàng...'
                                value={searchQuery}
                                onChange={handleSearchInput}
                            />
                        </div>
                    </div>

                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Giới tính</th>
                                <th>Địa chỉ</th>
                                <th>Số Điện Thoại</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th>Chức Năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {khachHangList.length > 0 ? (
                                khachHangList.map(khachHang => (
                                    <tr key={khachHang.id}>
                                        <td>{khachHang.id}</td>
                                        <td>{khachHang.ho}</td>
                                        <td>{khachHang.ten}</td>
                                        <td>{khachHang.gioiTinh}</td>
                                        <td>{khachHang.diaChi}</td>
                                        <td>{khachHang.sdt}</td>
                                        <td>{khachHang.email}</td>
                                        <td>{khachHang.trangThai}</td>
                                        <td>
                                            <button
                                                className='btn btn-outline-warning'
                                                onClick={() => handleUpdateKhachHang(khachHang.id)}>
                                                Sửa
                                            </button>
                                            <button
                                                className='btn btn-outline-danger ms-2'
                                                onClick={() => handleDeleteKhachHang(khachHang.id)}>
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className='text-center'>Không có khách hàng</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    <div className='d-flex justify-content-center my-3'>
                        <button
                            className='btn btn-outline-primary me-2'
                            disabled={currentPage === 0}
                            onClick={handlePreviousPage}>
                            Previous
                        </button>
                        <span className='align-self-center' style={{ marginTop: '7px' }}>
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            className='btn btn-outline-primary ms-2'
                            disabled={currentPage + 1 >= totalPages}
                            onClick={handleNextPage}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListKhachHang;
