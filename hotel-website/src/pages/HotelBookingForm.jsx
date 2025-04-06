// HotelBookingForm.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingForm.css";
import {
  toHopLoaiPhong,
  ThemKhachHangDatPhong,
  ThemMoiDatPhong,
  addThongTinDatPhong,
} from "../services/DatPhong";
import dayjs from "dayjs";

const HotelBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // State cho form chính
  const [ngayNhanPhong, setNgayNhanPhong] = useState(
    location.state?.ngayNhanPhong || ""
  );
  const [ngayTraPhong, setNgayTraPhong] = useState(
    location.state?.ngayTraPhong || ""
  );
  const [soNguoi, setSoNguoi] = useState(location.state?.adults || 1);

  // State cho bộ lọc nâng cao
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tongChiPhiMin, setTongChiPhiMin] = useState("");
  const [tongChiPhiMax, setTongChiPhiMax] = useState("");
  const [tongSucChuaMin, setTongSucChuaMin] = useState("");
  const [tongSucChuaMax, setTongSucChuaMax] = useState("");
  const [tongSoPhongMin, setTongSoPhongMin] = useState("");
  const [tongSoPhongMax, setTongSoPhongMax] = useState("");
  const [key, setKey] = useState("");
  const handleAdultChange = (change) => {
    setSoNguoi((prev) => Math.max(1, prev + change));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const ngayNhanPhongFormatted = ngayNhanPhong
      ? dayjs(ngayNhanPhong).hour(12).minute(0).second(0).toISOString()
      : null;
    const ngayTraPhongFormatted = ngayTraPhong
      ? dayjs(ngayTraPhong).hour(14).minute(0).second(0).toISOString()
      : null;

    const pageable = { page: currentPage, size: pageSize };

    try {
      const response = await toHopLoaiPhong(
        ngayNhanPhongFormatted,
        ngayTraPhongFormatted,
        soNguoi,
        key || null,
        tongChiPhiMin || null,
        tongChiPhiMax || null,
        tongSucChuaMin || null,
        tongSucChuaMax || null,
        tongSoPhongMin || null,
        tongSoPhongMax || null,
        [],
        pageable
      );

      setLoaiPhongKhaDung(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error) {
      console.error("Lỗi khi lấy tổ hợp phòng:", error);
      alert("Đã xảy ra lỗi khi tải dữ liệu, vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (ngayNhanPhong && ngayTraPhong && soNguoi) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [currentPage]);

  const handleCreateBooking = async (combination) => {
    let khachHangResponse = null;
    let datPhongResponse = null;
    let thongTinDatPhongResponseList = [];
    try {
      const khachHangRequest = {
        ho: "",
        ten: "",
        email: "",
        sdt: "",
        trangThai: false,
      };
      khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể tạo khách hàng.");
      }

      const datPhongRequest = {
        khachHang: khachHangResponse.data,
        maDatPhong: "DP" + new Date().getTime(),
        soNguoi: soNguoi,
        soPhong: combination.tongSoPhong,
        ngayDat: new Date().toISOString(),
        tongTien: combination.tongChiPhi,
        ghiChu: "Đặt phòng từ tổ hợp được chọn",
        trangThai: "Đang đặt phòng",
      };
      datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể tạo đặt phòng.");
      }

      for (const phong of combination.phongs) {
        if (phong.soLuongChon > 0) {
          for (let i = 0; i < phong.soLuongChon; i++) {
            const thongTinDatPhongRequest = {
              datPhong: datPhongResponse.data,
              idLoaiPhong: phong.loaiPhong.id,
              maThongTinDatPhong: "",
              ngayNhanPhong: ngayNhanPhong,
              ngayTraPhong: ngayTraPhong,
              soNguoi: phong.loaiPhong.soKhachToiDa,
              giaDat: phong.loaiPhong.donGia,
              trangThai: "Đang đặt phòng",
            };
            const response = await addThongTinDatPhong(thongTinDatPhongRequest);
            if (!response || !response.data) {
              throw new Error("Không thể tạo thông tin đặt phòng.");
            }
            thongTinDatPhongResponseList.push(response.data);
          }
        }
      }
      navigate("/booking-confirmation", {
        state: {
          combination: combination,
          datPhong: datPhongResponse.data,
          khachHang: khachHangResponse.data,
          thongTinDatPhong: thongTinDatPhongResponseList,
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo đặt phòng:", error);
    }
  };

  return (
    <div className="booking-container">
      {/* Header */}
      <div className="booking-header">
        <h1>Đặt Phòng Khách Sạn</h1>
        <p>Tìm kiếm phòng nhanh chóng với giá tốt nhất</p>
      </div>

      {/* Form */}
      <form className="booking-form" onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label>Ngày nhận phòng (12:00)</label>
            <input
              type="date"
              value={ngayNhanPhong}
              onChange={(e) => setNgayNhanPhong(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày trả phòng (14:00)</label>
            <input
              type="date"
              value={ngayTraPhong}
              onChange={(e) => setNgayTraPhong(e.target.value)}
              required
            />
          </div>
          <div className="form-group guest-group">
            <label>Số người</label>
            <div className="guest-counter">
              <button type="button" onClick={() => handleAdultChange(-1)}>
                -
              </button>
              <span>{soNguoi}</span>
              <button type="button" onClick={() => handleAdultChange(1)}>
                +
              </button>
            </div>
          </div>
          <button type="submit" className="search-btn">
            Tìm kiếm
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <button
            type="button"
            className="toggle-filters"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
          </button>
          {showAdvancedFilters && (
            <div className="filter-grid">
              <div className="form-group">
                <label>Tổng chi phí tối thiểu (VND)</label>
                <input
                  type="number"
                  value={tongChiPhiMin}
                  onChange={(e) => setTongChiPhiMin(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Tổng chi phí tối đa (VND)</label>
                <input
                  type="number"
                  value={tongChiPhiMax}
                  onChange={(e) => setTongChiPhiMax(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Tổng sức chứa tối thiểu</label>
                <input
                  type="number"
                  value={tongSucChuaMin}
                  onChange={(e) => setTongSucChuaMin(e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Tổng sức chứa tối đa</label>
                <input
                  type="number"
                  value={tongSucChuaMax}
                  onChange={(e) => setTongSucChuaMax(e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Tổng số phòng tối thiểu</label>
                <input
                  type="number"
                  value={tongSoPhongMin}
                  onChange={(e) => setTongSoPhongMin(e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Tổng số phòng tối đa</label>
                <input
                  type="number"
                  value={tongSoPhongMax}
                  onChange={(e) => setTongSoPhongMax(e.target.value)}
                  min="1"
                />
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Results */}
      <div className="results-section">
        <h2>Các lựa chọn phòng khả dụng</h2>
        {loaiPhongKhaDung.length > 0 ? (
          loaiPhongKhaDung.map((combination, combIndex) => (
            <div key={combIndex} className="room-option">
              <div className="room-header">
                <h3>
                  Tổ hợp {combIndex + 1}: {combination.tongSucChua} người -{" "}
                  {Number(combination.tongChiPhi).toLocaleString()} VND -{" "}
                  {combination.tongSoPhong} phòng
                </h3>
                <button
                  className="book-btn"
                  onClick={() => handleCreateBooking(combination)}
                >
                  Đặt phòng
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Loại phòng</th>
                    <th>Diện tích</th>
                    <th>Số khách</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {combination.phongs.map((phong, idx) => (
                    <tr key={phong.loaiPhong.id}>
                      <td>{idx + 1}</td>
                      <td>{phong.loaiPhong.tenLoaiPhong}</td>
                      <td>{phong.loaiPhong.dienTich} m²</td>
                      <td>{phong.loaiPhong.soKhachToiDa}</td>
                      <td>{phong.loaiPhong.donGia.toLocaleString()} VND</td>
                      <td>{phong.soLuongChon}</td>
                      <td>
                        {(
                          phong.soLuongChon * phong.loaiPhong.donGia
                        ).toLocaleString()}{" "}
                        VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="no-results">Không tìm thấy tổ hợp phòng nào phù hợp.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingForm;
