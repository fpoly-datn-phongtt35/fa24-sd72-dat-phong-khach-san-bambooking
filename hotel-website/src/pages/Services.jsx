import React, { useState } from 'react';
import '../styles/Services.css';

const Services = () => {
    const [itemsToShow, setItemsToShow] = useState(4);
    const itemsPerClick = 2;

    const fakeServices = [
        {
            id: 1,
            tenDichVu: 'Dịch vụ Spa thư giãn',
            hinhAnh: 'https://th.bing.com/th/id/R.827b23ccaaec900ca4d37addd977df63?rik=ud7avRrWaBbnkQ&pid=ImgRaw&r=0',
            moTa: 'Thư giãn cơ thể và tinh thần với dịch vụ spa chuyên nghiệp, sử dụng tinh dầu thiên nhiên và kỹ thuật massage Thụy Điển.'
        },
        {
            id: 2,
            tenDichVu: 'Bể bơi vô cực',
            hinhAnh: 'https://file.hstatic.net/1000054905/file/tai-danang-golden-bay-04_24597140fb2c40438a4c98201939e0e5.jpg',
            moTa: 'Tận hưởng làn nước trong xanh cùng tầm nhìn ra toàn cảnh thành phố từ bể bơi vô cực hiện đại và đẳng cấp.'
        },
        {
            id: 3,
            tenDichVu: 'Nhà hàng ẩm thực Á - Âu',
            hinhAnh: 'https://th.bing.com/th/id/OIP.1UeCBgR-9ZNr-1-NfkzmbAHaE7?rs=1&pid=ImgDetMain',
            moTa: 'Thưởng thức tinh hoa ẩm thực Á - Âu với thực đơn phong phú, nguyên liệu tươi ngon và đầu bếp hàng đầu.'
        },
        {
            id: 4,
            tenDichVu: 'Phòng gym cao cấp',
            hinhAnh: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            moTa: 'Giữ dáng và nâng cao sức khỏe tại phòng gym hiện đại, đầy đủ thiết bị và huấn luyện viên cá nhân chuyên nghiệp.'
        },
        {
            id: 5,
            tenDichVu: 'Khu vui chơi trẻ em',
            hinhAnh: 'https://goadesign.vn/wp-content/uploads/2023/05/thiet-ke-khu-vui-choi-tre-em-lien-he-11.jpg',
            moTa: 'Không gian an toàn và vui nhộn dành riêng cho trẻ nhỏ với trò chơi sáng tạo và đội ngũ giám sát tận tình.'
        },
        {
            id: 6,
            tenDichVu: 'Dịch vụ ăn uống tại phòng',
            hinhAnh: 'https://th.bing.com/th/id/OIP.ttbXGoN7D-H-4V8Lz0Fb_QHaE8?w=2560&h=1710&rs=1&pid=ImgDetMain',
            moTa: 'Thưởng thức các món ăn ngon ngay tại phòng với thực đơn đa dạng và phục vụ tận nơi, nhanh chóng và tiện lợi.'
        },
        {
            id: 7,
            tenDichVu: 'Dịch vụ giặt ủi',
            hinhAnh: 'https://img.freepik.com/premium-photo/row-washing-machine-laundry-business-public-store-generative-ai_1001448-464.jpg',
            moTa: 'Đảm bảo quần áo của bạn luôn sạch sẽ và thơm mát với dịch vụ giặt ủi chuyên nghiệp và nhanh chóng.'
        },
        {
            id: 8,
            tenDichVu: 'Quầy bar trên tầng thượng',
            hinhAnh: 'https://bluecons.vn/wp-content/uploads/quay-bar-san-thuong-1-1.jpg',
            moTa: 'Thưởng thức cocktail độc đáo trong không gian mở với âm nhạc sôi động và view thành phố tuyệt đẹp vào ban đêm.'
        }
    ];

    const servicesToDisplay = fakeServices.slice(0, itemsToShow);

    return (
        <div className="services-container">
            {/* Banner */}
            <div className="banner">
                <img
                    src="http://khachsanbamboo.com/uploads/plugin/category/391/1588043504-216790131-danh-m-c-d-ch-v-amp-ti-n-ich.jpg"
                    alt="Dịch vụ nổi bật"
                    className="banner-image"
                />
                <div className="banner-text">
                    <h1>Dịch Vụ Của Chúng Tôi</h1>
                    <p>Chăm sóc bạn từng chi tiết nhỏ</p>
                </div>
            </div>

            <div className="services-content">
                <div className="services-list-ziczac">
                    {servicesToDisplay.map((service, index) => (
                        <div
                            key={service.id}
                            className={`service-item ${index % 2 !== 0 ? 'reverse' : ''}`}
                        >
                            <img
                                src={service.hinhAnh}
                                alt={service.tenDichVu}
                                className="service-image-ziczac"
                            />
                            <div className="service-text">
                                <h3>{service.tenDichVu}</h3>
                                <p className="service-description">{service.moTa}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {itemsToShow < fakeServices.length && (
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

export default Services;
