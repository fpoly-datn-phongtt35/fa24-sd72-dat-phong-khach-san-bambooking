import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTTDPByidDatPhong } from "../services/TTDP.js";
import {
  getDichVuSuDung,
  getHoaDonById,
  getThongTinHoaDonByHoaDonId,
  getPhuThuByHoaDonId,
  getHDByidDatPhong,
} from "../services/InfoHoaDon";
import "../styles/DetailTTDP.css";

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
    "Chờ xác nhận": "status-pending",
    "Chưa thanh toán": "status-unpaid",
    "Đã thanh toán": "status-paid",
  };

  useEffect(() => {
    fetchData();
  }, [idDatPhong]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const bookingResponse = await getTTDPByidDatPhong(idDatPhong);
      setBookings(
        Array.isArray(bookingResponse.data)
          ? bookingResponse.data
          : [bookingResponse.data]
      );
      const hoaDonResponse = await getHDByidDatPhong(idDatPhong);
      const hoaDonData = hoaDonResponse?.data || null;
      setHoaDon(hoaDonData);

      if (hoaDonData && hoaDonData.id) {
        const [
          thongTinHoaDonResponse,
          dichVuSuDungResponse,
          phuThuResponse,
          hoaDonByIdResponse,
        ] = await Promise.all([
          getThongTinHoaDonByHoaDonId(hoaDonData.id),
          getDichVuSuDung(hoaDonData.id),
          getPhuThuByHoaDonId(hoaDonData.id),
          getHoaDonById(hoaDonData.id),
        ]);

        setThongTinHoaDon(thongTinHoaDonResponse?.data || []);
        setDichVuSuDung(dichVuSuDungResponse?.data || []);
        setPhuThu(phuThuResponse?.data || []);
        setHoaDon(hoaDonByIdResponse?.data || hoaDonData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  const handleExpand = (maPhong) =>
    setExpanded(expanded === maPhong ? null : maPhong);
  const calculateDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  const getStatusClass = (trangThai) => statusClassMap[trangThai];

  return (
    <div className="ttdp-container">
      <div className="ttdp-header">
        <h2>Chi Tiết Đặt Phòng</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Quay Lại
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="ttdp-content">
          <section className="card">
            <h3>Thông Tin Đặt Phòng</h3>
            <table className="info-table">
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
                    <td>{formatCurrency(booking.giaDat)}</td>
                    <td>
                      {new Date(booking.ngayNhanPhong).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(booking.ngayTraPhong).toLocaleDateString()}
                    </td>
                    <td>{booking.ghiChu}</td>
                    <td>
                      <span
                        className={`status-label ${getStatusClass(
                          booking.trangThai
                        )}`}
                      >
                        {booking.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {hoaDon ? (
            <section className="card">
              <h3>Thông Tin Hóa Đơn</h3>
              <div className="invoice-section">
                <div>
                  <strong>Mã Hóa Đơn:</strong> {hoaDon.maHoaDon}
                </div>
                <div>
                  <strong>Mã Đặt Phòng:</strong> {hoaDon.maDatPhong}
                </div>
                <div>
                  <strong>Tổng Tiền:</strong>{" "}
                  <span className="highlighted">
                    {formatCurrency(hoaDon.tongTien)}
                  </span>
                </div>
                <div>
                  <strong>Trạng Thái:</strong>{" "}
                  <span
                    className={`status-label ${getStatusClass(
                      hoaDon.trangThai
                    )}`}
                  >
                    {hoaDon.trangThai}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <section className="card">
              <p className="text-center">Chưa có hóa đơn</p>
            </section>
          )}

          {thongTinHoaDon.length > 0 && (
            <section className="card">
              <h3>Chi Tiết Hóa Đơn</h3>
              <table className="info-table expandable">
                <thead>
                  <tr>
                    <th>Tên Phòng</th>
                    <th>Ngày Nhận</th>
                    <th>Ngày Trả</th>
                  </tr>
                </thead>
                <tbody>
                  {thongTinHoaDon.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr onClick={() => handleExpand(item.tenPhong)}>
                        <td>{item.tenPhong}</td>
                        <td>{item.ngayNhanPhong}</td>
                        <td>{item.ngayTraPhong}</td>
                      </tr>
                      {expanded === item.tenPhong && (
                        <tr className="expand-row">
                          <td colSpan="3">
                            <div className="expand-content">
                              <div className="section">
                                <h4>Tiền Phòng</h4>
                                <p>
                                  Số Ngày Ở:{" "}
                                  {calculateDays(
                                    item.ngayNhanPhong,
                                    item.ngayTraPhong
                                  )}
                                </p>
                                <p>
                                  Giá Phòng: {formatCurrency(item.giaPhong)}
                                </p>
                                <p>
                                  Tiền Phòng: {formatCurrency(item.tienPhong)}
                                </p>
                              </div>

                              {dichVuSuDung.some(
                                (dv) => dv.tenPhong === item.tenPhong
                              ) && (
                                <div className="section">
                                  <h4>Dịch Vụ Sử Dụng</h4>
                                  {dichVuSuDung
                                    .filter(
                                      (dv) => dv.tenPhong === item.tenPhong
                                    )
                                    .map((dv, i) => (
                                      <p key={i}>
                                        {dv.tenDichVu} - SL: {dv.soLuongSuDung}{" "}
                                        - Tổng:{" "}
                                        {formatCurrency(
                                          dv.giaDichVu * dv.soLuongSuDung
                                        )}
                                      </p>
                                    ))}
                                </div>
                              )}

                              {phuThu.some(
                                (pt) => pt.tenPhong === item.tenPhong
                              ) && (
                                <div className="section">
                                  <h4>Phụ Thu</h4>
                                  {phuThu
                                    .filter(
                                      (pt) => pt.tenPhong === item.tenPhong
                                    )
                                    .map((pt, i) => (
                                      <p key={i}>
                                        {pt.tenPhuThu} - SL: {pt.soLuong} - Số
                                        Tiền: {formatCurrency(pt.tienPhuThu)}
                                      </p>
                                    ))}
                                </div>
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
