import React, { useEffect, useState } from 'react';
import { listTaiKhoan } from '../../services/TaiKhoanService'; // Giả sử bạn có API service này

const ListTaiKhoan = () => {
    const [taiKhoan, setTaiKhoan] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0);   // Tổng số trang
    const itemPerPage = 5; // Số lượng tài khoản mỗi trang

    // Hàm lấy tất cả tài khoản với phân trang
    const getAllTaiKhoan = () => {
        listTaiKhoan({ page: currentPage, size: itemPerPage })  // Gọi API với tham số phân trang
            .then((response) => {
                setTaiKhoan(response.data.content); // Gán dữ liệu tài khoản vào state
                setTotalPages(response.data.totalPages); // Lưu tổng số trang
            })
            .catch((error) => {0
                console.log(error);
            });
    };

    // Gọi API khi component được mount và khi thay đổi trang
    useEffect(() => {
        getAllTaiKhoan();
    }, [currentPage]); // Gọi lại mỗi khi `currentPage` thay đổi

    // Chuyển trang trước
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // Chuyển trang sau
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className='container'>
            <h5>Danh Sách Tài Khoản</h5>
            <div className='card'>
                <div className='card-body'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID Tài Khoản</th>
                                <th>Id Nhân Viên</th>
                                <th>Id Vai Trò</th>
                                <th>Tên Đăng Nhập</th>
                                <th>Mật Khẩu</th>
                                <th>Trạng Thái</th>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className='text-center'>Không có tài khoản</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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
