import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listHoaDon } from '../../services/HoaDonService';

const ListHoaDon = () => {
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [trangThai, setTrangThai] = useState("Chưa thanh toán");
    const [keyword, setKeyword] = useState("");
    const itemsPerPage = 10;

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
                console.error(error);
            });
    };

    useEffect(() => {
        getAllHoaDon();
    }, [currentPage, trangThai, keyword]);

    const handleSearch = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleTrangThaiChange = (e) => {
        setTrangThai(e.target.value);
        setCurrentPage(0);
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

    const formatCurrency = (amount) => {
        if (amount == null) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className='container'>
            <div className='card' style={{ marginBottom: '20px' }}>
                <div className='card-body'>

                    <div className='row mb-4'>
                        <div className='col-md-2'>
                            <h6>Trạng thái</h6>
                            <select
                                id="trangThai"
                                className="form-select form-select"
                                value={trangThai}
                                onChange={handleTrangThaiChange}
                            >
                                <option value="Chưa thanh toán">Chưa thanh toán</option>
                                <option value="Chờ xác nhận">Chờ xác nhận</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <h6>Tìm kiếm</h6>
                            <input
                                type="text"
                                className='form-control form-control'
                                placeholder='Tìm kiếm hóa đơn...'
                                value={keyword}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>Mã hóa đơn</th>
                                <th>Tên nhân viên</th>
                                <th>Ngày tạo</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th className='text-center'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hoaDon.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.maHoaDon}</td>
                                    <td>{item.tenNhanVien}</td>
                                    <td>{item.ngayTao}</td>
                                    <td>{formatCurrency(item.tongTien)}</td>
                                    <td>{item.trangThai}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button
                                                className="btn btn-success"
                                                style={{
                                                    width: '130px',
                                                    height: '50px',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    cursor: item.trangThai === 'Đã thanh toán' ? 'not-allowed' : 'pointer'
                                                }}
                                                onClick={() => {
                                                    if (item.trangThai === 'Đã thanh toán') {
                                                        alert('Hóa đơn này đã được thanh toán!');
                                                    } else {
                                                        navigate(`/thanh-toan/${item.id}`);
                                                    }
                                                }}
                                                readonly={item.trangThai === 'Đã thanh toán'}
                                            >
                                                <i style={{ color: 'white' }} className="bi bi-credit-card"></i> Thanh toán
                                            </button>
                                            <button
                                                className="btn btn-info"
                                                style={{
                                                    width: '130px',
                                                    height: '50px',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                                onClick={() => navigate(`/hoa-don/${item.id}`)}
                                            >
                                                <i className="bi bi-info-circle"></i> Thông tin
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>


                    </table>

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
