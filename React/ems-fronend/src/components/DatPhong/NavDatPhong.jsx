import React, { useState } from 'react';
import './NavDatPhongCSS.css';
import FormAdd from './FormAdd';

const NavDatPhong = () => {
    const [show, setShow] = useState(false); // Quản lý trạng thái hiển thị form

    const handleOpenForm = () => {
        setShow(true); // Mở form
    };

    const handleCloseForm = () => {
        setShow(false); // Đóng form
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
                    <input type="checkbox" value="confirmed" />
                    Đã xác nhận
                </label>
                <label>
                    <input type="checkbox" value="unconfirmed" />
                    Chưa xác nhận
                </label>
                <label>
                    <input type="checkbox" value="pending" />
                    Đang chờ xử lý
                </label>
                <label>
                    <input type="checkbox" value="canceled" />
                    Đã hủy
                </label>
            </div>
        </div>
    );
};

export default NavDatPhong;
