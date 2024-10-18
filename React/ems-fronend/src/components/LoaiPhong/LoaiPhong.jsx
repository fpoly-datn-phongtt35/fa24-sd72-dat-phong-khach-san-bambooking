import React, { useEffect, useState } from 'react';
import { listLoaiPhong } from '../../services/LoaiPhongService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const LoaiPhong = () => {
    const [data, setData] = useState([]); // Dữ liệu tiện ích
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const itemsPerPage = 8;
    const [selectedData, setSelectedData] = useState(null); // Lưu tiện ích được chọn

    // Hàm lấy dữ liệu tiện ích
    const getAllSanPham = () => {
        listLoaiPhong({ page: currentPage, size: itemsPerPage }, "")
            .then((response) => {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllSanPham();
    }, [data]);

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

    return (
        <div className="container">
            <div >
            <table className="table">
                    <thead>
                        <tr>
                            <th className="col">ID</th>
                            <th className="col">Tên loại phòng</th>
                            <th className="col">Diện tích</th>
                            <th className="col">Sức chứa lớn</th>
                            <th className="col">Sức chứa nhỏ</th>
                            <th className="col">Mô tả</th>
                            <th className="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map(ti => (
                                <tr key={ti.id} onClick={() => handleOpenFormDetail(ti.id)}>
                                    <td>{ti.id}</td>
                                    <td>{ti.tenLoaiPhong}</td>
                                    <td>{ti.dienTich}</td>
                                    <td>{ti.sucChuaLon}</td>
                                    <td>{ti.sucChuaNho}</td>
                                    <td>{ti.moTa}</td>
                                    <td>{ti.trangThai}</td>
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
                <button className="btn btn-success" onClick={handlePreviousPage} >
                    Trang trước
                </button>

                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button className="btn btn-success" onClick={handleNextPage} >
                    Trang sau
                </button>
            </div>

            <div>
                <br></br>
                <button className="btn btn-secondary" onClick={handleOpenFormAdd}>
                    Thêm mới
                </button>

                {/* Hiển thị FormAdd khi showAddForm là true */}
                {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}

                {/* Hiển thị FormDetail khi showDetailForm là true */}
                {showDetailForm && <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />}
            </div>
        </div>
    )
}

export default LoaiPhong;
