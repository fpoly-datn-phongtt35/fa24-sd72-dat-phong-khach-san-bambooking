import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingConfirmation.css";
import {
  SuaKhachHangDatPhong,
  CapNhatDatPhong,
  getThongTinDatPhong,
  updateThongTinDatPhong,
  huyTTDP,
  XoaDatPhong,
  XoaKhachHangDatPhong,
  GuiEmailXacNhanDP,
} from "../services/DatPhong";
import dayjs from "dayjs";

const HotelBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { combination, datPhong, khachHang, thongTinDatPhong } =
    location.state || {};

  const [formData, setFormData] = useState({
    ho: khachHang?.ho || "",
    ten: khachHang?.ten || "",
    soDienThoai: khachHang?.sdt || "",
    email: khachHang?.email || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [ttdpData, setTtdpData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const timeoutRef = useRef(null);

  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room, index) => {
      const key = `${room.idLoaiPhong}-${room.giaDat}`;
      if (!grouped[key]) {
        grouped[key] = { ...room, soPhong: 0 };
      }
      grouped[key].soPhong += 1;
      grouped[key].id = index;
    });
    return Object.values(grouped);
  };

  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      const numberedRooms = groupAndNumberRooms(response.data);
      setTtdpData(numberedRooms);
    } catch (error) {
      alert("Lỗi khi lấy thông tin đặt phòng");
    }
  };

  const cancelBooking = async () => {
    try {
      for (const ttdp of thongTinDatPhong) {
        await huyTTDP(ttdp.maThongTinDatPhong);
      }
      alert("Đã hết thời gian xác nhận. Đặt phòng đã bị hủy.");
      navigate("/information");
    } catch (error) {
      alert("Lỗi khi hủy đặt phòng. Vui lòng thử lại.");
      navigate("/information");
    }
  };

  useEffect(() => {
    if (datPhong && thongTinDatPhong) {
      timeoutRef.current = setTimeout(cancelBooking, 300000);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => {
        clearTimeout(timeoutRef.current);
        clearInterval(timer);
      };
    }
  }, [datPhong, thongTinDatPhong]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setShowError(false);
  };

  const calculateBookingDays = (ngayNhanPhong, ngayTraPhong) => {
    const start = dayjs(ngayNhanPhong);
    const end = dayjs(ngayTraPhong);
    const diffDays = end.diff(start, "day");
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotalAmount = () => {
    return ttdpData.reduce((total, room) => {
      const days = calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong);
      return total + room.loaiPhong.donGia * days * room.soPhong;
    }, 0);
  };

  useEffect(() => {
    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    } else if (thongTinDatPhong) {
      const numberedRooms = groupAndNumberRooms(thongTinDatPhong);
      setTtdpData(numberedRooms);
    }
  }, [datPhong, thongTinDatPhong]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (ttdpData.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng trước khi xác nhận đặt phòng.");
      navigate("/dat-phong");
      setIsSubmitting(false);
      return;
    }

    const errors = {};
    if (!formData.ho.trim()) errors.ho = "Vui lòng nhập họ";
    if (!formData.ten.trim()) errors.ten = "Vui lòng nhập tên";
    if (!formData.email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email không hợp lệ";
    if (!formData.soDienThoai.trim())
      errors.soDienThoai = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10}$/.test(formData.soDienThoai))
      errors.soDienThoai = "Số điện thoại phải có 10 chữ số";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    setShowError(false);
    let khachHangResponse = null;
    let datPhongResponse = null;
    console.log("KhachHang", khachHang);
    try {
      khachHangResponse = await SuaKhachHangDatPhong({
        id: khachHang ? khachHang.id : null,
        ho: formData.ho,
        ten: formData.ten,
        sdt: formData.soDienThoai,
        email: formData.email,
        trangThai: true,
      });
      if (!khachHangResponse || !khachHangResponse.data) throw new Error();

      datPhongResponse = await CapNhatDatPhong({
        id: datPhong?.id,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong?.maDatPhong || "",
        soNguoi: ttdpData.reduce(
          (total, room) => total + room.soNguoi * room.soPhong,
          0
        ),
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong?.ngayDat,
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chưa xác nhận",
      });
      if (!datPhongResponse || !datPhongResponse.data) throw new Error();

      for (const room of thongTinDatPhong) {
        await updateThongTinDatPhong({
          id: room.id,
          datPhong: room.datPhong,
          idLoaiPhong: room.loaiPhong.id,
          maThongTinDatPhong: room.maThongTinDatPhong,
          ngayNhanPhong: room.ngayNhanPhong,
          ngayTraPhong: room.ngayTraPhong,
          soNguoi: room.soNguoi,
          giaDat: room.giaDat,
          trangThai: "Chưa xếp",
        });
      }
      
      await GuiEmailXacNhanDP(datPhong.id);

      clearTimeout(timeoutRef.current);
      alert("Đặt phòng thành công!");
      alert("Có thể xác nhận đặt phòng qua email của bạn!");
      navigate("/thong-tin-dat-phong-search");
    } catch (error) {
      if (datPhongResponse?.data) await XoaDatPhong(datPhongResponse.data.id);
      if (khachHangResponse?.data)
        await XoaKhachHangDatPhong(khachHangResponse.data);
      alert("Đã xảy ra lỗi khi xác nhận đặt phòng, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!combination || !datPhong || !khachHang || !thongTinDatPhong) {
    return <div>Không có thông tin đặt phòng được cung cấp.</div>;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <h1>Xác Nhận Đặt Phòng</h1>
        <p className="countdown-timer">
          ⏳ {formatTimeLeft(timeLeft)} còn lại để xác nhận
        </p>
        <p>Vui lòng kiểm tra thông tin và cập nhật chi tiết khách hàng</p>
      </div>

      <div className="room-summary">
        <h2>Thông tin đặt phòng</h2>
        <p>
          Mã đặt phòng: <strong>{datPhong.maDatPhong}</strong>
        </p>
        <p>
          Tổng chi phí:{" "}
          <strong>{Number(combination.tongChiPhi).toLocaleString()} VND</strong>
        </p>
        <p>
          Tổng số phòng: <strong>{combination.tongSoPhong}</strong>
        </p>
        <p>
          Tổng sức chứa: <strong>{combination.tongSucChua}</strong> người
        </p>
        <p>
          Ngày nhận phòng:{" "}
          <strong>
            {new Date(thongTinDatPhong[0]?.ngayNhanPhong).toLocaleDateString()}{" "}
            (12:00)
          </strong>
        </p>
        <p>
          Ngày trả phòng:{" "}
          <strong>
            {new Date(thongTinDatPhong[0]?.ngayTraPhong).toLocaleDateString()}{" "}
            (14:00)
          </strong>
        </p>
        <p>
          Ngày đặt:{" "}
          <strong>{datPhong.ngayDat.toLocaleString()}</strong>
        </p>
      </div>

      <form className="booking-info-form" onSubmit={handleSubmit}>
        <h2>Thông tin khách hàng</h2>
        {showError && (
          <div className="error-message">
            Vui lòng điền đầy đủ và đúng thông tin trước khi xác nhận.
          </div>
        )}
        <div className="form-grid">
          <div className="form-group">
            <label>Họ *</label>
            <input
              type="text"
              name="ho"
              value={formData.ho}
              onChange={handleInputChange}
              required
            />
            {formErrors.ho && <span className="error">{formErrors.ho}</span>}
          </div>
          <div className="form-group">
            <label>Tên *</label>
            <input
              type="text"
              name="ten"
              value={formData.ten}
              onChange={handleInputChange}
              required
            />
            {formErrors.ten && <span className="error">{formErrors.ten}</span>}
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
            />
            {formErrors.soDienThoai && (
              <span className="error">{formErrors.soDienThoai}</span>
            )}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {formErrors.email && (
              <span className="error">{formErrors.email}</span>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="confirm-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelBookingConfirmation;