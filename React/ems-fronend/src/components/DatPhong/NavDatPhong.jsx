import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavDatPhongCSS.css';

<<<<<<< HEAD

=======
>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
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
<<<<<<< HEAD


    const handleOpenForm = () => {
        setShow(true); // Mở form
    };

    const handleCloseForm = () => {
        setShow(false); // Đóng form
    };


=======

>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
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
<<<<<<< HEAD

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
=======
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



>>>>>>> 4a9d16d10993730f890375ebab567cbddfd2fb52
    );
};

export default NavDatPhong;
