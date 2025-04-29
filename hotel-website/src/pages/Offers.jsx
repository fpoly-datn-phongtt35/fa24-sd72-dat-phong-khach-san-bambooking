import React, { useState } from 'react';
import '../styles/Offers.css';

const Offers = () => {
    const [itemsToShow, setItemsToShow] = useState(4);
    const itemsPerClick = 2;

    const fakeOffers = [
        {
            id: 1,
            tenDichVu: 'Ưu đãi Spa thư giãn',
            hinhAnh: 'https://th.bing.com/th/id/R.827b23ccaaec900ca4d37addd977df63?rik=ud7avRrWaBbnkQ&pid=ImgRaw&r=0',
            moTa: 'Thư giãn cơ thể và tinh thần với ưu đãi spa giảm giá đặc biệt trong tháng này.'
        },
        {
            id: 2,
            tenDichVu: "Miễn phí 1 suất ăn sáng",
            hinhAnh: "https://th.bing.com/th/id/OIP.ETqkCAoL8n-Cj2c8bj66vwHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
            moTa: "Áp dụng cho tất cả khách đặt phòng trong tháng này."
        },
        {
            id: 3,
            tenDichVu: 'Voucher nhà hàng ẩm thực',
            hinhAnh: 'https://th.bing.com/th/id/OIP.1UeCBgR-9ZNr-1-NfkzmbAHaE7?rs=1&pid=ImgDetMain',
            moTa: 'Nhận ngay voucher giảm 20% khi dùng bữa tại nhà hàng cao cấp của chúng tôi.'
        },
        {
            id: 4,
            tenDichVu: 'Ưu đãi phòng gym tháng',
            hinhAnh: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            moTa: 'Tháng tập miễn phí khi đăng ký gói 6 tháng tại phòng gym cao cấp.'
        },
        {
            id: 5,
            tenDichVu: 'Miễn phí khu vui chơi trẻ em',
            hinhAnh: 'https://goadesign.vn/wp-content/uploads/2023/05/thiet-ke-khu-vui-choi-tre-em-lien-he-11.jpg',
            moTa: 'Khuyến mãi đặc biệt cho gia đình có trẻ em khi lưu trú từ 3 đêm trở lên.'
        },
        {
            id: 6,
            tenDichVu: 'Giảm giá dịch vụ đưa đón',
            hinhAnh: 'https://th.bing.com/th/id/OIP.qeQBCXe1QjLO8sXQJAAgVgHaFu?rs=1&pid=ImgDetMain',
            moTa: 'Giảm ngay 15% khi sử dụng dịch vụ đưa đón sân bay trong tháng này.'
        },
        {
            id: 7,
            tenDichVu: "Giảm giá 10% cho lần đặt tiếp theo",
            hinhAnh: "https://victory.com.vn/wp-content/uploads/2023/02/111.png",
            moTa: "Dành cho khách hàng thân thiết của chúng tôi."
        },
        {
            id: 8,
            tenDichVu: "Giảm giá đặc biệt",
            hinhAnh: "https://img.freepik.com/premium-psd/20-percentage-off-3d-render-isolated-premium-psd_629525-233.jpg?w=2000",
            moTa: "Giảm giá 20% cho tất cả các dịch vụ phòng."
        }
    ];

    const offersToDisplay = fakeOffers.slice(0, itemsToShow);

    return (
        <div className="offers-container">
            <div className="banner">
                <img
                    src="http://khachsanbamboo.com/uploads/plugin/category/397/1588047039-2028625995-u-ai.jpg"
                    alt="Ưu đãi đặc bi"
                    className="banner-image"
                />
                <div className="banner-text">
                    <h1>Ưu Đãi Đặc Biệt</h1>
                    <p>Tiết kiệm nhiều hơn – Trải nghiệm nhiều hơn</p>
                </div>
            </div>

            <div className="offers-content">
                <div className="offers-list-ziczac">
                    {offersToDisplay.map((offer, index) => (
                        <div
                            key={offer.id}
                            className={`offer-item ${index % 2 !== 0 ? 'reverse' : ''}`}
                        >
                            <img
                                src={offer.hinhAnh}
                                alt={offer.tenDichVu}
                                className="offer-image-ziczac"
                            />
                            <div className="offer-text">
                                <h3>{offer.tenDichVu}</h3>
                                <p className="offer-description">{offer.moTa}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {itemsToShow < fakeOffers.length && (
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
        </div>
    );
};

export default Offers;
