import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listHoaDon } from '../../services/HoaDonService'; // Chỉ cần dùng listHoaDon để lấy danh sách hóa đơn
import FormDetail from './FormDetailHD';
import FormAddHoaDon from './FormAddHoaDon';

const ListHoaDon = () => {
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [trangThai, setTrangThai] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedHoaDon, setSelectedHoaDon] = useState(null);
    const [showDetailForm, setShowDetailForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);  // State to control Add form visibility
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

    const handleSearch = (e) => {
        setKeyword(e.target.value.trim());
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

    const handleOpenFormDetail = (hoaDonId) => {
        const selectedInvoice = hoaDon.find(item => item.id === hoaDonId);
        setSelectedHoaDon(selectedInvoice);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false);
        setSelectedHoaDon(null);
    };

    const handleOpenAddForm = () => {
        setShowAddForm(true);  // Open the Add form modal
    };
    
    const handleCloseAddForm = () => {
        setShowAddForm(false);  // Close the Add form modal
    };

    return (
        <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button
                            className='btn btn-outline-success btn-lg fs-6'
                            onClick={handleOpenAddForm} >
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

                    {/* Table for displaying invoices */}
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
                                    <tr key={item.id} onClick={() => handleOpenFormDetail(item.id)}>
                                        <td>{item.maHoaDon}</td>
                                        <td>{item.hoTenNhanVien}</td>
                                        <td>{item.maDatPhong}</td>
                                        <td>{item.ngayTao}</td>
                                        <td>{item.tongTien}</td>
                                        <td>{item.trangThai}</td>
                                        <td>
                                            <button className="btn btn-info btn-sm">Chi tiết</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {/* Pagination */}
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

            {/* Modal for viewing details */}
            {showDetailForm && selectedHoaDon && (
                <FormDetail
                    hoaDon={selectedHoaDon}
                    handleClose={handleCloseFormDetail}
                />
            )}

            {/* Modal for adding Hoa Don */}
            {showAddForm && (
                <FormAddHoaDon
                    handleClose={handleCloseAddForm}
                />
            )}
        </div>
    );
};

export default ListHoaDon;

