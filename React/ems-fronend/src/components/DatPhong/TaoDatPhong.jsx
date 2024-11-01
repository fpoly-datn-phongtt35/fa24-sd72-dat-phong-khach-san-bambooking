import React, { useState } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import './TaoDatPhong.scss';
import { ThemKhachHangDatPhong, ThemMoiDatPhong ,CapNhatDatPhong} from '../../services/DatPhong';
import { addThongTinDatPhong } from '../../services/TTDP';
const TaoDatPhong = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { startDate, endDate, adults } = location.state || {};
    const [selectedRooms, setSelectedRooms] = useState(location.state?.selectedRooms || []);
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        email: '',
        sdt: '',
    });
    // Hàm tính số ngày giữa ngày check-in và check-out
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

    // Hàm tính tổng tiền của tất cả các phòng đã chọn
    const calculateTotalAmount = () => {
        return selectedRooms.reduce((total, room) => {
            return total + calculateTotalPrice(room.donGia, startDate, endDate);
        }, 0);
    };

    // Cập nhật danh sách phòng khi xoá
    const handleRemoveRoom = (roomIndex) => {
        setSelectedRooms((prevRooms) => prevRooms.filter((_, index) => index !== roomIndex));
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
            tongTien: calculateTotalAmount(),
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
                console.log( dp );

                
                const thongTinDatPhongRequestList = selectedRooms.map(room => ({
                    datPhong: dp,  // Gán đối tượng `datPhong` đã được lưu
                    idLoaiPhong: room.id,
                    maThongTinDatPhong: '',
                    ngayNhanPhong: room.startDate,
                    ngayTraPhong: room.endDate,
                    soNguoi: room.adults,
                    giaDat: room.donGia,
                    trangThai: 'Chưa xếp'
                }));
                console.log(thongTinDatPhongRequestList);
                // Lưu từng `ThongTinDatPhong` trong danh sách
                for (const thongTinDatPhong of thongTinDatPhongRequestList) {
                    const thongTinDatPhongResponse = await addThongTinDatPhong(thongTinDatPhong);
                    console.log(thongTinDatPhongResponse);
                }
                alert('Đặt phòng thành công');
                navigate('/quan-ly-dat-phong');
            } else {
                throw new Error('Không thể lấy id khách hàng');
            }
        } catch (error) {
            console.error('Lỗi khi gửi thông tin khách hàng hoặc đặt phòng:', error);
            alert('Đã xảy ra lỗi trong quá trình đặt phòng');
        }
    };
    



    // Cập nhật giá trị của formData khi người dùng nhập
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return (
        <div className="tao-dat-phong-container">
            <div className="left-section">
                <div className="booker-information">
                    <h3>Thông Tin Người Đặt Phòng</h3>
                    <div className="booker-information__form">
                        <div className="form-group">
                            <label htmlFor="ho">Họ</label>
                            <input
                                type="text"
                                id="ho"
                                placeholder="Nguyen"
                                value={formData.ho}
                                onChange={handleInputChange} // Cập nhật giá trị khi người dùng nhập
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ten">Tên</label>
                            <input
                                type="text"
                                id="ten"
                                placeholder="Anh Tuan"
                                value={formData.ten}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sdt">Số Điện Thoại</label>
                            <input
                                type="tel"
                                id="sdt"
                                placeholder="Số điện thoại"
                                value={formData.sdt}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-section">
                <div className="selected-rooms">
                    <h3>Chi Tiết Phòng Đã Chọn ({selectedRooms.length})</h3>
                    <p>Thời gian: từ {startDate} đến {endDate}</p>

                    {selectedRooms.length > 0 ? (
                        selectedRooms.map((room, index) => (
                            <div key={`${room.id}-${index}`} className="room-card">
                                <button
                                    onClick={() => handleRemoveRoom(index)}
                                    className="remove-btn"
                                >
                                    ✕
                                </button>
                                <p>Loại phòng: {room.tenLoaiPhong}</p>
                                <p>Số người: {adults}</p>
                                <p>Giá phòng mỗi đêm: {room.donGia.toLocaleString()} VND</p>
                                <p>Số đêm: {calculateDays(room.startDate, room.endDate)}</p>
                                <p>
                                    Thành tiền: {calculateTotalPrice(room.donGia, room.startDate, room.endDate).toLocaleString()} VND
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>Không có phòng nào được chọn</p>
                    )}

                    <h3 className="total-amount">
                        Tổng tiền: {calculateTotalAmount().toLocaleString()} VND
                    </h3>

                    <div className="modal-footer">
                        <button className="confirm-btn" onClick={handleConfirmBooking}>
                            Xác nhận đặt phòng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaoDatPhong;
