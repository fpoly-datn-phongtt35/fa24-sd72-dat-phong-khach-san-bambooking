import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavPhong.css';

const NavPhong = () => {
    return (
        <div className="vertical-bar">
            <div className="filter-section">
                <h5>Loại phòng</h5>
                <label className="filter-label">
                    <span>Loại phòng:</span>
                    <input type="checkbox" value="Confirmed"/>
                </label>

                <h5>Tiện ích</h5>
                <label className="filter-label">
                    <span>Tiện ích:</span>
                    <input type="checkbox" value="Confirmed"/>
                </label>

                <h5>Dịch vụ đi kèm</h5>
                <label className="filter-label">
                    <span>Dịch vụ đi kèm:</span>
                    <input type="checkbox" value="Confirmed"/>
                </label>
            </div>
        </div>



    );
};

export default NavPhong;
