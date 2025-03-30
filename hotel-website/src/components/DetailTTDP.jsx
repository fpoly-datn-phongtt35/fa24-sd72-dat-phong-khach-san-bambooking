import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTTDPByidDatPhong } from '../services/TTDP.js';
import { getDichVuSuDung, getHoaDonById, getThongTinHoaDonByHoaDonId, getPhuThuByHoaDonId, getHDByidDatPhong } from "../services/InfoHoaDon";
import '../styles/DetailTTDP.css'; // Import file CSS

export default function DetailTTDP() {
    const [bookings, setBookings] = useState([]);
    const [hoaDon, setHoaDon] = useState(null);
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [dichVuSuDung, setDichVuSuDung] = useState([]);
    const [phuThu, setPhuThu] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const { idDatPhong } = useParams();
    const navigate = useNavigate();
    const statusClassMap = {
        "Chờ xác nhận": "choxacnhan",
        "Chưa thanh toán": "chuathanhtoan",
        "Đã thanh toán": "dathanhtoan",
    };

    useEffect(() => {
        fetchData();
    }, [idDatPhong]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const bookingResponse = await getTTDPByidDatPhong(idDatPhong);
            setBookings(Array.isArray(bookingResponse.data) ? bookingResponse.data : [bookingResponse.data]);
            const hoaDonResponse = await getHDByidDatPhong(idDatPhong);
            const hoaDonData = hoaDonResponse?.data || null;
            setHoaDon(hoaDonData);

            if (hoaDonData && hoaDonData.id) {
                const [thongTinHoaDonResponse, dichVuSuDungResponse, phuThuResponse, hoaDonByIdResponse] = await Promise.all([
                    getThongTinHoaDonByHoaDonId(hoaDonData.id),
                    getDichVuSuDung(hoaDonData.id),
                    getPhuThuByHoaDonId(hoaDonData.id),
                    getHoaDonById(hoaDonData.id)
                ]);

                setThongTinHoaDon(thongTinHoaDonResponse?.data || []);
                setDichVuSuDung(dichVuSuDungResponse?.data || []);
                setPhuThu(phuThuResponse?.data || []);
                setHoaDon(hoaDonByIdResponse?.data || hoaDonData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const handleExpand = (maPhong) => {
        setExpanded(expanded === maPhong ? null : maPhong);
    };

    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusClass = (trangThai) => {
        return statusClassMap[trangThai];
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Chi Tiết Đặt Phòng</h2>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <span>←</span> Quay Lại
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải dữ liệu...</div>
            ) : (
                <div className="content">
                    <section className="card">
                        <h3>Thông Tin Đặt Phòng</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã TTDP</th>
                                    <th>Số Người</th>
                                    <th>Giá Đặt</th>
                                    <th>Ngày Nhận</th>
                                    <th>Ngày Trả</th>
                                    <th>Ghi Chú</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.maThongTinDatPhong}</td>
                                        <td>{booking.soNguoi}</td>
                                        <td>{booking.giaDat.toLocaleString()} VNĐ</td>
                                        <td>{new Date(booking.ngayNhanPhong).toLocaleDateString()}</td>
                                        <td>{new Date(booking.ngayTraPhong).toLocaleDateString()}</td>
                                        <td>{booking.ghiChu}</td>
                                        <td>
                                            <span >
                                                {booking.trangThai}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {hoaDon ? (
                        <section className="card invoice-info">
                            <h3>Thông Tin Hóa Đơn</h3>
                            <div className="invoice-details">
                                <div className="detail-item">
                                    <span className="label">Mã Hóa Đơn:</span>
                                    <span>{hoaDon.maHoaDon}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Mã Đặt Phòng:</span>
                                    <span>{hoaDon.maDatPhong}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Tổng Tiền:</span>
                                    <span className="total">{formatCurrency(hoaDon.tongTien)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Trạng Thái:</span>
                                    <span className={`status ${getStatusClass(hoaDon.trangThai)}`}>
                                        {hoaDon.trangThai}
                                    </span>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="card">
                            <p className="no-invoice">Chưa có hóa đơn</p>
                        </section>
                    )}
                    {thongTinHoaDon && thongTinHoaDon.length > 0 &&(
                        <section className="card">
                            <h3>Chi Tiết Hóa Đơn</h3>
                            <table className="table expandable">
                                <thead>
                                    <tr>
                                        <th>Tên Phòng</th>
                                        <th>Ngày Nhận Phòng</th>
                                        <th>Ngày Trả Phòng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thongTinHoaDon.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr onClick={() => handleExpand(item.tenPhong)} style={{ cursor: 'pointer' }}>
                                                <td>{item.tenPhong}</td>
                                                <td>{item.ngayNhanPhong}</td>
                                                <td>{item.ngayTraPhong}</td>
                                            </tr>
                                            {expanded === item.tenPhong && (
                                                <tr>
                                                    <td colSpan="3">
                                                        <div className="expanded-details">
                                                            <h4>Tiền Phòng</h4>
                                                            <table className="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Số Ngày Ở</th>
                                                                        <th>Giá Phòng</th>
                                                                        <th>Tiền Phòng</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{calculateDays(item.ngayNhanPhong, item.ngayTraPhong)}</td>
                                                                        <td>{formatCurrency(item.giaPhong)}</td>
                                                                        <td>{formatCurrency(item.tienPhong)}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                            {dichVuSuDung.some(dv => dv.tenPhong === item.tenPhong) && (
                                                                <>
                                                                    <h4>Dịch Vụ Sử Dụng</h4>
                                                                    <table className="table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Tên Dịch Vụ</th>
                                                                                <th>Giá Dịch Vụ</th>
                                                                                <th>Số Lượng</th>
                                                                                <th>Tổng Tiền</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {dichVuSuDung.filter(dv => dv.tenPhong === item.tenPhong).map((dv, i) => (
                                                                                <tr key={i}>
                                                                                    <td>{dv.tenDichVu}</td>
                                                                                    <td>{formatCurrency(dv.giaDichVu)}</td>
                                                                                    <td>{dv.soLuongSuDung}</td>
                                                                                    <td>{formatCurrency(dv.giaDichVu * dv.soLuongSuDung)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}

                                                            {phuThu.some(pt => pt.tenPhong === item.tenPhong) && (
                                                                <>
                                                                    <h4>Phụ Thu</h4>
                                                                    <table className="table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Loại Phụ Thu</th>
                                                                                <th>Số Lượng</th>
                                                                                <th>Số Tiền</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {phuThu.filter(pt => pt.tenPhong === item.tenPhong).map((pt, i) => (
                                                                                <tr key={i}>
                                                                                    <td>{pt.tenPhuThu}</td>
                                                                                    <td>{pt.soLuong}</td>
                                                                                    <td>{formatCurrency(pt.tienPhuThu)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}