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
            tenDichVu: 'Bữa tối miễn phí ngày đầu',
            hinhAnh: 'https://th.bing.com/th/id/OIP.WJLMO13n11uMQuHzoLOrqAHaEK?rs=1&pid=ImgDetMain',
            moTa: 'Tặng ngay 1 bữa tối miễn phí tại nhà hàng cho khách đặt phòng trong ngày đầu tiên.'
        },
        {
            id: 4,
            tenDichVu: 'Miễn phí sử dụng phòng gym',
            hinhAnh: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            moTa: 'Khách lưu trú được sử dụng phòng gym với đầy đủ thiết bị miễn phí.'
        },
        {
            id: 5,
            tenDichVu: 'Miễn phí khu vui chơi trẻ em',
            hinhAnh: 'https://goadesign.vn/wp-content/uploads/2023/05/thiet-ke-khu-vui-choi-tre-em-lien-he-11.jpg',
            moTa: 'Khuyến mãi đặc biệt cho gia đình có trẻ em khi lưu trú từ 3 đêm trở lên.'
        },
        {
            id: 6,
            tenDichVu: 'Tặng nước suối mỗi ngày',
            hinhAnh: 'https://res.cloudinary.com/dy9md2des/image/upload/v1745592072/mko3aeymhdxpvzfdrktx.png',
            moTa: 'Mỗi ngày, mỗi phòng đều được cung cấp 2 chai nước suối miễn phí.'
        },
        {
            id: 7,
            tenDichVu: 'Tour tham quan miễn phí',
            hinhAnh: 'https://th.bing.com/th/id/R.c4c8d4620e80088dcd4b4cbd251ef9a8?rik=KXXCwom%2bwsWBrA&pid=ImgRaw&r=0',
            moTa: 'Tặng tour tham quan thành phố ngắn trong ngày cho khách lưu trú từ 2 đêm trở lên.'
        },
        {
            id: 8,
            tenDichVu: 'Phục vụ thức ăn tại phòng',
            hinhAnh: 'https://th.bing.com/th/id/OIP.ttbXGoN7D-H-4V8Lz0Fb_QHaE8?w=2560&h=1710&rs=1&pid=ImgDetMain',
            moTa: 'Thưởng thức bữa ăn ngay tại phòng với dịch vụ tận nơi nhanh chóng.'
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
