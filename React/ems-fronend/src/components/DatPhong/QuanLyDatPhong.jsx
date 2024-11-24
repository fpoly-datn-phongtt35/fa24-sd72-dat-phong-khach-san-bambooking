import React, { useState, useEffect } from 'react';
import './QuanLyDatPhong.scss';
import { HienThiQuanLy, findTTDPS, huyTTDP } from '../../services/TTDP';
import { useNavigate } from 'react-router-dom';
import XepPhong from '../XepPhong/XepPhong';
import { phongDaXep ,checkIn} from '../../services/XepPhongService';
import { Alert } from 'react-bootstrap';
import { checkOut } from '../../services/TraPhong';
function QuanLyDatPhong() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('Chua xep');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [showXepPhongModal, setShowXepPhongModal] = useState(false); // Trạng thái hiển thị của Modal
    const [loaiPhong, setLoaiPhong] = useState(null);
    const [ttdp, setTTDP] = useState(null);
    const [phongData, setPhongData] = useState({}); // State để lưu dữ liệu phòng đã xếp
    const [selectedTTDPs, setSelectedTTDPs] = useState([]);
    const HuyThongTinDatPhong = (maThongTinDatPhong) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn hủy thông tin đặt phòng này không?");
        if (confirmed) {
            huyTTDP(maThongTinDatPhong)
                .then(response => {
                    console.log(response.data);
                    alert('Hủy thành công!')
                    fetchThongTinDatPhong(currentStatus,currentPage);
                })
                .catch(error => {
                    console.log(error);
                    alert('Hủy thất bại!')
                });
        }
    }

    const fetchPhongDaXep = (maThongTinDatPhong) => {
        phongDaXep(maThongTinDatPhong)
            .then(response => {
                console.log("Dữ liệu phòng đã xếp:", response.data); // Log dữ liệu phòng đã xếp
                setPhongData(prevData => ({
                    ...prevData,
                    [maThongTinDatPhong]: response.data
                }));
            })
            .catch(error => {
                console.log("Lỗi khi lấy phòng đã xếp:", error);
            });
    };
    const fetchThongTinDatPhong = (trangThai, page = 0) => {
        findTTDPS(startDate, endDate, searchKey, trangThai, { page, size: 5 })
            .then(response => {
                setThongTinDatPhong(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
                setCurrentStatus(trangThai);
                if (trangThai != 'Chua xep') {
                    response.data.content.forEach(ttdp => fetchPhongDaXep(ttdp.maThongTinDatPhong));
                }
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

    const handleTTDPClick = (maThongTinDatPhong) => {
        navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
    };

    const handleHuyTTDPClick = (maThongTinDatPhong) => {
        HuyThongTinDatPhong(maThongTinDatPhong)
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

    // Hàm đóng Modal XepPhong
    const closeXepPhongModal = () => {
        setShowXepPhongModal(false);
    };
    const openModal = () => {
        setShowXepPhongModal(true); // Mở modal
    };
    // Hàm mở Modal XepPhong
    const openXepPhongModal = (thongTinDatPhong) => {
        setSelectedTTDPs([thongTinDatPhong]); // Gán thongTinDatPhong vào selectedTTDPs dưới dạng mảng chứa một phần tử
        setShowXepPhongModal(true); // Mở modal
    };
    
    const handleCheckboxChange = (ttdp) => {
        setSelectedTTDPs(prevSelected => {
            if (prevSelected.includes(ttdp)) {
                return prevSelected.filter(item => item !== ttdp);
            } else {
                return [...prevSelected, ttdp];
            }
        });
    };
    const handleCheckIn = (maThongTinDatPhong) => {
        navigate('/checkin', { state: { maThongTinDatPhong } });
        console.log("Checkin for:", maThongTinDatPhong);
        // checkIn(maThongTinDatPhong);
        // fetchThongTinDatPhong(currentStatus,currentPage);
    };
    const handleCheckOut = (maThongTinDatPhong) => {
        console.log("Checkout for:", maThongTinDatPhong);
        checkOut(maThongTinDatPhong);
        fetchThongTinDatPhong(currentStatus,currentPage);
    };
    return (
        <div className="reservation">
            <nav>
                <a onClick={() => handleStatusChange('Chua xep')}>Chưa xếp</a>
                <a onClick={() => handleStatusChange('Da xep')}>Đã xếp</a>
                <a onClick={() => handleStatusChange('Dang o')}>Đang ở</a>
                <a onClick={() => handleStatusChange('Den han')}>Đến hạn</a>
                <a onClick={() => handleStatusChange('Da tra phong')}>Đã trả phòng</a>
                <a onClick={() => handleStatusChange('Da huy')}>Đã hủy</a>
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
                <button className="assign-button" onClick={openModal}>
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
                            <th>{['Da xep', 'Dang o', 'Den han','Da tra phong'].includes(currentStatus) ? 'Phòng' : 'Loại phòng'}</th>
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
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedTTDPs.includes(ttdp)}
                                            onChange={() => handleCheckboxChange(ttdp)}
                                        />
                                    </td>
                                    <td onClick={() => handleDatPhongClick(ttdp.maDatPhong)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maDatPhong}
                                    </td>
                                    <td onClick={() => handleTTDPClick(ttdp.maThongTinDatPhong)} style={{ cursor: 'pointer', color: 'blue' }}>
                                        {ttdp.maThongTinDatPhong}
                                    </td>
                                    <td>{ttdp.tenKhachHang}</td>
                                    <td>{ttdp.soNguoi}</td>
                                    <td>
                                        {['Da xep', 'Dang o', 'Den han','Da tra phong'].includes(currentStatus)
                                            ? (phongData[ttdp.maThongTinDatPhong]?.phong.tenPhong || "Đang tải...")
                                            : ttdp.loaiPhong.tenLoaiPhong}
                                    </td>
                                    <td>{ttdp.ngayNhanPhong}</td>
                                    <td>{ttdp.ngayTraPhong}</td>
                                    <td>{calculateTotalPrice(ttdp.donGia, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()}</td>
                                    <td>
                                        {currentStatus === 'Chua xep' ? (
                                            <>
                                                <button onClick={() => openXepPhongModal(ttdp)}>Assign</button>
                                                <button onClick={() => handleHuyTTDPClick(ttdp.maThongTinDatPhong, currentStatus)} style={{ marginLeft: '10px' }}>Hủy</button>
                                            </>
                                        ) : currentStatus === 'Da xep' ? (
                                            <>
                                                <button onClick={() => handleCheckIn(ttdp.maThongTinDatPhong)}>Checkin</button>
                                                <button onClick={() => handleHuyTTDPClick(ttdp.maThongTinDatPhong, currentStatus)} style={{ marginLeft: '10px' }}>Hủy</button>
                                            </>
                                        ) : currentStatus === 'Dang o' ? (
                                            <>
                                                <button onClick={() => handleCheckOut(ttdp.maThongTinDatPhong)}>Checkout</button>
                                            </>
                                        ) : currentStatus === 'Den han' ? (
                                            <>
                                                <button onClick={() => handleCheckOut(ttdp.maThongTinDatPhong)}>Checkout</button>
                                            </>
                                        ) : null
                                        }
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
            <XepPhong show={showXepPhongModal} handleClose={closeXepPhongModal} selectedTTDPs={selectedTTDPs} />
        </div>
    );
}

export default QuanLyDatPhong;
