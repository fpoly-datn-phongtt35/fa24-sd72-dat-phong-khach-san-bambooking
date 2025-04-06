// HotelBookingConfirmation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingConfirmation.css"; // Tạo file CSS riêng nếu cần

const HotelBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCombination = location.state?.selectedCombination;
  const checkInDate = location.state?.checkInDate;
  const checkOutDate = location.state?.checkOutDate;

  // State cho thông tin người đặt
  const [bookingInfo, setBookingInfo] = useState({
    ho: "",
    ten: "",
    soDienThoai: "",
    email: "",
  });

  // State cho trạng thái gửi form
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ở đây bạn có thể thêm logic gửi dữ liệu lên server
    try {
      // Ví dụ: const response = await api.bookRoom(bookingInfo, selectedCombination);
      console.log("Thông tin đặt phòng:", {
        ...bookingInfo,
        selectedCombination,
        checkInDate,
        checkOutDate,
      });

      // Chuyển hướng về trang thành công hoặc trang chính
      alert("Đặt phòng thành công!");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      alert("Đã xảy ra lỗi khi đặt phòng, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedCombination) {
    return <div>Không có thông tin đặt phòng được chọn.</div>;
  }

  return (
    <div className="confirmation-container">
      {/* Header */}
      <div className="confirmation-header">
        <h1>Xác Nhận Đặt Phòng</h1>
        <p>Vui lòng kiểm tra thông tin và điền đầy đủ chi tiết</p>
      </div>

      {/* Thông tin tổ hợp phòng */}
      <div className="room-details">
        <h2>Thông tin phòng đã chọn</h2>
        <div className="room-option">
          <div className="room-header">
            <h3>
              Tổng sức chứa: {selectedCombination.tongSucChua} người - Tổng chi
              phí: {Number(selectedCombination.tongChiPhi).toLocaleString()} VND
              - Tổng số phòng: {selectedCombination.tongSoPhong}
            </h3>
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
              {selectedCombination.phongs.map((phong, idx) => (
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
          <div className="date-info">
            <p>Ngày nhận phòng: {checkInDate} (12:00)</p>
            <p>Ngày trả phòng: {checkOutDate} (14:00)</p>
          </div>
        </div>
      </div>

      {/* Form thông tin người đặt */}
      <form className="booking-info-form" onSubmit={handleSubmit}>
        <h2>Thông tin người đặt</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Họ *</label>
            <input
              type="text"
              name="ho"
              value={bookingInfo.ho}
              onChange={handleInputChange}
              required
              placeholder="Nhập họ"
            />
          </div>
          <div className="form-group">
            <label>Tên *</label>
            <input
              type="text"
              name="ten"
              value={bookingInfo.ten}
              onChange={handleInputChange}
              required
              placeholder="Nhập tên"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="soDienThoai"
              value={bookingInfo.soDienThoai}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              placeholder="Nhập số điện thoại (10 số)"
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={bookingInfo.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
          <button type="submit" className="confirm-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelBookingConfirmation;
