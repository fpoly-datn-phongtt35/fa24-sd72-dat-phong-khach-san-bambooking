import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { listLoaiPhong } from '../api/datphong';
import { getLoaiPhongKhaDung, ThemMoiDatPhong, ThemKhachHangDatPhong, addThongTinDatPhong } from '../api/datphong';

export default function Home({ user }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [pageable, setPageable] = useState({ page: 0, size: 1 });
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loaiPhong, setLoaiPhong] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    ho: '',
    ten: '',
    email: '',
    sdt: '',
  });

  const images = [
    '/images/room1.jpg',
    '/images/room2.jpg',
    '/images/room3.jpg',
    '/images/room4.jpg',
  ];

  // Gọi API để lấy danh sách loại phòng
  const fetchLoaiPhong = async () => {
    setLoading(true);
    try {
      const response = await listLoaiPhong(pageable);
      console.log(response.data.content); // Kiểm tra dữ liệu
      setLoaiPhongList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy loại phòng khả dụng
  const fetchLoaiPhongKhaDungById = (ngayNhanPhong, ngayTraPhong, soNguoi, idLoaiPhong) => {
    getLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi, idLoaiPhong)
      .then((response) => {

        setLoaiPhong(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Tìm phòng khả dụng
  const handleSearchAvailableRooms = (e) => {
    e.preventDefault();
    if (selectedRoom && startDate && endDate) {
      fetchLoaiPhongKhaDungById(startDate, endDate, selectedRoom.id);
    } else {
      alert("Vui lòng điền đầy đủ thông tin trước khi tìm phòng.");
    }
  };

  // Gọi API mỗi khi pageable thay đổi
  useEffect(() => {
    fetchLoaiPhong();
  }, [pageable]);

  // Hàm thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageable((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Hàm xử lý khi nhấn nút Đặt phòng
  const handleRoomBookClick = (room) => {
    setSelectedRoom(room); // Lưu loại phòng được chọn
    setShowModal(true); // Hiển thị modal
    document.body.classList.add("modal-open"); // Vô hiệu hóa nội dung bên ngoài
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    document.body.classList.remove("modal-open"); // Kích hoạt lại nội dung bên ngoài
  };

  // Cập nhật số lượng người
  const handleNumberOfPeopleChange = (event) => {
    setNumberOfPeople(event.target.value);
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate); // Khoảng cách thời gian bằng milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi sang số ngày
    return diffDays === 0 ? 1 : diffDays; // Đảm bảo ít nhất là 1 ngày
  };

  // Hàm tính tổng tiền
  const calculateTotalPrice = (donGia, start, end) => {
    const days = calculateDays(start, end);
    return donGia * days;
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để tránh vấn đề chênh lệch múi giờ
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // nút đặt ngay
  const handleCreateBooking = (room) => {
    setLoaiPhong(room); // Lưu thông tin phòng đã chọn
    setSelectedRoom(room); // Lưu loại phòng được chọn
    setShowBookingForm(true); // Mở form thông tin người đặt
  };


  // Cập nhật giá trị của formData khi người dùng nhập
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };


  const handleConfirmBooking = async () => {
    const khachHangRequest = {
      ho: formData.ho,
      ten: formData.ten,
      email: formData.email,
      sdt: formData.sdt,
    };

    const datPhongRequest = {
      khachHang: null, // Chờ cập nhật id khách hàng sau khi tạo
      maDatPhong: 'DP' + Date.now(),
      ngayDat: new Date().toISOString(),
      tongTien: calculateTotalPrice(),
      datCoc: 0,
      ghiChu: 'Ghi chú thêm nếu cần',
      trangThai: 'Đang xử lý'
    };

    try {
      // Tạo khách hàng
      const khachHangResponse = await ThemKhachHangDatPhong(khachHangRequest);
      console.log(khachHangResponse.data);

      if (khachHangResponse != null) {
        // Gán id của khách hàng vào datPhongRequest
        datPhongRequest.khachHang = khachHangResponse.data;

        // Tạo và lưu `datPhong`
        const datPhongResponse = await ThemMoiDatPhong(datPhongRequest);
        console.log(datPhongResponse);

        const dp = datPhongResponse.data; // Đối tượng `datPhong` đã được lưu
        console.log(dp);


        const thongTinDatPhongRequest = {
          datPhong: dp,  // Gán đối tượng `datPhong` đã được lưu
          idLoaiPhong: loaiPhong.id,
          maThongTinDatPhong: '',
          ngayNhanPhong: startDate,
          ngayTraPhong: endDate,
          soNguoi: numberOfPeople,
          giaDat: loaiPhong.donGia,
          trangThai: 'Chua xep'
        };
        console.log(thongTinDatPhongRequest);
        const thongTinDatPhongResponse = addThongTinDatPhong(thongTinDatPhongRequest);
        console.log(thongTinDatPhongResponse);

        alert('Đặt phòng thành công');
        // navigate('/quan-ly-dat-phong');
      } else {
        throw new Error('Không thể lấy id khách hàng');
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông tin khách hàng hoặc đặt phòng:', error);
      alert('Đã xảy ra lỗi trong quá trình đặt phòng');
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Chào mừng đến với khách sạn Bam</h2>
          <p className="text-styling">
            Khách sạn Bam cung cấp các phòng nghỉ, với tiện nghi hiện đại, mang đến không gian nghỉ dưỡng lý tưởng cho du khách.
          </p>
          <p className="text-styling">
            Khách sạn cung cấp nhiều tiện ích từ nhà hàng ẩm thực, phòng gym, spa đến các dịch vụ tham quan thành phố.
            Hãy đến và cảm nhận sự hiếu khách, thoải mái để biến kỳ nghỉ của quý khách trở nên trọn vẹn và đáng nhớ.
          </p>
          <p className="text-styling font-italic text-center">
            Khách sạn Bam – Sự lựa chọn hoàn hảo cho những hành trình sang trọng và thư giãn.
          </p>
        </div>
      </div>

      <div className="slide-show">
        <span>THE BAM HOTEL</span>
        <span>ROOM & SUITES</span>
        <hr />

        <div className="slideshow-container">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : loaiPhongList.length > 0 ? (
            <div className="room-slideshow">
              <img
                src={images[currentImageIndex]}
                alt={`Room ${currentImageIndex + 1}`}
                className="slideshow-image"
              />
              {loaiPhongList.map((room) => (
                <div key={room.id} className="room-container">
                  <h3>{room.tenLoaiPhong}</h3>
                  <p>Diện tích: {room.dienTich} m²</p>
                  <p>Số khách tối đa: {room.soKhachToiDa}</p>
                  <p>Giá: {room.donGia} VND</p>
                  <p>{room.moTa}</p>
                  {/* Chỉnh sửa để có thể thêm hình ảnh phòng nếu có */}
                  <img src={`/images/rooms/${room.id}.jpg`} alt={room.tenLoaiPhong} className="room-image" />
                  <button className="explore-button" onClick={() => handleRoomBookClick(room)}>Đặt phòng</button>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có phòng nào để hiển thị</p>
          )}

          {/* Điều khiển chuyển phòng */}
          <div className="slideshow-navigation">
            <button
              className="btn btn-secondary"
              disabled={pageable.page === 0}
              onClick={() => handlePageChange(pageable.page - 1)}
            >
              &#10094; {/* Mũi tên trái */}
            </button>
            <span>
              Phòng {pageable.page + 1} / {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={pageable.page === totalPages - 1}
              onClick={() => handlePageChange(pageable.page + 1)}
            >
              &#10095; {/* Mũi tên phải */}
            </button>
          </div>
        </div>
      </div>

      {/* Modal hiển thị form đặt phòng */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button> <br /> <br />
            <form onSubmit={handleSearchAvailableRooms}>
              <h3 className="form-title">Đặt phòng: {selectedRoom.tenLoaiPhong}</h3> <br />
              <div className="form-group">
                <label htmlFor="startDate">Ngày Check-in:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getTodayDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">Ngày Check-out:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numberOfPeople">Số người:</label>
                <input
                  type="number"
                  id="numberOfPeople"
                  value={numberOfPeople}
                  onChange={handleNumberOfPeopleChange}
                  min={1}
                  required
                />
              </div>
              <button type="submit">Tìm phòng</button>
            </form>

            {/* Hiển thị danh sách phòng khả dụng khi tìm được */}
            {loaiPhong && loaiPhong.tenLoaiPhong && (
              <div className="room-item">
                <div className="room-info">
                  <h4 className="room-title">{loaiPhong.tenLoaiPhong}</h4>
                  <div className="details">
                    <div className="detail-item">
                      <span>Diện tích: </span>
                      <strong>{loaiPhong.dienTich} m²</strong>
                    </div>
                    <div className="detail-item">
                      <span>Sức chứa: </span>
                      <strong>{loaiPhong.soKhachToiDa} khách</strong>
                    </div>
                    <div className="detail-item">
                      <span>Số phòng thực tế: </span>
                      <strong>{loaiPhong.soLuongPhong}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Số phòng khả dụng: </span>
                      <strong>{loaiPhong.soPhongKhaDung}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Đơn giá: </span>
                      <strong>{loaiPhong.donGia.toLocaleString()} VND</strong>
                    </div>
                  </div>
                  <p className="description">Mô tả: {loaiPhong.moTa}</p>
                  <p className="total-price">
                    Thành tiền: <strong>{calculateTotalPrice(loaiPhong.donGia, startDate, endDate).toLocaleString()} VND</strong>
                  </p>
                </div>
                <div className="room-actions">
                  <button className="secondary-btn" onClick={() => handleCreateBooking(loaiPhong)}>
                    Đặt ngay
                  </button>
                </div>
              </div>
            )}

            {showBookingForm && (
              <div className="modal">
                <div className="modal-content">
                  <button className="close-button" onClick={() => setShowBookingForm(false)}>
                    &times;
                  </button>
                  <div className="room-info-ttnd">
                    <h3>Thông tin phòng</h3>
                    <h4 className="room-title-ttnd">Loại phòng: {selectedRoom?.tenLoaiPhong}</h4>
                    <p>Ngày Check-in: {startDate}</p>
                    <p>Ngày Check-out: {endDate}</p>
                    <p>Số người: {numberOfPeople}</p>
                    <p>Đơn giá: {loaiPhong?.donGia.toLocaleString()} VND</p>
                  </div>
                  <form onSubmit={handleConfirmBooking}>
                    <h3>Thông tin người đặt phòng</h3> <br />
                    <div className="form-group">
                      <label htmlFor="ho">Họ:</label>
                      <input
                        type="text"
                        id="ho"
                        name="ho"
                        value={formData.ho}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ten">Tên:</label>
                      <input
                        type="text"
                        id="ten"
                        name="name"
                        value={formData.ten}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="sdt">Số điện thoại:</label>
                      <input
                        type="text"
                        id="sdt"
                        name="phone"
                        value={formData.sdt}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button type="submit">Xác nhận đặt phòng</button>
                  </form>
                </div>
              </div>
            )}


          </div>
        </div>
      )}


      <div className="services-and-image">
        <div className="image-column">
          <div className="image-frame">
            <img src="/images/le-tan.jpg" alt="Lễ tân" className="large-image" />
            <div className="small-images-row">
              <img src="/images/gym-ha-noi.jpg" alt="Gym" className="small-image" />
              <img src="/images/dich-vu-cham-soc-phong.jpg" alt="Chăm sóc phòng" className="small-image" />
            </div>
          </div>
        </div>
        <div className="services-column">
          <span>THE BAM HOTEL</span>
          <span>DỊCH VỤ & TIỆN ÍCH</span>
          <hr />
          <ul>
            <li>Lễ tân trực 24/7</li>
            <li>Phục vụ phòng 24 giờ</li>
            <li>Truy cập Internet miễn phí</li>
            <li>Liệu trình chăm sóc sức khỏe tại Spa</li>
            <li>Trung tâm thể dục thể thao 24/7</li>
            <li>Thưởng thức tinh hoa ẩm thực</li>
            <li>Dịch vụ giặt là</li>
            <li>ATM</li>
            <li>Dịch vụ văn phòng: máy tính làm việc, Internet, phòng họp,...</li>
          </ul>
        </div>
      </div>

      {user ? (
        <div>
          <h2>Hello, {user.name || user.email}!</h2>
          <p>We are excited to have you here. Start booking your rooms now!</p>
        </div>
      ) : (
        <p>Please log in to book a room and enjoy exclusive benefits.</p>
      )}
    </div>
  );
}
