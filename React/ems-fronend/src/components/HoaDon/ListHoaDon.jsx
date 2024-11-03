import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listHoaDon } from '../../services/HoaDonService';

const ListHoaDon = () => {
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [trangThai, setTrangThai] = useState("");
    const [keyword, setKeyword] = useState("");
    const itemsPerPage = 5;

    const getAllHoaDon = () => {
        const pageable = {
            page: currentPage,
            size: itemsPerPage
        };

        listHoaDon(pageable, trangThai, keyword)
            .then((response) => {
                setHoaDon(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllHoaDon();
    }, [currentPage, trangThai, keyword]);

    const createHoaDon = () => {
        navigate('/add-hoa-don');
    };

    const handleSearch = (e) => {
        setKeyword(e.target.value.trim())
        setCurrentPage(0);
        getAllHoaDon();
    };

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

    const handleTrangThaiChange = (event) => {
        setTrangThai(event.target.value);
        setCurrentPage(0);
    };

    return (
        <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button
                            className='btn btn-outline-success btn-lg fs-6'
                            onClick={createHoaDon} >
                            <i className='bi bi-plus-circle'></i> Thêm
                        </button>
                        <div className="input-group ms-2 w-25">
                            <input
                                type="text"
                                className='form-control form-control-lg fs-6'
                                placeholder='Tìm kiếm hóa đơn...'
                                value={keyword}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className='form-label'>Trạng thái</label>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="trangThai"
                                id="tatCa"
                                value=""
                                checked={trangThai === ""}
                                onChange={handleTrangThaiChange}
                            />
                            <label className="form-check-label" htmlFor="tatCa"> Tất cả</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="trangThai"
                                id="chuaThanhToan"
                                value="Chưa thanh toán"
                                checked={trangThai === "Chưa thanh toán"}
                                onChange={handleTrangThaiChange}
                            />
                            <label className="form-check-label" htmlFor="chuaThanhToan">Chưa thanh toán</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="trangThai"
                                id="daThanhToan"
                                value="Đã thanh toán"
                                checked={trangThai === "Đã thanh toán"}
                                onChange={handleTrangThaiChange}
                            />
                            <label className="form-check-label" htmlFor="daThanhToan">Đã thanh toán</label>
                        </div>
                    </div>

                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>Mã hóa đơn</th>
                                <th>Tên nhân viên</th>
                                <th>Mã đặt phòng</th>
                                <th>Ngày tạo</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                hoaDon.map(item =>
                                    <tr key={item.id}>
                                        <td>{item.maHoaDon}</td>
                                        <td>{item.hoTenNhanVien}</td>
                                        <td>{item.maDatPhong}</td>
                                        <td>{item.ngayTao}</td>
                                        <td>{item.tongTien}</td>
                                        <td>{item.trangThai}</td>
                                    </tr>
                                )
                            }
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

export default ListHoaDon;
