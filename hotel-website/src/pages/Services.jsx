import React, { useState, useEffect } from 'react';
import { getAllServices } from '../services/DichVu';
import '../styles/Services.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(6);  // Hiển thị 6 ảnh đầu tiên
    const itemsPerClick = 3;  // Mỗi lần nhấn "Xem thêm" sẽ hiển thị thêm 3 ảnh

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getAllServices();
                setServices(response.data);
            } catch (error) {
                setError(error.message || 'Không thể tải danh sách dịch vụ.');
                console.error('Lỗi khi lấy dịch vụ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Hiển thị trạng thái loading hoặc lỗi nếu có
    if (loading) {
        return <p>Đang tải dịch vụ...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Cắt dữ liệu theo số lượng dịch vụ cần hiển thị
    const servicesToDisplay = services.slice(0, itemsToShow);

    return (
        <div className="services-container">
            <h2>Dịch vụ có sẵn</h2>
            <div className="services-list">
                {servicesToDisplay.length > 0 ? (
                    servicesToDisplay.map((service) => (
                        <div key={service.id} className="service-card">
                            <img src={service.hinhAnh} alt={service.tenDichVu} className="service-image" />
                            <div className="service-info">
                                <h3>{service.tenDichVu}</h3>
                                <p className="service-description">{service.moTa}</p>                   
                                <p className="service-price">{Number(service.donGia).toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có dịch vụ nào để hiển thị.</p>
                )}
            </div>

            {/* Nút xem thêm */}
            {itemsToShow < services.length && (
                <div className="load-more-container">
                    <button
                        onClick={() => setItemsToShow(itemsToShow + itemsPerClick)}
                        className="load-more-button"
                    >
                        Xem thêm
                    </button>
                </div>
            )}
        </div>
    );
};

export default Services;
