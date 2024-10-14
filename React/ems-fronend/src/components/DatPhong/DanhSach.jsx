import React, { useEffect, useState } from 'react';
<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
import { DanhSachDatPhong, HienThiTheoLoc } from '../../services/DatPhong'; // Import cả hai hàm
import ChiTietDatPhong from './DetailDatPhong';
import NavDatPhong from './NavDatPhong';
import './DanhSachCSS.css';

const DanhSach = () => {
    const [data, setData] = useState([]); // Dữ liệu danh sách đặt phòng
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [selectedBookingId, setSelectedBookingId] = useState(null); // ID đặt phòng được chọn
    const [showModal, setShowModal] = useState(false); // Điều khiển hiển thị modal
    const [filters, setFilters] = useState([]); // Trạng thái bộ lọc
    const itemsPerPage = 6;

    // Hàm lấy danh sách đặt phòng không có bộ lọc (Lần đầu load)
    const getAllDatPhong = () => {
<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
        DanhSachDatPhong({ page: currentPage, size: itemsPerPage }, "")
            .then((response) => {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
<<<<<<< HEAD

            })
            .catch((error) => {

                console.log(error);
            });
    };


    // Gọi API để lọc danh sách đặt phòng khi có bộ lọc hoặc trang thay đổi
=======
            })
            .catch((error) => {
                console.log(error);
            });
    };
    
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
    const getFilteredDatPhong = () => {
        HienThiTheoLoc({ page: currentPage, size: itemsPerPage }, filters)
            .then((response) => {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    
    useEffect(() => {
        if (filters.length > 0) {
            getFilteredDatPhong();
        } else {
            getAllDatPhong();
        }
    }, [currentPage, filters]);

    const handleFilterChange = (selectedFilters) => {
        setFilters(selectedFilters);
        setCurrentPage(0); // Đặt lại trang về 0 khi có bộ lọc mới
    };

    const handleViewDetails = (id) => {
        setSelectedBookingId(id); // Lưu ID của đặt phòng được chọn
        setShowModal(true); // Hiển thị modal chi tiết đặt phòng
    };

    const handleCloseModal = () => {
        setShowModal(false); // Đóng modal
        setSelectedBookingId(null); // Xóa dữ liệu chi tiết
    
        // Tải lại dữ liệu ngay sau khi đóng modal
        if (filters.length > 0) {
            getFilteredDatPhong(); // Tải lại dữ liệu khi có bộ lọc
        } else {
            getAllDatPhong(); // Tải lại toàn bộ dữ liệu
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="main-container">
            <NavDatPhong onFilterChange={handleFilterChange} />

            <div className="content-container">
                <div className="booking-container">
                    {data.length > 0 ? (
                        data.map((dp) => (
                            <div key={dp.id} className="booking-card" onClick={() => handleViewDetails(dp.id)}>
                                <div className="booking-header">
                                    <h3>Mã đặt phòng: {dp.maDatPhong}</h3>
                                </div>
                                <div className="status-container">
                                    <span className={`status ${dp.trangThai}`}>
                                        {dp.trangThai}
                                    </span>
                                </div>
                                <div className="booking-body">
                                    <p><strong>Nhân viên:</strong> {dp.tenNhanVien}</p>
                                    <p><strong>Khách hàng:</strong> {dp.tenKhachHang}</p>
                                    <p><strong>Thời gian đặt:</strong> {dp.ngayDat}</p>
                                    <p><strong>Ghi chú:</strong> {dp.ghiChu}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có dữ liệu</p>
                    )}
                </div>

                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Trang trước
                    </button>
                    <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                        Trang sau
                    </button>
                </div>

                {showModal && <ChiTietDatPhong bookingId={selectedBookingId} handleClose={handleCloseModal} show={showModal} />}
<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
            </div>
        </div>
    );
};

export default DanhSach;
