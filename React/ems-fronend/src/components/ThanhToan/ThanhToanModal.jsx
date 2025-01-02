import React, { useEffect, useState } from 'react';
import { getHoaDonById, updateThanhToan } from '../../services/ThanhToanService';
import './ThanhToanModal.css';

const ThanhToanModal = ({ show, onClose, thanhToan, setHoaDon }) => {
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState(false); // Mặc định là "Tiền mặt"
    const [tienThanhToan, setTienThanhToan] = useState(thanhToan?.tienThanhToan || 0);
    const [idNhanVien, setIdNhanVien] = useState('');
    const [hoaDon, setHoaDonLocal] = useState(thanhToan?.hoaDon || null);

    if (!show) return null;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setIdNhanVien(user.id);
        } else {
            console.warn("Tên đăng nhập không tồn tại hoặc user là null.", user.id, user.tenDangNhap);
        }
    }, []);

    useEffect(() => {
        const fetchHoaDon = async () => {
            const hoaDonResponse = await getHoaDonById(thanhToan.hoaDon.id);
            setHoaDonLocal(hoaDonResponse.data);
            setHoaDon(hoaDonResponse.data);
        };

        if (thanhToan?.hoaDon?.id) {
            fetchHoaDon();  // Gọi API khi có id hóa đơn
        }
    }, [thanhToan, setHoaDon]);  // Thêm setHoaDon để sử dụng khi cần cập nhật từ bên ngoài

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleTienThanhToanChange = (event) => {
        const value = event.target.value;
        let numericValue = value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số và dấu phẩy
        setTienThanhToan(numericValue);
    };

    const formattedTienThanhToan = formatCurrency(Number(tienThanhToan));

    const handleUpdateTienThanhToan = async () => {
        try {
            const data = {
                id: thanhToan.id,
                idNhanVien: idNhanVien,
                idHoaDon: thanhToan.hoaDon.id,
                tienThanhToan: Number(tienThanhToan),
                phuongThucThanhToan: phuongThucThanhToan
            };

            await updateThanhToan(thanhToan.id, data);

            // Cập nhật lại hóa đơn mới sau khi thanh toán thành công
            const updatedHoaDon = await getHoaDonById(thanhToan.hoaDon.id);
            setHoaDonLocal(updatedHoaDon.data);  // Cập nhật dữ liệu mới vào local state
            setHoaDon(updatedHoaDon.data);  // Cập nhật dữ liệu hóa đơn trong component cha

            alert("Thanh toán thành công");
            onClose();
        } catch (error) {
            console.error("Lỗi khi thực hiện thanh toán: ", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi thanh toán, vui lòng thử lại.";
            alert(errorMessage);
        }
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <h5><b>THANH TOÁN</b></h5>
                <div className="button-group">
                    <button
                        style={{ width: '150px' }}
                        className={phuongThucThanhToan === false ? "active" : ""}
                        onClick={() => setPhuongThucThanhToan(false)}
                    >
                        Tiền mặt
                    </button>
                    <button
                        style={{ width: '150px' }}
                        className={phuongThucThanhToan === true ? "active" : ""}
                        onClick={() => setPhuongThucThanhToan(true)}
                    >
                        Chuyển khoản
                    </button>
                </div>

                <div className="content mt-3">
                    {phuongThucThanhToan === false ? (
                        hoaDon ? (
                            <>
                                <p><b>Ngày thanh toán:</b> {thanhToan.ngayThanhToan ? formatDate(thanhToan.ngayThanhToan) : 'Chưa có ngày thanh toán'}</p>
                                <p><b>Tổng tiền:</b>
                                    <span className={`badge bg-success text-white ms-1 fs-6`}>
                                        {formatCurrency(hoaDon.tongTien)}
                                    </span>
                                </p>
                                <div className="input-group">
                                    <p><b>Tiền thanh toán:</b></p>
                                    <input
                                        type="text"
                                        value={formattedTienThanhToan}
                                        onChange={handleTienThanhToanChange}
                                        className="input-tien-thanh-toan"
                                    />
                                </div>
                                <p><b>Tiền thừa:</b>
                                    <span className={`badge bg-warning text-black ms-1 fs-6`}>
                                        {formatCurrency(tienThanhToan - hoaDon.tongTien)}
                                    </span>
                                </p>
                                <div className="btn-control">
                                    {tienThanhToan > 0 && (
                                        <button className='btn-payment' onClick={handleUpdateTienThanhToan}>Thanh Toán</button>
                                    )}
                                    <button onClick={onClose} className='btn-cancel'>Hủy</button>
                                </div>
                            </>
                        ) : (
                            <p>Không có thông tin thanh toán tiền mặt.</p>
                        )
                    ) : (
                        hoaDon ? (
                            <>
                                <h6><b>Chuyển Khoản</b></h6>
                            </>
                        ) : (
                            <p>Không có thông tin thanh toán chuyển khoản.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThanhToanModal;
