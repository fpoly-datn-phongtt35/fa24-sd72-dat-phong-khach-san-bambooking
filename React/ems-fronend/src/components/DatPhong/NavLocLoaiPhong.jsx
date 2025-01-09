import React, { useState, useEffect } from 'react';
import './NavLocLoaiPhong.scss';
const NavLocLoaiPhong = () => {
    return (
        <div className="vertical-bar">
            <div className="filter-section">
                <h5 className="filter-title">Tiện ích</h5>
                <label className="filter-label">
                    <span>Tiện ích:</span>
                    <input type="checkbox" value="Confirmed" />
                </label>

                <h5 className="filter-title">Dịch vụ đi kèm</h5>
                <label className="filter-label">
                    <span>Dịch vụ đi kèm:</span>
                    <input type="checkbox" value="Confirmed" />
                </label>
            </div>
        </div>
    );
};

export default NavLocLoaiPhong;
