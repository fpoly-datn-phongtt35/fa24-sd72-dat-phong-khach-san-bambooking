import React, { useState } from 'react';
import '../styles/Offers.css';

const Offers = () => {
    const allOffers = [
        {
            img: "https://res.cloudinary.com/dy9md2des/image/upload/v1745592565/ladcf7j5wemsu9nadgdm.jpg",
            title: "Ưu đãi bữa sáng tự chọn",
            description: "Chỉ 150.000đ - Nhiều món ăn hấp dẫn cho một khởi đầu ngày mới hoàn hảo!"
        },
        {
            img: "https://res.cloudinary.com/dy9md2des/image/upload/v1745592576/rgvfehektr7yjvilqsno.jpg",
            title: "Ưu đãi buffet ăn sáng",
            description: "Buffet chỉ 50.000đ - Thưởng thức hơn 20 món đa dạng, dinh dưỡng!"
        },
        {
            img: "https://res.cloudinary.com/dy9md2des/image/upload/v1745592438/dbapr26fatenh11fbpfu.jpg",
            title: "Tặng đĩa Táo tươi",
            description: "Miễn phí đĩa Táo (trị giá 100.000đ) cho đơn hàng từ 500.000đ trở lên!"
        },
        {
            img: "https://th.bing.com/th/id/OIP.ETqkCAoL8n-Cj2c8bj66vwHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
            title: "Miễn phí 1 suất ăn sáng",
            description: "Áp dụng cho tất cả khách đặt phòng trong tháng này."
        },
        {
            img: "https://th.bing.com/th/id/OIP.be8X58HBcRcKvSXINm0LKQHaHa?cb=iwc1&rs=1&pid=ImgDetMain",
            title: "Tặng voucher 500k",
            description: "Cho hóa đơn từ 3 triệu đồng trở lên."
        },
        {
            img: "https://victory.com.vn/wp-content/uploads/2023/02/111.png",
            title: "Giảm giá 10% cho lần đặt tiếp theo",
            description: "Dành cho khách hàng thân thiết của chúng tôi."
        },
        {
            img: "https://img.freepik.com/premium-psd/20-percentage-off-3d-render-isolated-premium-psd_629525-233.jpg?w=2000",
            title: "Giảm giá đặc biệt",
            description: "Giảm giá 20% cho tất cả các dịch vụ phòng."
        }
       
    ];

    // Số lượng hiển thị ban đầu là 6 ưu đãi
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3); // Tăng thêm 3 mỗi lần nhấn
    };

    return (
        <div className="offers-container">
            <h1>Ưu đãi đặc biệt dành cho bạn!</h1>
            <p className="offers-subtitle">Nhanh tay nhận ngay những phần quà hấp dẫn từ chúng tôi.</p>

            <div className="offers-list">
                {allOffers.slice(0, visibleCount).map((offer, index) => (
                    <div className="offer-card" key={index}>
                        <img src={offer.img} alt={offer.title} />
                        <h2>{offer.title}</h2>
                        <p>{offer.description}</p>
                    </div>
                ))}
            </div>

            {visibleCount < allOffers.length && (
                <button className="offers-button" onClick={handleLoadMore}>
                    Xem thêm ưu đãi
                </button>
            )}
        </div>
    );
};

export default Offers;
