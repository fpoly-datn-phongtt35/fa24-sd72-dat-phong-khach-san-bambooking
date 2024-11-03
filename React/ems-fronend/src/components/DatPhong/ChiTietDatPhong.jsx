import React, { useEffect, useState } from 'react';
import './ChiTietDatPhong.scss';
import { useLocation ,useNavigate} from 'react-router-dom';
import { findTTDPByMaDatPhong } from '../../services/TTDP';
import { findDatPhongByMaDatPhong,CapNhatDatPhong } from '../../services/DatPhong';
const ChiTietDatPhong = () => {
    const [datPhong, setDatPhong] = useState();
    const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
    const location = useLocation();
    const { maDatPhong } = location.state || {};
    const navigate = useNavigate();
    const getDetailDatPhong = (maDatPhong) => {
        findDatPhongByMaDatPhong(maDatPhong)
            .then((response) => {
                console.log(response.data)
                setDatPhong(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        findTTDPByMaDatPhong(maDatPhong)
            .then((response) => {
                setThongTinDatPhong(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error)
            });
    };
    const updateDatPhong = () =>{
        CapNhatDatPhong(datPhong)
        .then((response) => {
            console.log(response.data)
            alert("Lưu thành công")
        })
        .catch((error) => {
            console.log(error)
        })
        
    }
    useEffect(() => {
        if (maDatPhong) {
            getDetailDatPhong(maDatPhong);
        }
    }, [maDatPhong]);
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
    const calculateTotalGuests = () => {
        return thongTinDatPhong.reduce((total, ttdp) => total + ttdp.soNguoi, 0);
    };
    const calculateTotalDays = () => {
        if (thongTinDatPhong.length === 0) return 0;

        const dates = thongTinDatPhong.map(ttdp => ({
            start: new Date(ttdp.ngayNhanPhong),
            end: new Date(ttdp.ngayTraPhong),
        }));

        const minDate = new Date(Math.min(...dates.map(d => d.start)));
        const maxDate = new Date(Math.max(...dates.map(d => d.end)));

        const diffTime = Math.abs(maxDate - minDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays === 0 ? 1 : diffDays;
    };

    return (
        <div className="booking-info-container">
            {/* Các box chính nằm trên cùng một dòng */}
            <div className="flex-row">
                <div className="box booker-info">
                    <h3>Thông tin người đặt</h3>
                    <div className="info-item">
                        <label>Tên khách đặt</label>
                        <span>{datPhong?.khachHang?.ho + ' ' + datPhong?.khachHang?.ten || "N/A"}</span>
                    </div>
                    <div className="info-item">
                        <label>Địa chỉ Email</label>
                        <span>{datPhong?.khachHang?.email || "N/A"}</span>
                    </div>
                    <div className="info-item">
                        <label>Số điện thoại</label>
                        <span>{datPhong?.khachHang?.sdt || "N/A"}</span>
                    </div>
                </div>

                <div className="box booking-info">
                    <h3>Thông tin đặt phòng</h3>
                    <div className="info-item">
                        <label>Ngày đặt</label>
                        <span>{datPhong?.ngayDat}</span>
                    </div>
                    <div className="info-item">
                        <label>Số ngày</label>
                        <span>{calculateTotalDays()}</span>
                    </div>
                    <div className="info-item">
                        <label>Số phòng</label>
                        <span>{thongTinDatPhong.length}</span>
                    </div>
                    <div className="info-item">
                        <label>Số người</label>
                        <span>{calculateTotalGuests()}</span>
                    </div>
                    <div className="info-item">
                        <label>Tổng tiền</label>
                        <span className="highlight">{datPhong?.tongTien}</span>
                    </div>
                </div>

                <div className="box booker-comment">
                    <h3>Ghi chú</h3>
                    <input type="text-area" value={datPhong?.ghiChu} placeholder="Nhập ghi chú ở đây..." />
                </div>
            </div>

            {/* Danh sách phòng nằm ở dòng dưới */}
            <div className="box booker-rooms">
                <h3>Danh sách phòng</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Select</th>
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
                        {thongTinDatPhong.length > 0 ? (
                            thongTinDatPhong.map((ttdp) => (
                                <tr key={ttdp.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>{ttdp.maThongTinDatPhong}</td>
                                    <td>{ttdp?.datPhong?.khachHang?.ho + ' ' + ttdp?.datPhong?.khachHang?.ten}</td>
                                    <td>{ttdp.soNguoi}</td>
                                    <td>{ttdp?.loaiPhong?.tenLoaiPhong}</td>
                                    <td>{ttdp.ngayNhanPhong}</td>
                                    <td>{ttdp.ngayTraPhong}</td>
                                    <td>{calculateTotalPrice(ttdp.giaDat, ttdp.ngayNhanPhong, ttdp.ngayTraPhong).toLocaleString()}</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Delete</button>
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
                <div className="button-container">
                    <button className="button-save">Lưu</button>
                    <button className="button-checkin">Checkin</button>
                </div>
            </div>
        </div>
    );
};

export default ChiTietDatPhong;
