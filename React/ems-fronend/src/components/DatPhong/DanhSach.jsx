import React, { useEffect, useState } from 'react';
import { DanhSachDatPhong } from '../../services/DatPhong';
import './DatPhongCSS.css'
const DanhSach = () => {
    const [data, setData] = useState([]); // Dữ liệu
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const tt = "Hoạt động"; // Trạng thái
    const itemsPerPage = 6;

    // Hàm gọi API để lấy dữ liệu
    // const fetchDanhSachDatPhong = () => {
    //     console.log("Gọi API với trang: ", currentPage); // Kiểm tra currentPage
    //     DanhSachDatPhong(tt, currentPage)
    //         .then((response) => {
    //             console.log("Dữ liệu trả về từ API: ", response); // Kiểm tra phản hồi từ API
    //             if (response && response._embedded && response.page) {
    //                 setData(response._embedded.datPhongList); // Đảm bảo rằng dữ liệu trả về đúng
    //                 setTotalPages(response.page.totalPages);  // Cập nhật tổng số trang
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Lỗi khi lấy danh sách đặt phòng: ", error);
    //         });
    // };

    const getAllSanPham = () => {
        DanhSachDatPhong({ page: currentPage, size: itemsPerPage }, "Hoạt động")
            .then((response) => {
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };


    // Gọi API mỗi khi trang hiện tại thay đổi
    useEffect(() => {
        getAllSanPham();
    }, [currentPage]); // Chỉ chạy lại khi currentPage thay đổi


    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };


    return (
        <div className="container">
            <div className="booking-container">
                {data.length > 0 ? (
                    data.map((dp) => (
                        <div key={dp.id} className="booking-card">
                            <div className="booking-header">
                                <h3>Mã đặt phòng: {dp.maDatPhong}</h3>
                                <span className={`status ${dp.trangThai === "Hoạt động" ? "active" : "inactive"}`}>
                                    {dp.trangThai}
                                </span>
                            </div>
                            <div className="booking-body">
                                <p><strong>Khách hàng:</strong> {dp.tenKhachHang}</p>
                                <p><strong>Số lượng phòng:</strong> {dp.soLuongPhong}</p>
                                <p><strong>Thời gian vào dự kiến:</strong> {dp.thoiGianVaoDuKien}</p>
                                <p><strong>Thời gian ra dự kiến:</strong> {dp.thoiGianRaDuKien}</p>
                                <p><strong>Thời gian đặt:</strong> {dp.thoiGianDat}</p>
                                <p><strong>Ghi chú:</strong> {dp.ghiChu}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </div>


            {/* Nút điều hướng trang */}
            <div className="pagination">
                <button className="btn btn-success" onClick={handlePreviousPage} disabled={currentPage === 0}>
                    Trang trước
                </button>
                
                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button className="btn btn-success" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                    Trang sau
                </button>
            </div>
        </div>

    );
};

export default DanhSach;
