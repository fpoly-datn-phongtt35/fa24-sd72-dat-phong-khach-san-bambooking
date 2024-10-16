import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavDatPhongCSS.css';

const NavDatPhong = ({ onFilterChange }) => {
    const [show, setShow] = useState(false); // Quản lý trạng thái hiển thị form
    const navigate = useNavigate(); // Sử dụng hook để điều hướng

    const handleCreateBooking = () => {
        navigate('/tao-dat-phong'); // Điều hướng đến trang tạo đặt phòng
    };

    const [filters, setFilters] = useState({
        Confirmed: false,
        Unconfirmed: false,
        Processing: false,
        Canceled: false
    });

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
        <div className="vertical-bar">
    <button className="create-booking-btn" onClick={handleCreateBooking}>
        Tạo đặt phòng
    </button>

    <div className="filter-section">
        <h5>Trạng thái</h5>
        <label className="filter-label">
            <span>Đã xác nhận:</span>
            <input type="checkbox" value="Confirmed" checked={filters.Confirmed} onChange={handleFilterChange} />
        </label>
        <label className="filter-label">
            <span>Chưa xác nhận:</span>
            <input type="checkbox" value="Unconfirmed" checked={filters.Unconfirmed} onChange={handleFilterChange} />
        </label>
        <label className="filter-label">
            <span>Đang chờ xử lý:</span>
            <input type="checkbox" value="Processing" checked={filters.Processing} onChange={handleFilterChange} />
        </label>
        <label className="filter-label">
            <span>Đã hủy:</span>
            <input type="checkbox" value="Canceled" checked={filters.Canceled} onChange={handleFilterChange} />
        </label>
    </div>
</div>



    );
};

export default NavDatPhong;
