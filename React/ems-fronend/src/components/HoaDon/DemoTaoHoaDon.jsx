import React, { useEffect, useState, useRef } from 'react';
import { taoHoaDon } from '../../services/HoaDonService';
import { createThongTinHoaDon } from '../../services/HoaDonDat';

const DemoTaoHoaDon = () => {
    const [traPhong, setTraPhong] = useState([]); // Danh sách trả phòng (hiển thị)
    const [tenDangNhap, setTenDangNhap] = useState(''); // Tên đăng nhập của người dùng
    const hoaDonDaTaoRef = useRef(false);

    useEffect(() => {
        const storedTraPhong = localStorage.getItem('traPhong');
        if (storedTraPhong) {
            const parsedData = JSON.parse(storedTraPhong);
            console.log("Dữ liệu sau khi parse:", parsedData);
            setTraPhong(parsedData);
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.tenDangNhap) {
            setTenDangNhap(user.tenDangNhap);

            if (!hoaDonDaTaoRef.current) {
                createHoaDon(user.tenDangNhap);
                hoaDonDaTaoRef.current = true;
            }
        }
    }, []);

    const createHoaDon = async (username) => {

        try {
            const hoaDonRequest = { tenDangNhap: username };
            const hdResponse = await taoHoaDon(hoaDonRequest);
            console.log(hdResponse);
            alert('Hóa đơn đã được tạo thành công!');
            if (hoaDonDaTaoRef.current === true) {
                if (hdResponse) {
                    const tthdRequest = {
                        idHoaDon: '',
                        listTraPhong: JSON.parse(localStorage.getItem('traPhong')),
                        tienDichVu: 0,
                        tienPhong: 0,
                        tienPhuThu: 0
                    }
                    tthdRequest.idHoaDon = hdResponse.id;
                    console.log(tthdRequest);
                    await createThongTinHoaDon(tthdRequest)
                        .then(response => {
                            console.log("Response from createThongTinHoaDon:", response.data);
                        })  
                        .catch(error => {
                            console.error("Error from createThongTinHoaDon:", error);
                        });
                }
            }


        } catch (error) {
            alert('Lỗi khi tạo hóa đơn.');
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    return (
        <div className="tao-hoa-don-container">
            <h5>Danh sách trả phòng</h5>
            {traPhong.length > 0 ? (
                <div className="card-list">
                    {traPhong.map((item, index) => (
                        <div className="room-card" key={index}>
                            <div className="card-content">
                                <h6 className="room-title">Phòng: {item.tenPhong}</h6>
                                <p className="room-details">
                                    <strong>ID:</strong> {item.id}<br />
                                    <strong>Ngày trả:</strong> {item.ngayTra}<br />
                                    <strong>Trạng thái:</strong> {item.trangThai}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có phòng nào cần xử lý.</p>
            )}
        </div>
    );
};

export default DemoTaoHoaDon;
