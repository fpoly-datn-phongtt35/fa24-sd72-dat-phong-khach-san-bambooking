import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LichSuDatPhong.css';
import {DSDatPhong} from '../DatPhong'

export default function LichSuDatPhong() {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 7;
    const navigate = useNavigate();

    // Giả lập gọi API lấy danh sách lịch sử đặt phòng
    useEffect(() => {
        DSDatPhong({page:currentPage, size: itemsPerPage})
        .then((response) => {
                setBookingHistory(response.data.content);
                setTotalPages(response.data.totalPages || 0);
        })
        .catch((error) => {
            console.log(error);
        });
        
    }, [currentPage]);

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


    return (
        <div className="booking-history-container">
            <h2>Lịch Sử Đặt Phòng</h2>
            <table className="booking-history-table">
                <thead>
                    <tr>
                        <th>Mã đặt phòng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Đặt cọc</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingHistory.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.maDatPhong}</td>
                            <td>{booking.ngayDat}</td>
                            <td>{booking.tongTien}</td>
                            <td>{booking.datCoc}</td>
                            <td>{booking.ghiChu}</td>
                            <td>{booking.trangThai}</td>
                            <td>
                                <button
                                    className="view-details-button"
                                >
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button className="btn btn-success" onClick={handlePreviousPage}>
                    Trang trước
                </button>

                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button className="btn btn-success" onClick={handleNextPage}>
                    Trang sau
                </button>
            </div>
        </div>
    );
}
