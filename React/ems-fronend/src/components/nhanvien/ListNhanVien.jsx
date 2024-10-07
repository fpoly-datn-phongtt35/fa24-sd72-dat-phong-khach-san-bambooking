import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listNhanVien, updateNhanVien, deleteNhanVien } from '../../services/NhanVienService';

const ListNhanVien = () => {
    const [nhanVien, setNhanVien] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Quản lý nhân viên đã chọn
    const [ho, setHo] = useState('');
    const [ten, setTen] = useState('');
    const [gioiTinh, setGioiTinh] = useState('');
    const [quocGia, setQuocGia] = useState('');
    const [sdt, setSdt] = useState('');
    const [email, setEmail] = useState('');
    const [ngayTao, setNgayTao] = useState('');
    const [ngaySua, setNgaySua] = useState('');
    const [trangThai, setTrangThai] = useState('');

    const pageSize = 5;
    const navigate = useNavigate();

    const fetchNhanVien = () => {
        listNhanVien({ page: currentPage, size: pageSize })
            .then((response) => {
                setNhanVien(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log("Có lỗi khi lấy danh sách nhân viên: " + error);
            });
    };

    useEffect(() => {
        fetchNhanVien();
    }, [currentPage]);

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

    function addNewNhanVien() {
        navigate('/add-nhanvien');
    }

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const handleUpdateNhanVien = (e) => {
        e.preventDefault(); // Ngăn chặn reload trang
        const nhanVien = {
            id: selectedEmployee.id,
            ho,
            ten,
            gioiTinh,
            quocGia,
            sdt,
            email,
            ngayTao: new Date(ngayTao).toISOString(),
            ngaySua: new Date(ngaySua).toISOString(),
            trangThai,
        };
    
        updateNhanVien(nhanVien)
            .then((response) => {
                console.log("Cập nhật thành công:", response.data);
                setNhanVien((prev) =>
                    prev.map((emp) => (emp.id === nhanVien.id ? nhanVien : emp))
                );
                handleCloseModal(); // Đóng modal sau khi cập nhật
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật nhân viên:", error.response?.data || error.message);
            });
    };
    

    const handleDeleteNhanVien = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            deleteNhanVien(id)
                .then((response) => {
                    console.log("Phản hồi từ server:", response);
                    setNhanVien((prev) => prev.filter(emp => emp.id !== id));
                    console.log("Xóa nhân viên thành công!");
                })
                .catch((error) => {
                    // Kiểm tra xem error.response có tồn tại không
                    const errorMessage = error.response ? error.response.data : error.message;
                    console.error("Lỗi khi xóa nhân viên:", errorMessage);
                });
        }
    };
    



    return (
        <div className='container'>
            <h5 className='my-3'>Danh Sách Nhân Viên</h5>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-outline-success btn-lg fs-6' onClick={addNewNhanVien}>
                    <i className='bi bi-plus-circle'></i> Thêm
                </button>

                <div className="input-group ms-2 w-25">
                            <input
                                type="text"
                                className='form-control form-control-lg fs-6'
                                placeholder='Tìm kiếm phòng...'
                                value={searchQuery}
                                onChange={handleSearchInput}
                            />
                </div>
                
            </div>
            <div className='card'>
                <div className='card-body'>
                    <table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Giới Tính</th>
                                <th>Quốc Gia</th>
                                <th>Số Điện Thoại</th>
                                <th>Email</th>
                                <th>Ngày Tạo</th>
                                <th>Ngày Sửa</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nhanVien.length > 0 ? (
                                nhanVien.map(nv => (
                                    <tr key={nv.id}>
                                        <td>{nv.id}</td>
                                        <td>{nv.ho}</td>
                                        <td>{nv.ten}</td>
                                        <td>{nv.gioiTinh}</td>
                                        <td>{nv.quocGia}</td>
                                        <td>{nv.sdt}</td>
                                        <td>{nv.email}</td>
                                        <td>{new Date(nv.ngayTao).toLocaleDateString('vi-VN')}</td>
                                        <td>{new Date(nv.ngaySua).toLocaleDateString('vi-VN')}</td>
                                        <td>{nv.trangThai}</td>
                                        <td>
                                            <button className='btn btn-info' onClick={() => {
                                                setSelectedEmployee(nv);
                                                setHo(nv.ho);
                                                setTen(nv.ten);
                                                setGioiTinh(nv.gioiTinh);
                                                setQuocGia(nv.quocGia);
                                                setSdt(nv.sdt);
                                                setEmail(nv.email);
                                                setNgayTao(nv.ngayTao ? new Date(new Date(nv.ngayTao).getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0] : ''); 
                                                setNgaySua(nv.ngaySua ? new Date(new Date(nv.ngaySua).getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0] : '');
                                                setTrangThai(nv.trangThai);
                                            }}>Chi tiết</button>
                                            <button className='btn btn-danger' onClick={() => handleDeleteNhanVien(nv.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className='text-center'>Không có nhân viên</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className='d-flex justify-content-center my-3'>
                        <button className='btn btn-outline-primary me-2' disabled={currentPage === 0} onClick={handlePreviousPage}>
                            Previous
                        </button>
                        <span className='align-self-center' style={{ marginTop: '7px' }}>
                            Page {currentPage + 1} / {totalPages}
                        </span>
                        <button className='btn btn-outline-primary ms-2' disabled={currentPage + 1 >= totalPages} onClick={handleNextPage}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedEmployee && (
    <div className="modal show" style={{ display: 'block' }} onClick={handleCloseModal}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Thông tin nhân viên</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={(e) => {
                        e.preventDefault(); 
                        handleUpdateNhanVien(e); 
                    }}>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Họ</label>
                            <input type="text" value={ho} className='form-control'
                                onChange={(e) => setHo(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Tên</label>
                            <input type="text" value={ten} className='form-control'
                                onChange={(e) => setTen(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Giới tính</label>
                            <div>
                                <label>
                                    <input 
                                        type="radio" 
                                        value="Nam" 
                                        checked={gioiTinh === 'Nam'} 
                                        onChange={(e) => setGioiTinh(e.target.value)} 
                                    />
                                    Nam
                                </label>
                                <label className='ms-3'>
                                    <input 
                                        type="radio" 
                                        value="Nữ" 
                                        checked={gioiTinh === 'Nữ'} 
                                        onChange={(e) => setGioiTinh(e.target.value)} 
                                    />
                                    Nữ
                                </label>
                            </div>
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Quốc gia</label>
                            <input type="text" value={quocGia} className='form-control'
                                onChange={(e) => setQuocGia(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Số điện thoại</label>
                            <input type="text" value={sdt} className='form-control'
                                onChange={(e) => setSdt(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Email</label>
                            <input type="text" value={email} className='form-control'
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Ngày tạo</label>
                            <input type="date" value={ngayTao} className='form-control'
                                onChange={(e) => setNgayTao(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Ngày sửa</label>
                            <input type="date" value={ngaySua} className='form-control'
                                onChange={(e) => setNgaySua(e.target.value)} />
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Trạng thái</label>
                            <input type="text" value={trangThai} className='form-control'
                                onChange={(e) => setTrangThai(e.target.value)} />
                        </div>
                        <button type='submit' className='btn btn-warning'>Cập nhật</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Đóng</button>
                </div>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default ListNhanVien;
