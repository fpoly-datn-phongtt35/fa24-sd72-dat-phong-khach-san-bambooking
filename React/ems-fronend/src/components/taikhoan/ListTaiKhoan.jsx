// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { listTaiKhoan, deleteTaiKhoan } from '../../services/TaiKhoanService'; // Giả sử bạn có API service này

// const ListTaiKhoan = () => {
//     const [taiKhoan, setTaiKhoan] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const itemPerPage = 5;
//     const [searchQuery, setSearchQuery] = useState('');
//     const navigate = useNavigate();

//     function handleCreateTaiKhoan() {
//         navigate('/add-taikhoan');
//     }

//     const getAllTaiKhoan = () => {
//         listTaiKhoan({ keyword: searchQuery, page: currentPage, size: itemPerPage })
//             .then((response) => {
//                 setTaiKhoan(response.data.content);
//                 setTotalPages(response.data.totalPages);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     useEffect(() => {
//         getAllTaiKhoan();
//     }, [currentPage, searchQuery]);

//     const handlePreviousPage = () => {
//         if (currentPage > 0) {
//             setCurrentPage(prevPage => prevPage - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages - 1) {
//             setCurrentPage(prevPage => prevPage + 1);
//         }
//     };

//     const handleSearchInput = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(0);
//     };


//     const handleDeleteTaiKhoan = (id) => {
//         if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
//             deleteTaiKhoan(id)
//                 .then(() => {
//                     // Gọi lại API để load danh sách tài khoản sau khi xóa thành công
//                     getAllTaiKhoan();
//                 })
//                 .catch((error) => {
//                     console.error('Lỗi khi xóa tài khoản: ', error);
//                 });
//         }
//     };

//     return (
//         <div className='container'>
//             <h5>Danh Sách Tài Khoản</h5>
//             <div className='card'>
//                 <div className='card-body'>
//                     <div className='d-flex justify-content-between'>
//                         <div className="input-group ms-2 w-25">
//                             <input
//                                 type="text"
//                                 className='form-control form-control-lg fs-6'
//                                 placeholder='Tìm kiếm tài khoản...'
//                                 value={searchQuery}
//                                 onChange={handleSearchInput}
//                             />
//                         </div>

//                         <button
//                             className='btn btn-outline-success btn-lg fs-6'
//                             onClick={handleCreateTaiKhoan}>
//                             <i className='bi bi-plus-circle'></i> Thêm
//                         </button>
//                     </div>

//                     <table className='table table-hover'>
//                         <thead>
//                             <tr>
//                                 <th>ID Tài Khoản</th>
//                                 <th>Tên Đăng Nhập</th>
//                                 <th>Mật Khẩu</th>
//                                 <th>Trạng Thái</th>
//                                 <th>Hành Động</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {taiKhoan.length > 0 ? (
//                                 taiKhoan.map(taiKhoan => (
//                                     <tr key={taiKhoan.id}>
//                                         <td>{taiKhoan.id}</td>
//                                         <td>{taiKhoan.tenDangNhap}</td>
//                                         <td>{taiKhoan.matKhau}</td>
//                                         <td>{taiKhoan.trangThai}</td>
//                                         <td>

//                                             <button className='btn btn-danger' onClick={() => handleDeleteTaiKhoan(taiKhoan.id)}>Delete</button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="7" className='text-center'>Không có tài khoản</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {/* Phân trang */}
//                     <div className='d-flex justify-content-center my-3'>
//                         <button
//                             className='btn btn-outline-primary me-2'
//                             disabled={currentPage === 0}
//                             onClick={handlePreviousPage}
//                         >
//                             Previous
//                         </button>
//                         <span className='align-self-center' style={{ marginTop: '7px' }}>
//                             Trang {currentPage + 1} / {totalPages}
//                         </span>
//                         <button
//                             className='btn btn-outline-primary ms-2'
//                             disabled={currentPage + 1 >= totalPages}
//                             onClick={handleNextPage}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ListTaiKhoan;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTaiKhoan, deleteTaiKhoan, updateTaiKhoan } from '../../services/TaiKhoanService'; // Giả sử bạn có API service này
import Modal from 'react-bootstrap/Modal'; // Thư viện Modal
import Button from 'react-bootstrap/Button'; // Thư viện Button

const ListTaiKhoan = () => {
    const [taiKhoan, setTaiKhoan] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemPerPage = 5;
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTaiKhoan, setSelectedTaiKhoan] = useState(null);
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

    const handleDeleteTaiKhoan = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            deleteTaiKhoan(id)
                .then(() => {
                    getAllTaiKhoan();
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa tài khoản: ', error);
                });
        }
    };

    const handleDetailClick = (taiKhoan) => {
        setSelectedTaiKhoan(taiKhoan);
        setShowModal(true);
    };

    const handleUpdateTaiKhoan = () => {
        const updatedTaiKhoan = {
            id: selectedTaiKhoan.id,
            tenDangNhap: selectedTaiKhoan.tenDangNhap,
            matKhau: selectedTaiKhoan.matKhau,
            trangThai: selectedTaiKhoan.trangThai, // Kiểm tra giá trị có đúng không
        };

        console.log("Payload gửi đi:", updatedTaiKhoan); // Debug payload

        updateTaiKhoan(updatedTaiKhoan)
            .then(() => {
                setShowModal(false);
                getAllTaiKhoan();
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật tài khoản: ", error);
            });
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
                                        <td>{taiKhoan.tenDangNhap}</td>
                                        <td>{taiKhoan.matKhau}</td>
                                        <td>{taiKhoan.trangThai}</td>
                                        <td>
                                            <button className='btn btn-info me-2' onClick={() => handleDetailClick(taiKhoan)}>Detail</button>
                                            <button className='btn btn-danger' onClick={() => handleDeleteTaiKhoan(taiKhoan.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='text-center'>Không có tài khoản</td>
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

            <div className="modal" tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chi Tiết Tài Khoản</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            {selectedTaiKhoan && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label"><strong>ID:</strong></label>
                                        <p>{selectedTaiKhoan.id}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Tên Đăng Nhập:</strong></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedTaiKhoan.tenDangNhap || ""}
                                            onChange={(e) =>
                                                setSelectedTaiKhoan({ ...selectedTaiKhoan, tenDangNhap: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Mật Khẩu:</strong></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedTaiKhoan.matKhau || ""}
                                            onChange={(e) =>
                                                setSelectedTaiKhoan({ ...selectedTaiKhoan, matKhau: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Trạng Thái:</strong></label>
                                        <div>
                                            <label className="me-3">
                                                <input
                                                    type="radio"
                                                    value="active"
                                                    checked={selectedTaiKhoan.trangThai === "active"}
                                                    onChange={() =>
                                                        setSelectedTaiKhoan({ ...selectedTaiKhoan, trangThai: "active" })
                                                    }
                                                />{" "}
                                                Hoạt động
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="inactive"
                                                    checked={selectedTaiKhoan.trangThai === "inactive"}
                                                    onChange={() =>
                                                        setSelectedTaiKhoan({ ...selectedTaiKhoan, trangThai: "inactive" })
                                                    }
                                                />{" "}
                                                Không hoạt động
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleUpdateTaiKhoan}
                            >
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ListTaiKhoan;
