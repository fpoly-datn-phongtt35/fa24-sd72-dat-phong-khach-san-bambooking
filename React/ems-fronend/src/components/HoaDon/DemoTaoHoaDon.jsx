import React, { useEffect, useState, useRef, useMemo } from 'react';
import { taoHoaDon } from '../../services/HoaDonService';
import { createThongTinHoaDon } from '../../services/HoaDonDat';
import { useNavigate } from 'react-router-dom';

const DemoTaoHoaDon = () => {
    const [traPhong, setTraPhong] = useState([]);
    const [tenDangNhap, setTenDangNhap] = useState('');
    const hoaDonDaTaoRef = useRef(false);//Hóa đơn tạo 1 lần

    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [selectedTraPhong, setSelectedTraPhong] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            const hdResponse = await taoHoaDon(hoaDonRequest); // Gọi API tạo hóa đơn
            console.log( hdResponse);
            console.log("Hóa đơn id: " + hdResponse.id)
            console.log("Mã hóa đơn id: " + hdResponse.maHoaDon)
            console.log("Tổng tiền hóa đơn id: " + hdResponse.tongTien)
            setIdHoaDon(hdResponse.id);
            alert('Hóa đơn đã được tạo thành công!');

            if (hoaDonDaTaoRef.current === true) {
                // Tạo thông tin hóa đơn
                if (hdResponse) {
                    const tthdRequest = {
                        idHoaDon: hdResponse.id,
                        listTraPhong: JSON.parse(localStorage.getItem('traPhong'))
                    };

                    console.log(tthdRequest);//du lieu hoa don

                    const response = await createThongTinHoaDon(tthdRequest);
                    console.log("Response from createThongTinHoaDon:", response.data);

                    // Cập nhật danh sách thông tin hóa đơn với dữ liệu trả về từ backend
                    setThongTinHoaDon((prev) => [...prev, ...response.data]); // Gọi data để lấy kết quả trả về

                    response.data.forEach((thongTin) => {
                        console.log(
                            `Tiền phòng: ${thongTin.tienPhong}, 
                             Tiền phụ thu: ${thongTin.tienPhuThu}, 
                             Tiền dịch vụ: ${thongTin.tienDichVu}`
                        );
                    });
                }
                
            }
        } catch (error) {
            alert('Lỗi khi tạo hóa đơn.');
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    const handleTraPhongClick = (traPhong) => {
        setSelectedTraPhong(traPhong);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTraPhong(null);
    };

    const calculateStayDays = (ngayNhanPhong, ngayTraThucTe) => {
        const startDate = new Date(ngayNhanPhong);
        const endDate = new Date(ngayTraThucTe);

        // Lấy giờ và phút của ngày trả phòng thực tế
        const checkOutHour = endDate.getHours();
        const checkOutMinute = endDate.getMinutes();

        // Tính số ngày ở
        let timeDifference = endDate - startDate;
        let dayDifference = timeDifference / (1000 * 3600 * 24);

        // Nếu trả phòng trong ngày (trước 12h trưa), thì giảm bớt 1 ngày
        if (checkOutHour < 6 || (checkOutHour === 6 && checkOutMinute === 0)) {
            dayDifference -= 1; // Trả phòng trước 6h sáng, tính thêm 1 ngày
        }

        // Trả phòng trong cùng ngày, thêm một ngày nữa (tính đủ một ngày)
        if (dayDifference <= 0) {
            dayDifference = 1;
        }

        // Làm tròn lên nếu có phần thập phân
        return Math.ceil(dayDifference);
    };

    const totalAmount = useMemo(() => {
        return thongTinHoaDon.reduce((total, item) => total + item.tienPhong + item.tienPhuThu + item.tienDichVu, 0);
    }, [thongTinHoaDon]);
    

    return (
        <div className="container">
            <div className="card mt-4">
                <div className="card-header">
                    <h5>Thông Tin Hóa Đơn</h5>
                </div>
                <div className="card-body">
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
                                        <td>
                                            <span
                                                onClick={() => handleTraPhongClick(item.traPhong)}
                                                style={{ color: '#007bff', cursor: 'pointer' }}
                                            >
                                                {item.traPhong.id}
                                            </span>
                                        </td>
                                        <td>{item.traPhong.xepPhong.phong.tenPhong}</td>
                                        <td>{item.tienPhong}</td>
                                        <td>{item.tienPhuThu}</td>
                                        <td>{item.tienDichVu}</td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có thông tin hóa đơn.</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={5}></td>
                                <td><b>Tổng tiền:</b></td>
                                <td>{isNaN(totalAmount) ? '0' : totalAmount}</td>
                            </tr>
                            <tr>
                                <td colSpan={6}></td>
                                <td>
                                    <button onClick={()=> navigate(`/thanh-toan/${idHoaDon}`)}>Thanh toán</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>


            {showModal && selectedTraPhong && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thông Tin Trả Phòng</h5>
                                <button type="button" className="close" onClick={closeModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Phòng:</strong> {selectedTraPhong.xepPhong.phong.tenPhong}</p>
                                <p><strong>Ngày nhận phòng:</strong> {selectedTraPhong.xepPhong.thongTinDatPhong.ngayNhanPhong}</p>
                                <p><strong>Ngày trả thực tế:</strong> {selectedTraPhong.ngayTraThucTe}</p>
                                {selectedTraPhong.ngayTraThucTe && selectedTraPhong.xepPhong.thongTinDatPhong.ngayNhanPhong && (
                                    <p>
                                        <strong>Số ngày ở:</strong> {calculateStayDays(selectedTraPhong.xepPhong.thongTinDatPhong.ngayNhanPhong, selectedTraPhong.ngayTraThucTe)}
                                    </p>
                                )}
                                <p><b> Giá phòng: </b> {selectedTraPhong.xepPhong.thongTinDatPhong.giaDat}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoTaoHoaDon;
