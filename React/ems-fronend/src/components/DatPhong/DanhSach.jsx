import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DanhSachDatPhong, HienThiTheoLoc } from '../../services/DatPhong'; // Import cả hai hàm
import NavDatPhong from './NavDatPhong';
import './DanhSachCSS.scss';

const DanhSach = () => {
    const [data, setData] = useState([]); // Dữ liệu danh sách đặt phòng
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [selectedBookingId, setSelectedBookingId] = useState(null); // ID đặt phòng được chọn
    const [showModal, setShowModal] = useState(false); // Điều khiển hiển thị modal
    const [filters, setFilters] = useState([]); // Trạng thái bộ lọc
    const itemsPerPage = 6;
    const navigate = useNavigate();

    // Hàm lấy danh sách đặt phòng không có bộ lọc (Lần đầu load)
    const getAllDatPhong = () => {
        DanhSachDatPhong({ page: currentPage, size: itemsPerPage }, "")
            .then((response) => {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
        navigate('/thong-tin-dat-phong', { state: { id } });
        console.log(id);
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
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="main-container">
            <NavDatPhong onFilterChange={handleFilterChange} />

            <div className="content-container">
                <div className="booking-container">
                    {data.length > 0 ? (
                        data.map((dp) => {
                            const { id, maDatPhong, trangThai, tenKhachHang, ngayDat, ghiChu } = dp;
                            return (
                                <div key={id} className="booking-card" onClick={() => handleViewDetails(id)}>
                                    <div className="booking-header">
                                        <h3>Mã đặt phòng: {maDatPhong}</h3>
                                    </div>
                                    <div className="status-container">
                                        <span className={`status ${trangThai}`}>
                                            {trangThai}
                                        </span>
                                    </div>
                                    <div className="booking-body">
                                        <p><strong>Khách hàng:</strong> {tenKhachHang}</p>
                                        <p><strong>Thời gian đặt:</strong> {ngayDat}</p>
                                        <p><strong>Ghi chú:</strong> {ghiChu}</p>
                                    </div>
                                </div>
                            );
                        })
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
            </div>
        </div>
    );
};

export default DanhSach;
