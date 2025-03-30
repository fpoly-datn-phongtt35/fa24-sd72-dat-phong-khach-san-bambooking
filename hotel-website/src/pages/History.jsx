import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatPhongbyTDN } from '../services/DatPhong.js';
import '../styles/History.css';

export default function History() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageable, setPageable] = useState({
        page: 0,
        size: 5,
        totalPages: 0
    });
    const navigate = useNavigate();
    const tenDangNhap = localStorage.getItem('user');

    useEffect(() => {
        fetchBookings();
    }, [pageable.page]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getDatPhongbyTDN(tenDangNhap, pageable);
            setBookings(response.data.content || response.data);
            setPageable(prev => ({
                ...prev,
                totalPages: response.data.totalPages || 0
            }));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPageable(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleViewDetail = (idDatPhong) => {
        navigate(`/detail-ttdp/${idDatPhong}`);
    };

    return (
        <div className="history-container">
            <h2>Danh sách đặt phòng</h2>

            {loading ? (
                <p className="loading">Đang tải...</p>
            ) : (
                <>
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Mã đặt phòng</th>
                                <th>Số phòng</th>
                                <th>Số người</th>
                                <th>Tổng tiền</th>
                                <th>Ngày đặt</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.maDatPhong}</td>
                                    <td>{booking.soPhong}</td>
                                    <td>{booking.soNguoi}</td>
                                    <td>{booking.tongTien.toLocaleString()} VNĐ</td>
                                    <td>{new Date(booking.ngayDat).toLocaleDateString()}</td>
                                    <td>{booking.ghiChu}</td>
                                    <td>{booking.trangThai}</td>
                                    <td>
                                        <button 
                                            className="view-detail-btn"
                                            onClick={() => handleViewDetail(booking.id)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            disabled={pageable.page === 0}
                            onClick={() => handlePageChange(pageable.page - 1)}
                        >
                            Trước
                        </button>
                        <span className="page-info">
                            Trang {pageable.page + 1} / {pageable.totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={pageable.page >= pageable.totalPages - 1}
                            onClick={() => handlePageChange(pageable.page + 1)}
                        >
                            Sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}