import React, { useEffect, useState } from 'react';
import './ThongTinDatPhong.css';
import { useLocation } from 'react-router-dom';
import { getThongTinDatPhong } from '../../services/TTDP';
import { Tabs } from 'antd';  // Import Tabs từ Ant Design

const { TabPane } = Tabs;

const ThongTinDatPhong = () => {
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

    // Tạo Tabs để hiển thị mỗi phòng dưới dạng Tab
    return (
        <div className="room-booking-info">
            {thongTinDatPhong.length > 0 ? (
                <Tabs defaultActiveKey="1">
                    {thongTinDatPhong.map((item, index) => (
                        <TabPane tab={`Phòng ${index + 1}`} key={index + 1}>
                            <div className="booking-card-details">
                                <div className="booking-details">
                                    <h2>Mã đặt phòng: {item.maThongTinDatPhong}</h2>
                                    <p><strong>Ngày nhận phòng:</strong> {new Date(item.ngayNhanPhong).toLocaleDateString()}</p>
                                    <p><strong>Ngày trả phòng:</strong> {new Date(item.ngayTraPhong).toLocaleDateString()}</p>
                                    <p><strong>Giá đặt:</strong> ${item.giaDat}</p>
                                    <p><strong>Số người:</strong> {item.soNguoi}</p>
                                    <p><strong>Trạng thái:</strong> {item.trangThai}</p>
                                </div>
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            ) : (
                <p>Loading...</p>
            )}
        </div>  
    );
};

export default ThongTinDatPhong;
