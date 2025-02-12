import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CapNhatDatPhong } from '../DatPhong';
import { updateTTDP } from '../TTDP';
import { updateKhachHang } from '../KhachHangService'
const TaoDatPhong = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { startDate, endDate, adults } = location.state || {};
    const [selectedRooms, setSelectedRooms] = useState(location.state?.gioHang || []);
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        email: '',
        sdt: '',
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Lỗi phân tích JSON:', error);
            }
        } else {
            console.log('Không tìm thấy dữ liệu người dùng.');
        }
    }, [location.state]);
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
            return total + calculateTotalPrice(room.giaDat, room.ngayNhanPhong, room.ngayTraPhong);
        }, 0);
    };

    // Cập nhật danh sách phòng khi xoá
    const handleRemoveRoom = (roomIndex) => {
        setSelectedRooms((prevRooms) => prevRooms.filter((_, index) => index !== roomIndex));
    };

    const handleConfirmBooking = async () => {
        console.log(selectedRooms)
        try {
            if (user != null) {

                if (selectedRooms.length > 0) {
                    const firstRoom = selectedRooms[0]; // Lấy phần tử đầu tiên trong mảng
                    const datPhongRequest = {
                        id: firstRoom.datPhong.id, // Truy cập `datPhong` từ phần tử đầu tiên
                        khachHang: firstRoom.datPhong.khachHang,
                        maDatPhong: firstRoom.datPhong.maDatPhong,
                        ngayDat: firstRoom.datPhong.ngayDat,
                        tongTien: firstRoom.datPhong.tongTien,
                        datCoc: firstRoom.datPhong.datCoc,
                        ghiChu: 'Ghi chú thêm nếu cần',
                        trangThai: 'Da xac nhan'
                    };
                    CapNhatDatPhong(datPhongRequest)
                        .then((response) => {
                            console.log('Cập nhật thành công:', response);
                        })
                        .catch((error) => {
                            console.error('Lỗi khi cập nhật đặt phòng:', error);
                        });


                    const thongTinDatPhongRequestList = selectedRooms.map(room => ({
                        id: room.id,
                        datPhong: room.datPhong,  // Gán đối tượng `datPhong` đã được lưu
                        idLoaiPhong: room.loaiPhong.id,
                        maThongTinDatPhong: room.maThongTinDatPhong,
                        ngayNhanPhong: room.ngayNhanPhong,
                        ngayTraPhong: room.ngayTraPhong,
                        soNguoi: room.soNguoi,
                        giaDat: room.giaDat,
                        ghiChu: 'Ghi chú thêm nếu cần',
                        trangThai: 'Chua xep'
                    }));
                    console.log(thongTinDatPhongRequestList);
                    for (const thongTinDatPhong of thongTinDatPhongRequestList) {
                        updateTTDP(thongTinDatPhong);
                    }
                    alert('Đặt phòng thành công');
                    navigate('/quan-ly-dat-phong');
                } else {
                    alert("Chưa có phòng được chọn")
                }

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
                                value={user?.ho}
                                onChange={handleInputChange} // Cập nhật giá trị khi người dùng nhập
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ten">Tên</label>
                            <input
                                type="text"
                                id="ten"
                                placeholder="Anh Tuan"
                                value={user?.ten}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={user?.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sdt">Số Điện Thoại</label>
                            <input
                                type="tel"
                                id="sdt"
                                placeholder="Số điện thoại"
                                value={user?.sdt}
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
                                <p>Loại Phòng: {room.loaiPhong.tenLoaiPhong}</p>
                                <p>Thời gian: {room.ngayNhanPhong} -- {room.ngayTraPhong}</p>
                                <p>Số Người: {room.soNguoi}</p>
                                <p>Giá Đặt: {room.giaDat} VND</p>
                                <p>Số đêm: {calculateDays(room.ngayNhanPhong, room.ngayTraPhong)}</p>
                                <p>
                                    Thành tiền: {calculateTotalPrice(room.giaDat, room.ngayNhanPhong, room.ngayTraPhong).toLocaleString()} VND
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
