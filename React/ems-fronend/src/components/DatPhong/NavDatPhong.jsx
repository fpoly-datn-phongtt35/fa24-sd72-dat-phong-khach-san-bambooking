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
        <div className="vertical-bar">
            <button onClick={handleOpenForm}>
                Tạo đặt phòng
            </button>

            {/* Hiển thị FormAdd khi show là true */}
            {show && <FormAdd show={show} handleClose={handleCloseForm} />}


            <div>
                <h5>Trạng thái</h5>
                <label>
                    <input type="checkbox" value="confirmed" checked={filters.confirmed} onChange={handleFilterChange} />
                    Đã xác nhận
                </label>
                <label>
                    <input type="checkbox" value="unconfirmed" checked={filters.unconfirmed} onChange={handleFilterChange} />
                    Chưa xác nhận
                </label>
                <label>
                    <input type="checkbox" value="processing" checked={filters.processing} onChange={handleFilterChange} />
                    Đang chờ xử lý
                </label>
                <label>
                    <input type="checkbox" value="canceled" checked={filters.canceled} onChange={handleFilterChange} />

                    Đã hủy
                </label>
            </div>
        </div>
    );
};

export default NavDatPhong;
