import React from 'react'
import './NavDatPhongCSS.css'
const NavDatPhong = () => {
    return (
        <div className="vertical-bar">
            <button>
                Tạo đặt phòng
            </button>

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

    )
}

export default NavDatPhong