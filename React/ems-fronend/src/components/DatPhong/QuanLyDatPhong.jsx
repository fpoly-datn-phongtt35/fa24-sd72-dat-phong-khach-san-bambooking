import React, { useState, useEffect } from 'react';
import './QuanLyDatPhong.scss';
import { HienThiQuanLy } from '../../services/TTDP';
import { useNavigate } from 'react-router-dom';

function QuanLyDatPhong() {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('Chưa xếp');
    const hienThiQuanLy = (trangThai, page = 0) => {
        HienThiQuanLy(trangThai, { page: page, size: 5 })
            .then(response => {
                setThongTinDatPhong(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
                setCurrentStatus(trangThai);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 1 : diffDays;
    };

    const calculateTotalPrice = (donGia, start, end) => {
        const days = calculateDays(start, end);
        return donGia * days;
    };

    useEffect(() => {
        hienThiQuanLy(currentStatus, currentPage);
    }, [currentPage, currentStatus]);

    const handleStatusChange = (trangThai) => {
        setCurrentPage(0); // Đặt lại trang về 0
        hienThiQuanLy(trangThai, 0); // Gọi lại API với trang đầu tiên và trạng thái mới
    };

    // Hàm điều hướng đến trang chi tiết đặt phòng
    const handleDatPhongClick = (maDatPhong) => {
        navigate('/thong-tin-dat-phong', { state: { maDatPhong } });
    };

    // Hàm điều hướng đến trang chi tiết TTDP
    const handleTTDPClick = (maTTDP) => {
        navigate(`/chi-tiet-ttdp/${maTTDP}`);
    };
    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };
    return (
        <div className="reservation">
            <nav>
                <a onClick={() => handleStatusChange('Chưa xếp')}>Chưa xếp</a>
                <a onClick={() => handleStatusChange('Đã xếp')}>Đã xếp</a>
                <a onClick={() => handleStatusChange('Đang ở')}>Đang ở</a>
                <a onClick={() => handleStatusChange('Đến hạn')}>Đến hạn</a>
                <a onClick={() => handleStatusChange('Đã trả phòng')}>Đã trả phòng</a>
                <a onClick={() => handleStatusChange('Đã hủy')}>Đã hủy</a>
            </nav>

            <div className="filters">
                <input type="text" placeholder="Search..." className="search-bar" />
                <input type="date" placeholder="Start Date" />
                <input type="date" placeholder="End Date" />
            </div>

            <div className="reservation-list">
                <button className="assign-button" disabled>
                    Assign
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Đặt phòng</th>
                            <th>Thông tin đặt phòng</th>
                            <th>Tên khách hàng</th>
                            <th>Số người</th>
                            <th>Loại phòng</th>
                            <th>Ngày nhận phòng</th>
                            <th>Ngày trả phòng</th>
                            <th>Tiền phòng</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thongTinDatPhong.length > 0 ? (
                            thongTinDatPhong.map((ttdp) => (
                                <tr key={ttdp.id}>
                                    <td><input type="checkbox" /></td>
                                    {/* Gọi hàm điều hướng khi click vào mã đặt phòng */}
                                    <td onClick={() => handleDatPhongClick(ttdp.maDatPhong)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maDatPhong}
                                    </td>
                                    {/* Gọi hàm điều hướng khi click vào mã TTDP */}
                                    <td onClick={() => handleTTDPClick(ttdp.maTTDP)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maTTDP}
                                    </td>
                                    <td>{ttdp.tenKhachHang}</td>
                                    <td>{ttdp.soNguoi}</td>
                                    <td>{ttdp.tenLoaiPhong}</td>
                                    <td>{ttdp.ngayNhanPhong}</td>
                                    <td>{ttdp.ngayTraPhong}</td>
                                    <td>{calculateTotalPrice(ttdp.donGia, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()}</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={goToPreviousPage} disabled={currentPage === 0}>
                        Trang Trước
                    </button>
                    <span>Trang {currentPage + 1} trên {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
                        Trang Sau
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuanLyDatPhong;
