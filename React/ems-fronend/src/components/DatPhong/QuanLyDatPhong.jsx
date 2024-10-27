import React from 'react';
import './QuanLyDatPhong.scss'
function QuanLyDatPhong() {
    return (
        <div className="reservation">
            <h2>Reservation</h2>
            <nav>
                <a href="#unassigned" className="active">Unassigned</a>
                <a href="#arrival">Arrival</a>
                <a href="#in-house">In-House</a>
                <a href="#due-out">Due Out</a>
                <a href="#checked-out">Checked-Out</a>
                <a href="#canceled">Canceled</a>
                <a href="#no-show">No Show</a>
            </nav>

            <div className="filters">
                <input type="text" placeholder="Search..." className="search-bar" />
                <input type="date" placeholder="Start Date" />
                <input type="date" placeholder="End Date" />
            </div>

            <div className="reservation-list">
                <button className="assign-button" disabled>
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
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuanLyDatPhong;
