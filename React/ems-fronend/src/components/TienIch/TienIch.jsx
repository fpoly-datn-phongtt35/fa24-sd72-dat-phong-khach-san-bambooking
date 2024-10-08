import React, { useEffect, useState } from 'react';
import { listTienIch, searchTienIch } from '../../services/TienIchService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const TienIch = () => {
    const [data, setData] = useState([]); // Dữ liệu tiện ích
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const itemsPerPage = 4;
    const [selectedData, setSelectedData] = useState(null); // Lưu tiện ích được chọn
    const [searchTerm, setSearchTerm] = useState(''); // State để quản lý giá trị tìm kiếm

    // Hàm lấy dữ liệu tiện ích
    const getAllSanPham = () => {
        const apiCall = searchTerm ? searchTienIch(searchTerm, { page: currentPage, size: itemsPerPage }) : listTienIch({ page: currentPage, size: itemsPerPage });

        apiCall
            .then((response) => {
                console.log(response.data); // Kiểm tra cấu trúc dữ liệu
                setData(response.data.content || []); // Đảm bảo setData là một mảng
                setTotalPages(response.data.totalPages || 0); // Đảm bảo tổng số trang được đặt đúng
            }).catch((error) => {
                console.log(error);
                setData([]); // Đặt lại data nếu có lỗi
                setTotalPages(0); // Đặt lại totalPages nếu có lỗi
            });

    };



    // Gọi API khi currentPage hoặc searchTerm thay đổi
    useEffect(() => {
        getAllSanPham();
    }, [data,currentPage, searchTerm]);

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
        const selectedItem = data.find(item => item.id === id);
        console.log("Selected Item: ", selectedItem); // Kiểm tra giá trị của selectedItem
        setSelectedData(selectedItem);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false); // Đóng form chi tiết
        setSelectedData(null); // Xóa dữ liệu đã chọn
    };

    // Hàm xử lý thay đổi giá trị input tìm kiếm
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm

        // Gọi API tìm kiếm
        searchTienIch(value, { page: 0, size: itemsPerPage }) // Sử dụng { page: 0, size: itemsPerPage }
            .then((response) => {
                console.log(response.data); // Kiểm tra cấu trúc dữ liệu
                setData(response.data.content || []); // Đảm bảo setData là một mảng
                setTotalPages(response.data.totalPages || 0); // Kiểm tra totalPages
            })
            .catch((error) => {
                console.log(error);
                setData([]); // Đặt lại data nếu có lỗi
            });
    };




    return (
        <div className="container">

            <div>
                <br></br>
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    name="search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Tìm kiếm theo tên tiện ích"
                />
                <br></br>
            </div>
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="col">ID</th>
                            <th className="col">Tên tiện ích</th>
                            <th className="col">Hình ảnh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map(ti => (
                                <tr key={ti.id} onClick={() => handleOpenFormDetail(ti.id)}>
                                    <td>{ti.id}</td>
                                    <td>{ti.tenTienIch}</td>
                                    <td>
                                        <img
                                            src={`../../../../public/images/${ti.hinhAnh}`}
                                            alt={ti.tenTienIch}
                                            style={{ width: '150px', height: '100px' }}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Không có dữ liệu tìm kiếm</td>
                            </tr>
                        )}
                    </tbody>



                </table>
            </div>

            <div className="pagination">
                <button className="btn btn-success" onClick={handlePreviousPage}>
                    Trang trước
                </button>
                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button className="btn btn-success" onClick={handleNextPage}>
                    Trang sau
                </button>
            </div>

            <div>
                <br />
                <button className="btn btn-secondary" onClick={handleOpenFormAdd}>
                    Thêm mới
                </button>

                {/* Hiển thị FormAdd khi showAddForm là true */}
                {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}

                {/* Hiển thị FormDetail khi showDetailForm là true */}
                {showDetailForm && <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />}
            </div>
        </div>
    );
};

export default TienIch;
