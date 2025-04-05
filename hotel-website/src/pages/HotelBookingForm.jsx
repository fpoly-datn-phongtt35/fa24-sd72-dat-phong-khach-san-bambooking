// HotelBookingForm.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/HotelBookingForm.css";

const HotelBookingForm = () => {
  const location = useLocation();
  const [loaiPhongKhaDung, setLoaiPhongKhaDung] = useState([]);

  // Khởi tạo state với giá trị mặc định từ location.state
  const [checkInDate, setCheckInDate] = useState(
    location.state?.checkInDate || ""
  );
  const [checkOutDate, setCheckOutDate] = useState(
    location.state?.checkOutDate || ""
  );
  const [adults, setAdults] = useState(location.state?.adults || 1);
  const [destination, setDestination] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      destination,
      checkInDate,
      checkOutDate,
      adults,
    });
  };

  // Hàm xử lý tăng/giảm số người lớn
  const handleAdultChange = (change) => {
    setAdults((prev) => Math.max(1, prev + change)); // Đảm bảo số người lớn không nhỏ hơn 1
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="header">
          <h1>Đặt Phòng Khách Sạn</h1>
          <p>Tìm và đặt phòng khách sạn chất lượng với giá tốt nhất</p>
        </div>

        {/* Booking Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Dates */}
            <div className="date-group">
              <div className="form-group">
                <label htmlFor="check-in">Ngày nhận phòng</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    id="check-in"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="check-out">Ngày trả phòng</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    id="check-out"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="form-group">
              <label>Số người</label>
              <div className="guests-container">
                <div className="guest-item">
                  <div>
                    <p>Số người</p>
                  </div>
                  <div className="counter">
                    <button
                      type="button"
                      onClick={() => handleAdultChange(-1)}
                      className="counter-btn"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      onClick={() => handleAdultChange(1)}
                      className="counter-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Available Room Combinations */}
        <div className="room-options">
          <h2>Các lựa chọn phòng khả dụng</h2>
          {loaiPhongKhaDung && loaiPhongKhaDung.length > 0 ? (
            loaiPhongKhaDung.map((combination, combIndex) => (
              <div key={combIndex} className="combination-box">
                <h3 className="combination-title">
                  Tổ hợp {combIndex + 1}: Tổng sức chứa{" "}
                  {combination.tongSucChua} - Tổng chi phí:{" "}
                  {Number(combination.tongChiPhi).toLocaleString()} VND - Tổng
                  số phòng: {combination.tongSoPhong}
                </h3>
                <button className="book-option-btn">Đặt phòng</button>
                <table className="room-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Loại phòng</th>
                      <th>Diện tích</th>
                      <th>Số khách tối đa</th>
                      <th>Đơn giá</th>
                      <th>Số lượng chọn</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combination.phongs.map((phong, idx) => (
                      <tr key={phong.loaiPhong.id}>
                        <td>{idx + 1}</td>
                        <td>{phong.loaiPhong.tenLoaiPhong}</td>
                        <td>{phong.loaiPhong.dienTich} m²</td>
                        <td>{phong.loaiPhong.soKhachToiDa} khách</td>
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
            <p className="no-options">
              Không tìm thấy tổ hợp phòng nào phù hợp.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBookingForm;
