import React, { useEffect, useState, useRef, useMemo } from 'react';
import { taoHoaDon } from '../../services/HoaDonService';
import { createThongTinHoaDon } from '../../services/HoaDonDat';
import { useNavigate } from 'react-router-dom';
import './DemoTaoHoaDon.css';

const DemoTaoHoaDon = () => {
    const [traPhong, setTraPhong] = useState([]);
    const [tenDangNhap, setTenDangNhap] = useState('');
    const hoaDonDaTaoRef = useRef(false); // Hóa đơn tạo 1 lần

    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);

    const [idHoaDon, setIdHoaDon] = useState(null);

    const navigate = useNavigate();

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
            setIdHoaDon(hdResponse.id);
            alert('Hóa đơn đã được tạo thành công!');

            if (hoaDonDaTaoRef.current === true) {
                if (hdResponse) {
                    const tthdRequest = {
                        idHoaDon: hdResponse.id,
                        listTraPhong: JSON.parse(localStorage.getItem('traPhong'))
                    };

                    console.log(tthdRequest);
                    const response = await createThongTinHoaDon(tthdRequest);
                    setThongTinHoaDon((prev) => [...prev, ...response.data]);

                    response.data.forEach((thongTin) => {
                        console.log(`Tiền phòng: ${thongTin.tienPhong}, Tiền phụ thu: ${thongTin.tienPhuThu}, Tiền dịch vụ: ${thongTin.tienDichVu}`);
                    });
                }
            }
        } catch (error) {
            alert('Lỗi khi tạo hóa đơn.');
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const calculateStayDays = (ngayNhanPhong, ngayTraThucTe) => {
        const startDate = new Date(ngayNhanPhong);
        const endDate = new Date(ngayTraThucTe);

        const checkOutHour = endDate.getHours();
        const checkOutMinute = endDate.getMinutes();

        let timeDifference = endDate - startDate;
        let dayDifference = timeDifference / (1000 * 3600 * 24);

        if (checkOutHour < 6 || (checkOutHour === 6 && checkOutMinute === 0)) {
            dayDifference -= 1;
        }

        if (dayDifference <= 0) {
            dayDifference = 1;
        }

        return Math.ceil(dayDifference);
    };

    const totalAmount = useMemo(() => {
        return thongTinHoaDon.reduce((total, item) => total + item.tienPhong + item.tienPhuThu + item.tienDichVu, 0);
    }, [thongTinHoaDon]);

    return (
        <div className="container">
            <div className="card mt-4">
                <div className="card-body">
                    <h5>Thông Tin Hóa Đơn</h5>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Mã Hóa Đơn</th>
                                <th>ID Trả phòng</th>
                                <th>Phòng</th>
                                <th>Tiền Phòng</th>
                                <th>Tiền Phụ Thu</th>
                                <th>Tiền Dịch Vụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thongTinHoaDon.length > 0 ? (
                                thongTinHoaDon.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.hoaDon.maHoaDon}</td>
                                        <td>{item.traPhong.id}</td>
                                        <td>{item.traPhong.xepPhong.phong.tenPhong}</td>
                                        <td>{formatCurrency(item.tienPhong)}</td>
                                        <td>{formatCurrency(item.tienPhuThu)}</td>
                                        <td>{formatCurrency(item.tienDichVu)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Chưa có thông tin hóa đơn.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <div className="total-section">
                        <p className="total-amount"><b>Tổng tiền:</b> {isNaN(totalAmount) ? formatCurrency(0) : formatCurrency(totalAmount)}</p>
                        <button 
                            style={{width:'180px'}}
                            onClick={() => navigate(`/thanh-toan/${idHoaDon}`)}>
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoTaoHoaDon;
