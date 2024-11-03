import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listPhong, updateStatus } from '../../services/PhongService';

const ListPhong = () => {

    const navigate = useNavigate();
    const [p, setPhong] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemPerPage = 5;

    const getAllPhong = () => {
        listPhong({ page: currentPage, size: itemPerPage }, searchQuery)
            .then((response) => {
                setPhong(response.data.content);
                console.log(response.data.content)
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
            console.log(p)
    };

    useEffect(() => {
        getAllPhong();
    }, [currentPage, searchQuery]);

    const handleCreatePhong = () => {
        navigate('/add-phong');
    }

    const handleUpdatePhong = (id) => {
        navigate(`/update-phong/${id}`)
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

    const handleUpdateStatus = (phongId) => {
        updateStatus(phongId).then(() => {
            getAllPhong();
        }).catch((error) => {
            console.log("Cập nhật trạng thái phòng thất bại: " + error);
        });
    };

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // reset lại trang khi tìm kiếm
    }

    return (
        <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between'>
                        <button
                            className='btn btn-outline-success btn-lg fs-6'
                            onClick={handleCreatePhong} >
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

                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID Phòng</th>
                                <th>Tên loại phòng</th>
                                <th>Mã phòng</th>
                                <th>Tên phòng</th>
                                <th>Tình trạng</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {p.length > 0 ? (
                                p.map(phong =>
                                    <tr key={phong.id}>
                                        <td>{phong.id}</td>
                                        <td>{phong.loaiPhong?.tenLoaiPhong}</td>
                                        <td>{phong.maPhong}</td>
                                        <td>{phong.tenPhong}</td>
                                        <td>{phong.tinhTrang}</td>
                                        <td>{phong.trangThai ? "Hoạt động" : "Không hoạt động"}</td>
                                        <td>
                                            <button
                                                className='btn btn-outline-warning'
                                                onClick={() => handleUpdateStatus(phong.id)}
                                            >Đổi trạng thái
                                            </button>
                                            <button
                                                className='btn btn-outline-info'
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => handleUpdatePhong(phong.id)}
                                            >Thông tin</button>
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="8" className='text-center'>Không có phòng</td>
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
    )
}

export default ListPhong;
