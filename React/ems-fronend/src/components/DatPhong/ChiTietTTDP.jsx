import React, { useEffect, useState } from 'react';
import './ChiTietTTDP.scss';
import { useLocation, useNavigate} from 'react-router-dom';
import { getTTDPByMaTTDP } from '../../services/TTDP';
import { phongDaXep } from '../../services/XepPhongService';
import XepPhong from '../XepPhong/XepPhong';
import { hienThi } from '../../services/KhachHangCheckin';
import ModalKhachHangCheckin from './ModalKhachHangCheckin';
const ChiTietTTDP = () => {
    const navigate = useNavigate();
    const [thongTinDatPhong, setThongTinDatPhong] = useState(null);
    const [showXepPhongModal, setShowXepPhongModal] = useState(false);
    const [phongData, setPhongData] = useState({});
    const location = useLocation();
    const { maThongTinDatPhong } = location.state || {};
    const [khachHangCheckin, setKhachHangCheckin] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTTDPs, setSelectedTTDPs] = useState([]);
    const getDetailTTDP = (maThongTinDatPhong) => {
        getTTDPByMaTTDP(maThongTinDatPhong)
            .then((response) => {
                setThongTinDatPhong(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy thông tin đặt phòng:', error);
            });

    };
    const fetchKhachHangCheckin = (maThongTinDatPhong) => {
        hienThi(maThongTinDatPhong)
            .then((response) => {
                setKhachHangCheckin(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy thông tin khách hàng:', error);
            });
    }
    const fetchPhongDaXep = (maThongTinDatPhong) => {
        phongDaXep(maThongTinDatPhong)
            .then((response) => {
                setPhongData(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy thông tin phòng đã xếp:', error);
            });
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 1 : diffDays;
    };

    const calculateTotalPrice = (donGia, start, end) => {
        const days = calculateDays(start, end);
        return donGia * days;
    };

    useEffect(() => {
        if (maThongTinDatPhong) {
            getDetailTTDP(maThongTinDatPhong);
            fetchPhongDaXep(maThongTinDatPhong);
            fetchKhachHangCheckin(maThongTinDatPhong);
        }
    }, [maThongTinDatPhong]);
    const handleModalKHC = () => {
        setModalOpen(true);
    }
    const handleClose = () => {
        setModalOpen(false);
    }
    const openXepPhongModal = (thongTinDatPhong) => {
        setSelectedTTDPs([thongTinDatPhong]); // Gán thongTinDatPhong vào selectedTTDPs dưới dạng mảng chứa một phần tử
        setShowXepPhongModal(true); // Mở modal
    };
    const closeXepPhongModal = () => {
        setShowXepPhongModal(false);
        navigate('/chi-tiet-ttdp', { state: { maThongTinDatPhong } });
    };
    return (
        <div className="TTDP-info-container">
            {/* Thông tin đặt phòng */}
            <div className="flex-row">
                <div className="box">
                    <h3>Thông tin đặt phòng</h3>
                    <div className="info-item">
                        <label>Mã đặt phòng:</label>
                        <span>{thongTinDatPhong?.maThongTinDatPhong || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <label>Ngày nhận phòng:</label>
                        <span>{new Date(thongTinDatPhong?.ngayNhanPhong).toLocaleDateString() || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <label>Ngày trả phòng:</label>
                        <span>{new Date(thongTinDatPhong?.ngayTraPhong).toLocaleDateString() || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <label>Số ngày:</label>
                        <span>{calculateDays(thongTinDatPhong?.ngayNhanPhong, thongTinDatPhong?.ngayTraPhong)}</span>
                    </div>
                    <div className="info-item">
                        <label>Số người:</label>
                        <span>{thongTinDatPhong?.soNguoi || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <label>Tổng tiền:</label>
                        <span className="highlight">
                            {calculateTotalPrice(
                                thongTinDatPhong?.giaDat || 0,
                                thongTinDatPhong?.ngayNhanPhong,
                                thongTinDatPhong?.ngayTraPhong
                            ).toLocaleString('vi-VN')} VND
                        </span>
                    </div>
                </div>
                <div className="box">
                    <h3>Trạng thái phòng</h3>
                    <div className="info-item">
                        <label>Phòng:</label>
                        <span>{phongData?.phong?.tenPhong || 'Chưa xếp phòng'}</span>
                    </div>
                    <button
                        className="button-assign"
                        onClick={() => openXepPhongModal(thongTinDatPhong)}
                        disabled={!!phongData?.phong}
                    >
                        {phongData?.phong ? 'Đã xếp phòng' : 'Xếp phòng'}
                    </button>
                </div>
            </div>
            {/* Thông tin khách hàng */}
            <div class="customer-info-container">
                {khachHangCheckin.length > 0 ? (
                    khachHangCheckin.map((khc) => (
                        <div class="box">
                            <div class="customer-header">
                                <h3>
                                    <span className={ khc?.khachHang?.trangThai === true ? "status verified" : "status unverified" } >
                                        {khc?.khachHang?.trangThai === true ? "Verified" : "Unverified"}
                                    </span>
                                </h3>
                                <h3 class="customer-name">
                                    {khc?.khachHang?.ho + ' ' + khc?.khachHang?.ten || 'Khách chưa xác định'}
                                </h3>
                                <div class="dates">
                                    <span>Ngày đến: {khc.thongTinDatPhong.ngayNhanPhong}</span>
                                    <span>Ngày đi: {khc.thongTinDatPhong.ngayTraPhong}</span>
                                </div>
                            </div>
                            <div class="customer-details">
                                <div class="info-item">
                                    <label>Giới tính:</label>
                                    <span>{khc.khachHang.gioiTinh || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <label>Địa chỉ:</label>
                                    <span>{khc.khachHang.diaChi || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <label>Email:</label>
                                    <span>{khc.khachHang.email || 'N/A'}</span>
                                </div>
                                <div class="info-item">
                                    <label>Phone:</label>
                                    <span>{khc.khachHang.sdt || 'N/A'}</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn no-show">Chỉnh sửa</button>
                                <button class="btn cancel">Xóa</button>
                                <button class="btn checkin">Xác nhận</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">Không có dữ liệu khách hàng</div>
                )}
                <div class="box right-box">
                    <button class="btn add-verified" onClick={handleModalKHC}>+ Add verified guest</button>
                    <button class="btn add-unverified">+ Add unverified guest</button>
                </div>
            </div>
            <ModalKhachHangCheckin
                isOpen={isModalOpen}
                onClose={handleClose}
                thongTinDatPhong={thongTinDatPhong}
            />
            <XepPhong show={showXepPhongModal} handleClose={closeXepPhongModal} selectedTTDPs={selectedTTDPs} />
        </div>
    );
};

export default ChiTietTTDP;
