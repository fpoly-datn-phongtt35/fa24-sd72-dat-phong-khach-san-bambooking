import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listThongTinHoaDon } from '../../services/ThongTinHoaDonService'; // Chỉ cần dùng listThongTinHoaDon để lấy danh sách thông tin hóa đơn
import FormDetail from './FormDetailThongTinHD';
// import FormAddThongTinHoaDon from './FormAddThongTinHoaDon';

const ListThongTinHoaDon = () => {
    const navigate = useNavigate();
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [selectedThongTin, setSelectedThongTin] = useState(null);
    const [showDetailForm, setShowDetailForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const itemsPerPage = 5;

    const getAllThongTinHoaDon = () => {
        const pageable = {
            page: currentPage,
            size: itemsPerPage
        };

        listThongTinHoaDon(pageable, keyword)
            .then((response) => {
                setThongTinHoaDon(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllThongTinHoaDon();
    }, [currentPage, keyword]);

    const handleSearch = (e) => {
        setKeyword(e.target.value.trim());
        setCurrentPage(0);
        getAllThongTinHoaDon();
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

    const handleOpenFormDetail = (thongTinId) => {
        const selectedItem = thongTinHoaDon.find(item => item.id === thongTinId);
        setSelectedThongTin(selectedItem);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false);
        setSelectedThongTin(null);
    };

    const handleOpenAddForm = () => {
        setShowAddForm(true);
    };
    
    const handleCloseAddForm = () => {
        setShowAddForm(false);
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
                                placeholder='Tìm kiếm thông tin hóa đơn...'
                                value={keyword}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Table for displaying invoice details */}
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID Trả Phòng</th>
                                <th>ID Hóa Đơn</th>
                                <th>Tiền Dịch Vụ</th>
                                <th>Tiền Phòng</th>
                                <th>Tiền Phụ Thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                thongTinHoaDon.map(item =>
                                    <tr key={item.id} onClick={() => handleOpenFormDetail(item.id)}>
                                        <td>{item.idTraPhong}</td>
                                        <td>{item.idHoaDon}</td>
                                        <td>{item.tienDichVu}</td>
                                        <td>{item.tienPhong}</td>
                                        <td>{item.tienPhuThu}</td>
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
            {showDetailForm && selectedThongTin && (
                <FormDetail
                    thongTinHoaDon={selectedThongTin}
                    handleClose={handleCloseFormDetail}
                />
            )}

            {/* Modal for adding Thong Tin Hoa Don */}
            {showAddForm && (
                <FormAddThongTinHoaDon
                    handleClose={handleCloseAddForm}
                />
            )}
        </div>
    );
};

export default ListThongTinHoaDon;
