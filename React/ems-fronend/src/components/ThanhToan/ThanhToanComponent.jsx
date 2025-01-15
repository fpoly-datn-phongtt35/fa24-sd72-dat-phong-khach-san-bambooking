import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createThanhToan, getHoaDonById, changeStatusInvoice } from '../../services/ThanhToanService';
import ThanhToanModal from './ThanhToanModal';

const ThanhToanComponent = () => {
    const { idHoaDon } = useParams();
    const [hoaDon, setHoaDon] = useState(null);
    const [thanhToan, setThanhToan] = useState(null);
    const [idNhanVien, setIdNhanVien] = useState('');
    const [showModal, setShowModal] = useState(false);
    const thanhToanRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (idHoaDon) {
            thanhToanRef.current = false;
            fetchHoaDon(idHoaDon);
        }
    }, [idHoaDon]);

    useEffect(() => {
        return () => thanhToanRef.current = false;
    }, []);


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setIdNhanVien(user.id);
        } else {
            console.warn("Nhân viên không tồn tại hoặc user là null");
        }
    }, []);

    const fetchHoaDon = async (idHoaDon) => {
        try {
            const response = await getHoaDonById(idHoaDon);
            setHoaDon(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hóa đơn:", error);
        }
    };

    const handleCreateThanhToan = async () => {
        if (!hoaDon || thanhToanRef.current) return;

        thanhToanRef.current = true;

        try {
            const thanhToanRequest = {
                idNhanVien: idNhanVien,
                idHoaDon: idHoaDon
            };
            const response = await createThanhToan(thanhToanRequest);
            setThanhToan(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán mới:", error);
            alert("Có lỗi xảy ra khi tạo thanh toán!");
        } finally {
            thanhToanRef.current = false;
        }
    };

    const formatCurrency = (amount) => {
        if (amount == null) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        thanhToanRef.current = false;
    };

    const handleChangeStatus = (id) => {
        changeStatusInvoice(id)
            .then(() => {
                navigate('/hoa-don');
            })
            .catch((error) => {
                console.error("Lỗi khi thay đổi trạng thái hóa đơn:", error);
                alert("Có lỗi xảy ra khi thay đổi trạng thái hóa đơn!");
            });
    };

    return (
        <div>
            <div className="container mt-5">
                {hoaDon ? (
                    <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', margin: 'auto' }}>
                        <h4 className="text-center mb-3"><b>HÓA ĐƠN</b></h4>

                        <div className="mb-3 ms-5">
                            <p><b>Mã hóa đơn:</b> <span className="text-muted">{hoaDon.maHoaDon}</span></p>
                            <p><b>Nhân viên:</b> <span className="text-muted">{hoaDon.tenNhanVien}</span></p>
                            <p><b>Ngày tạo:</b> <span className="text-muted">{hoaDon.ngayTao}</span></p>
                            <p><b>Tổng tiền:</b>
                                <span className={`badge bg-success text-white ms-1 fs-6`}>
                                    {formatCurrency(hoaDon.tongTien)}
                                </span>
                            </p>
                            <p>
                                <b>Thanh toán:</b>
                                <i
                                    className={`bi bi-credit-card ${hoaDon.trangThai === 'Chờ xác nhận' ? 'text-muted' : 'text-primary'}`}
                                    style={{
                                        marginLeft: '10px',
                                        cursor: hoaDon.trangThai === 'Chờ xác nhận' ? 'not-allowed' : 'pointer',
                                        color: hoaDon.trangThai === 'Chờ xác nhận' ? 'gray' : 'blue',
                                        fontSize: '1.5rem'
                                    }}
                                    onClick={hoaDon.trangThai === 'Chờ xác nhận' ? null : handleCreateThanhToan}
                                ></i>
                            </p>


                            <p><b>Trạng thái:</b>
                                <span className={`badge bg-${hoaDon.trangThai === 'Đã thanh toán' ? 'success' : 'warning'} text-white ms-1`}>
                                    {hoaDon.trangThai}
                                </span>
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                            {hoaDon.trangThai === 'Chờ xác nhận' && (
                                <button
                                    style={{ width: '200px', height: '40px' }}
                                    className="btn btn-outline-success"
                                    onClick={() => handleChangeStatus(hoaDon.id)}
                                >
                                    Xác nhận thanh toán
                                </button>
                            )}

                            <button
                                style={{ width: '55px', height: '40px' }}
                                className="btn btn-outline-danger"
                                onClick={() => navigate('/hoa-don')}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Lỗi hiển thị thông tin hóa đơn!</p>
                )}
            </div>

            {showModal && (
                <ThanhToanModal
                    show={showModal}
                    onClose={handleCloseModal}
                    thanhToan={thanhToan}
                    setHoaDon={setHoaDon}
                />
            )}
        </div>
    );
};

export default ThanhToanComponent;
