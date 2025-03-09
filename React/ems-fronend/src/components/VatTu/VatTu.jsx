import React, { useEffect, useState } from 'react';
import { listImage, searchTienIch } from '../../services/VatTuService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const VatTu = () => {
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const itemsPerPage = 4;
    const [selectedData, setSelectedData] = useState(null);
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Hàm lấy dữ liệu vật tư
    const getAllSanPham = () => {
        listImage({ page: currentPage, size: itemsPerPage }, searchQuery)
            .then((response) => {
                setImages(response.data.content);
                setTotalPages(response.data.totalPages);

            })
            .catch((error) => {
                console.log("Lỗi : " + error);
            });
    };



    // Gọi API khi currentPage hoặc searchTerm thay đổi
    useEffect(() => {
        getAllSanPham();
    }, [totalPages, currentPage, searchQuery, images]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // State quản lý form thêm và chi tiết
    const [showAddForm, setShowAddForm] = useState(false); // Quản lý trạng thái hiển thị form thêm
    const [showDetailForm, setShowDetailForm] = useState(false); // Quản lý trạng thái hiển thị form chi tiết

    const handleOpenFormAdd = () => {
        setShowAddForm(true); // Mở form thêm
    };

    const handleCloseFormAdd = () => {
        setShowAddForm(false); // Đóng form thêm
    };

    const handleOpenFormDetail = (id) => {
        const selectedItem = images.find(item => item.id === id);
        console.log("Selected Item: ", selectedItem); // Kiểm tra giá trị của selectedItem
        setSelectedData(selectedItem);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false); // Đóng form chi tiết
        setSelectedData(null); // Xóa dữ liệu đã chọn
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        currentPage(0);
    }


    return (
        <div className="container">
            <div className="card p-3">
                <div className='d-flex justify-content-between mb-3'>
                    <button className="btn btn-outline-success" onClick={handleOpenFormAdd}>
                        <i className="bi bi-plus-circle"></i> Thêm mới
                    </button>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        id="search"
                        name="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Tìm kiếm theo tên vật tư"
                    />
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên vật tư</th>
                            <th>Giá</th>
                            <th>Hình ảnh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.length > 0 ? (
                            images.map(image => (
                                <tr key={image.id} className="table-row" onClick={() => handleOpenFormDetail(image.id)}>
                                    <td>{image.id}</td>
                                    <td>{image.tenVatTu}</td>
                                    <td>{image.gia}</td>
                                    <td>
                                        <img
                                            src={image.hinhAnh}
                                            alt={image.tenVatTu}
                                            className="img-thumbnail"
                                            style={{ width: '150px', height: '100px' }}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Không có dữ liệu tìm kiếm</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-outline-primary me-2" onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Trang trước
                    </button>
                    <span className="align-self-center" style={{ marginTop: '7px' }}>
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button className="btn btn-outline-primary ms-2" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                        Trang sau
                    </button>
                </div>

                {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}
                {showDetailForm && <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />}
            </div>
        </div>
    );
};

export default VatTu;
