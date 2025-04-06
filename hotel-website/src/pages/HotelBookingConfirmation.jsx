import React, { useState, useEffect } from "react";
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
} from "../services/DatPhong";
import dayjs from "dayjs";

const HotelBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { combination, datPhong, khachHang, thongTinDatPhong } =
    location.state || {};

  // State cho thông tin khách hàng
  const [formData, setFormData] = useState({
    ho: khachHang?.ho || "",
    ten: khachHang?.ten || "",
    soDienThoai: khachHang?.sdt || "",
    email: khachHang?.email || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);

  // State cho thông tin đặt phòng
  const [ttdpData, setTtdpData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm nhóm và đánh số phòng
  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room, index) => {
      const key = `${room.idLoaiPhong}-${room.giaDat}`;
      if (!grouped[key]) {
        grouped[key] = { ...room, soPhong: 0 };
      }
      grouped[key].soPhong += 1;
      grouped[key].id = index; // Gán id tạm thời
    });
    return Object.values(grouped);
  };

  // Lấy thông tin đặt phòng
  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      const numberedRooms = groupAndNumberRooms(response.data);
      setTtdpData(numberedRooms);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      alert("Lỗi khi lấy thông tin đặt phòng");
    }
  };

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
    console.log("thongTinDatPhong", thongTinDatPhong);
    console.log("datPhong", datPhong);
    console.log("khachHang", khachHang);
    console.log("ttdp", ttdpData);

    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    } else if (thongTinDatPhong) {
      const numberedRooms = groupAndNumberRooms(thongTinDatPhong);
      setTtdpData(numberedRooms);
    }
  }, [datPhong, thongTinDatPhong]);

  // Xử lý submit form (được sửa dựa trên TaoDatPhong)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Kiểm tra nếu không có phòng nào được chọn
    if (ttdpData.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng trước khi xác nhận đặt phòng.");
      navigate("/dat-phong");
      setIsSubmitting(false);
      return;
    }

    // Validate form
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

    try {
      // Cập nhật thông tin khách hàng
      const khachHangRequest = {
        id: khachHang ? khachHang.id : null,
        ho: formData.ho,
        ten: formData.ten,
        sdt: formData.soDienThoai,
        email: formData.email,
        trangThai: true, // Đặt thành true khi xác nhận
      };
      khachHangResponse = await SuaKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể cập nhật thông tin khách hàng.");
      }

      // Cập nhật thông tin đặt phòng
      const datPhongRequest = {
        id: datPhong ? datPhong.id : null,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong ? datPhong.maDatPhong : "",
        soNguoi: ttdpData.reduce(
          (total, room) => total + room.soNguoi * room.soPhong,
          0
        ),
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong ? datPhong.ngayDat : new Date().toISOString(),
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Đã xác nhận",
      };
      datPhongResponse = await CapNhatDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể cập nhật đặt phòng.");
      }

      // Cập nhật thông tin chi tiết đặt phòng
      const thongTinDatPhongRequestList = [];
      thongTinDatPhong.forEach((room) => {
        console.log("room", room);
          thongTinDatPhongRequestList.push({
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
      });

      for (const thongTinDatPhong of thongTinDatPhongRequestList) {
        console.log("thongTinDatPhong", thongTinDatPhong);
        const response = await updateThongTinDatPhong(thongTinDatPhong);
        if (!response || !response.data) {
          throw new Error("Không thể cập nhật thông tin đặt phòng.");
        }
      }

      alert("Xác nhận đặt phòng thành công!");
      navigate("/thong-tin-dat-phong-search");
    } catch (error) {
      console.error("Lỗi khi xác nhận đặt phòng:", error);

      // Rollback nếu có lỗi
      if (datPhongResponse && datPhongResponse.data) {
        try {
          await XoaDatPhong(datPhongResponse.data.id);
        } catch (err) {
          console.error("Lỗi khi rollback datPhong:", err);
        }
      }
      if (khachHangResponse && khachHangResponse.data) {
        try {
          await XoaKhachHangDatPhong(khachHangResponse.data);
        } catch (err) {
          console.error("Lỗi khi rollback khachHang:", err);
        }
      }

      alert("Đã xảy ra lỗi khi xác nhận đặt phòng, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!combination || !datPhong || !khachHang || !thongTinDatPhong) {
    return <div>Không có thông tin đặt phòng được cung cấp.</div>;
  }

  return (
    <div className="confirmation-container">
      {/* Header */}
      <div className="confirmation-header">
        <h1>Xác Nhận Đặt Phòng</h1>
        <p>Vui lòng kiểm tra thông tin và cập nhật chi tiết khách hàng</p>
      </div>

      {/* Thông tin tổ hợp phòng */}
      <div className="room-details">
        <h2>Thông tin đặt phòng</h2>
        <div className="room-option">
          <div className="room-header">
            <h3>
              Mã đặt phòng: {datPhong.maDatPhong} - Tổng sức chứa:{" "}
              {combination.tongSucChua} người - Tổng chi phí:{" "}
              {Number(combination.tongChiPhi).toLocaleString()} VND - Tổng số
              phòng: {combination.tongSoPhong}
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
              {combination.phongs.map((room, idx) => (
                <tr key={room.loaiPhong.id}>
                  <td>{idx + 1}</td>
                  <td>{room.loaiPhong.tenLoaiPhong}</td>
                  <td>{room.loaiPhong.dienTich} m²</td>
                  <td>{room.loaiPhong.soKhachToiDa}</td>
                  <td>{room.loaiPhong.donGia.toLocaleString()} VND</td>
                  <td>{room.soLuongChon}</td>
                  <td>
                    {(
                      room.soLuongChon * room.loaiPhong.donGia
                    ).toLocaleString()}{" "}
                    VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="date-info">
            <p>
              Ngày nhận phòng:{" "}
              {new Date(
                thongTinDatPhong[0]?.ngayNhanPhong
              ).toLocaleDateString()}{" "}
              (12:00)
            </p>
            <p>
              Ngày trả phòng:{" "}
              {new Date(thongTinDatPhong[0]?.ngayTraPhong).toLocaleDateString()}{" "}
              (14:00)
            </p>
            <p>Ngày đặt: {new Date(datPhong.ngayDat).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Form thông tin khách hàng */}
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
              placeholder="Nhập họ"
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
              placeholder="Nhập tên"
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
              placeholder="Nhập số điện thoại (10 số)"
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
              placeholder="Nhập email"
            />
            {formErrors.email && (
              <span className="error">{formErrors.email}</span>
            )}
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
