import React, { useEffect, useState } from 'react';
import './ChiTietDatPhong.scss';
import { useLocation } from 'react-router-dom';
import { getThongTinDatPhong } from '../../services/TTDP';
import { Tabs } from 'antd';  // Import Tabs từ Ant Design

const { TabPane } = Tabs;

const ChiTietDatPhong = () => {
    const [thongTinDatPhong, setThongTinDatPhong] = useState([]); // Chuyển sang mảng để chứa danh sách
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const location = useLocation();
    const { id } = location.state || {};

    // Hàm gọi API để lấy chi tiết đặt phòng
    const getDetailDatPhong = (id) => {
        getThongTinDatPhong(id, { page: currentPage, size: 5 }) // Gọi API với id và pagination
            .then((response) => {
                setThongTinDatPhong(response.data.content); // Cập nhật danh sách đặt phòng
                setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (id) {
            getDetailDatPhong(id); // Chỉ gọi nếu id tồn tại
        }
    }, [id, currentPage]); // Gọi lại API khi trang thay đổi

    // Hàm tính số ngày ở
    const tinhSoNgayO = (ngayNhanPhong, ngayTraPhong) => {
        const nhanPhong = new Date(ngayNhanPhong);
        const traPhong = new Date(ngayTraPhong);
        const diffTime = Math.abs(traPhong - nhanPhong);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Số ngày ở
    };

    // Tạo Tabs để hiển thị mỗi phòng dưới dạng Tab
    return (
        <div className="room-booking-info">
            {thongTinDatPhong.length > 0 ? (
                <Tabs defaultActiveKey="1">
                    {thongTinDatPhong.map((item) => {
                        const soNgayO = tinhSoNgayO(item.ngayNhanPhong, item.ngayTraPhong); // Tính số ngày ở
                        const thanhTien = soNgayO * item.giaDat; // Tính thành tiền

                        return (
                            <TabPane tab={`${item.maThongTinDatPhong}`} key={item.maThongTinDatPhong}>
                                <div className="booking-form-details">
                                    <form className="booking-form">
                                        <div className="form-group">
                                            <label htmlFor="ngayNhanPhong">Ngày Nhận Phòng:</label>
                                            <input type="datetime" id="ngayNhanPhong" value={item.ngayNhanPhong} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ngayTraPhong">Ngày Trả Phòng:</label>
                                            <input type="datetime" id="ngayTraPhong" value={item.ngayTraPhong} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="giaDat">Giá Đặt:</label>
                                            <input type="text" id="giaDat" value={`${item.giaDat}`} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="soNguoi">Số Người:</label>
                                            <input type="text" id="soNguoi" value={item.soNguoi} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="thanhTien">Thành Tiền:</label>
                                            <input type="text" id="thanhTien" value={thanhTien} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="trangThai">Trạng Thái:</label>
                                            <input type="text" id="trangThai" value={item.trangThai} readOnly />
                                        </div>
                                    </form>
                                </div>
                            </TabPane>
                        );
                    })}
                </Tabs>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ChiTietDatPhong;
