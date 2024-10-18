import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavDatPhongCSS.scss';

const NavDatPhong = ({ onFilterChange }) => {
    const [show, setShow] = useState(false); // Quản lý trạng thái hiển thị form
    const [filters, setFilters] = useState({
        Confirmed: false,
        Unconfirmed: false,
        Processing: false,
        Canceled: false
    });
    const navigate = useNavigate(); // Sử dụng hook để điều hướng

    const handleCreateBooking = () => {
        navigate('/tao-dat-phong'); // Điều hướng đến trang tạo đặt phòng
    };

    const handleOpenForm = () => {
        setShow(true); // Mở form
    };

    const handleCloseForm = () => {
        setShow(false); // Đóng form
    };

    const handleFilterChange = (event) => {
        const { value, checked } = event.target;
        const updatedFilters = {
            ...filters,
            [value]: checked
        };
        setFilters(updatedFilters);

        // Gọi hàm onFilterChange được truyền từ DanhSach
        const selectedStatuses = Object.keys(updatedFilters).filter(
            (key) => updatedFilters[key]
        );
        onFilterChange(selectedStatuses);
    };

    return (
        <div className="vertical-bar-datphong">
            <button className="create-booking-btn" onClick={handleCreateBooking}>
                Tạo đặt phòng
            </button>

            {/* Hiển thị FormAdd khi show là true */}
            {show && <FormAdd show={show} handleClose={handleCloseForm} />}

            <div className="filter-section">
                <h5>Trạng thái</h5>
                <label className="filter-label">
                    <span>Đã xác nhận:</span>
                    <input
                        type="checkbox"
                        value="Confirmed"
                        checked={filters.Confirmed}
                        onChange={handleFilterChange}
                    />
                </label>
                <label className="filter-label">
                    <span>Chưa xác nhận:</span>
                    <input
                        type="checkbox"
                        value="Unconfirmed"
                        checked={filters.Unconfirmed}
                        onChange={handleFilterChange}
                    />
                </label>
                <label className="filter-label">
                    <span>Đang chờ xử lý:</span>
                    <input
                        type="checkbox"
                        value="Processing"
                        checked={filters.Processing}
                        onChange={handleFilterChange}
                    />
                </label>
                <label className="filter-label">
                    <span>Đã hủy:</span>
                    <input
                        type="checkbox"
                        value="Canceled"
                        checked={filters.Canceled}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default NavDatPhong;
