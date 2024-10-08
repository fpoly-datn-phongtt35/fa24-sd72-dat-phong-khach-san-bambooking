import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTaiKhoan, updateTaiKhoan, deleteTaiKhoan } from '../../services/TaiKhoanService'; // Giả sử bạn có API service này

const ListTaiKhoan = () => {
    const [taiKhoan, setTaiKhoan] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemPerPage = 5;
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Điều khiển hiển thị form cập nhật
    const [currentTaiKhoan, setCurrentTaiKhoan] = useState(null); // Thông tin tài khoản cần cập nhật
    const navigate = useNavigate();

    function handleCreateTaiKhoan() {
        navigate('/add-taikhoan');
    }

    const getAllTaiKhoan = () => {
        listTaiKhoan({ keyword: searchQuery, page: currentPage, size: itemPerPage })
            .then((response) => {
                setTaiKhoan(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllTaiKhoan();
    }, [currentPage, searchQuery]);

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const handleEditClick = (taiKhoan) => {
        setCurrentTaiKhoan(taiKhoan);
        setIsEditing(true);
    };

    const handleUpdate = () => {
        updateTaiKhoan(currentTaiKhoan.id, currentTaiKhoan) // Hàm updateTaiKhoan sẽ cần được định nghĩa trong TaiKhoanService
            .then(() => {
                setIsEditing(false);
                setCurrentTaiKhoan(null);
                getAllTaiKhoan(); // Lấy lại danh sách tài khoản
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật tài khoản: ", error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTaiKhoan(prev => ({ ...prev, [name]: value }));
    };


    const handleDeleteTaiKhoan = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            deleteTaiKhoan(id)
                .then(() => {
                    // Gọi lại API để load danh sách tài khoản sau khi xóa thành công
                    getAllTaiKhoan();
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa tài khoản: ', error);
                });
        }
    };

    return (
        <div className='container'>
            <h5>Danh Sách Tài Khoản</h5>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between'>
                        <div className="input-group ms-2 w-25">
                            <input
                                type="text"
                                className='form-control form-control-lg fs-6'
                                placeholder='Tìm kiếm tài khoản...'
                                value={searchQuery}
                                onChange={handleSearchInput}
                            />
                        </div>

                        <button
                            className='btn btn-outline-success btn-lg fs-6'
                            onClick={handleCreateTaiKhoan}>
                            <i className='bi bi-plus-circle'></i> Thêm
                        </button>
                    </div>

                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID Tài Khoản</th>
                                <th>Id Nhân Viên</th>
                                <th>Id Vai Trò</th>
                                <th>Tên Đăng Nhập</th>
                                <th>Mật Khẩu</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taiKhoan.length > 0 ? (
                                taiKhoan.map(taiKhoan => (
                                    <tr key={taiKhoan.id}>
                                        <td>{taiKhoan.id}</td>
                                        <td>{taiKhoan.nhanVien?.id}</td>
                                        <td>{taiKhoan.vaiTro?.id}</td>
                                        <td>{taiKhoan.tenDangNhap}</td>
                                        <td>{taiKhoan.matKhau}</td>
                                        <td>{taiKhoan.trangThai}</td>
                                        <td>
                                            <button
                                                className='btn btn-warning btn-sm'
                                                onClick={() => handleEditClick(taiKhoan)}>
                                                Cập Nhật
                                            </button>
                                            <button className='btn btn-danger' onClick={() => handleDeleteTaiKhoan(taiKhoan.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className='text-center'>Không có tài khoản</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Form cập nhật tài khoản */}
                    {isEditing && (
                        <div className='mt-3'>
                            <h5>Cập Nhật Tài Khoản</h5>
                            <div className='form-group'>
                                <label>ID Tài Khoản</label>
                                <input type="text" className='form-control' value={currentTaiKhoan.id} readOnly />
                            </div>
                            <div className='form-group'>
                                <label>Tên Đăng Nhập</label>
                                <input type="text" className='form-control' name="tenDangNhap" value={currentTaiKhoan.tenDangNhap} onChange={handleChange} />
                            </div>
                            <div className='form-group'>
                                <label>Mật Khẩu</label>
                                <input type="password" className='form-control' name="matKhau" value={currentTaiKhoan.matKhau} onChange={handleChange} />
                            </div>
                            <div className='form-group'>
                                <label>Trạng Thái</label>
                                <input type="text" className='form-control' name="trangThai" value={currentTaiKhoan.trangThai} onChange={handleChange} />
                            </div>
                            <button className='btn btn-success' onClick={handleUpdate}>Cập Nhật</button>
                            <button className='btn btn-danger ms-2' onClick={() => setIsEditing(false)}>Hủy</button>
                            
                        </div>
                    )}

                    {/* Phân trang */}
                    <div className='d-flex justify-content-center my-3'>
                        <button
                            className='btn btn-outline-primary me-2'
                            disabled={currentPage === 0}
                            onClick={handlePreviousPage}
                        >
                            Previous
                        </button>
                        <span className='align-self-center' style={{ marginTop: '7px' }}>
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            className='btn btn-outline-primary ms-2'
                            disabled={currentPage + 1 >= totalPages}
                            onClick={handleNextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListTaiKhoan;
