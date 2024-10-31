import React, { useState, useEffect } from 'react';
import './QuanLyDatPhong.scss';
import { HienThiQuanLy, findTTDPS } from '../../services/TTDP';
import { useNavigate } from 'react-router-dom';
import XepPhong from './XepPhong'; // Import XepPhong modal

function QuanLyDatPhong() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('Chưa xếp');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [showXepPhongModal, setShowXepPhongModal] = useState(false); // Trạng thái hiển thị của Modal
    const [loaiPhong,setLoaiPhong] = useState(null);
    const fetchThongTinDatPhong = (trangThai, page = 0) => {
        findTTDPS(startDate, endDate, searchKey, trangThai, { page, size: 5 })
            .then(response => {
                setThongTinDatPhong(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
                setCurrentStatus(trangThai);
                console.log(response.data);
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
        fetchThongTinDatPhong(currentStatus, currentPage);
    }, [currentPage, currentStatus, startDate, endDate, searchKey]);

    const handleStatusChange = (trangThai) => {
        setCurrentPage(0);
        fetchThongTinDatPhong(trangThai, 0);
    };

    const handleDatPhongClick = (maDatPhong) => {
        navigate('/thong-tin-dat-phong', { state: { maDatPhong } });
    };

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

    // Hàm mở Modal XepPhong
    const openXepPhongModal = (loaiPhong) => {
        setLoaiPhong(loaiPhong);
        setShowXepPhongModal(true);
    };

    // Hàm đóng Modal XepPhong
    const closeXepPhongModal = () => {
        setShowXepPhongModal(false);
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
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div className="reservation-list">
                <button className="assign-button" onClick={openXepPhongModal}>
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
                                    <td onClick={() => handleDatPhongClick(ttdp.maDatPhong)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maDatPhong}
                                    </td>
                                    <td onClick={() => handleTTDPClick(ttdp.maTTDP)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maTTDP}
                                    </td>
                                    <td>{ttdp.tenKhachHang}</td>
                                    <td>{ttdp.soNguoi}</td>
                                    <td>{ttdp.loaiPhong.tenLoaiPhong}</td>
                                    <td>{ttdp.ngayNhanPhong}</td>
                                    <td>{ttdp.ngayTraPhong}</td>
                                    <td>{calculateTotalPrice(ttdp.donGia, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()}</td>
                                    <td>
                                    <button onClick={() => openXepPhongModal(ttdp.loaiPhong)}>Assign</button>
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

            {/* Hiển thị Modal XepPhong */}
            <XepPhong show={showXepPhongModal} handleClose={closeXepPhongModal} loaiPhong={loaiPhong}/>
        </div>
    );
}

export default QuanLyDatPhong;
