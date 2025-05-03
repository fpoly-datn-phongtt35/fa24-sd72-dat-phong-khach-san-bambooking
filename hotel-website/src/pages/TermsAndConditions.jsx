import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/TermsAndConditions.css";

const images = [
  "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/21/1170122/296817374_1015897554.jpg",
  "http://khachsanbamboo.com/uploads/plugin/custom_img/2020-06-02/1591108860-2125635346-custom.jpg",
  "http://khachsanbamboo.com/uploads/plugin/introduce/28/1584364392-1976447380-nha-hang-h-i-s-n-bi-n.jpg",
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  focusOnSelect: false,
  accessibility: false,
  swipeToSlide: true,
  adaptiveHeight: false,
};

const termsData = [
  {
    title: "1. Đặt phòng và Thanh toán",
    items: [
      "Khách hàng cần cung cấp thông tin chính xác khi đặt phòng, bao gồm họ tên, số điện thoại, và email.",
      "Đặt phòng chỉ được xác nhận sau khi khách xác nhận qua email khi đặt phòng hoặc qua số điện thoại.",
      "Giá phòng đã bao gồm thuế và phí dịch vụ. Các chi phí phát sinh (như dịch vụ ăn uống, spa, v.v.) sẽ được tính riêng.",
    ],
  },
  {
    title: "2. Chính sách Hủy phòng",
    items: [
      "Khách hàng có thể liên hệ đến khách sạn qua số hotline để hủy phòng.",
    ],
  },
  {
    title: "3. Nhận và Trả phòng",
    items: [
      "Thời gian nhận phòng: 14:00 (2:00 PM).",
      "Thời gian trả phòng: 12:00 (12:00 PM).",
      "Nhận phòng sớm hoặc trả phòng muộn phụ thuộc vào tình trạng phòng và có thể phát sinh phụ phí.",
      "Khách hàng cần xuất trình giấy tờ tùy thân (CMND/CCCD/Hộ chiếu) khi nhận phòng.",
    ],
  },
  {
    title: "4. Quy định sử dụng dịch vụ",
    items: [
      "Không hút thuốc trong phòng và các khu vực cấm hút thuốc trong khách sạn. Phí phạt 2.000.000 VND sẽ được áp dụng nếu vi phạm.",
      "Không mang thú cưng vào khách sạn, trừ trường hợp được phép với sự đồng ý trước từ ban quản lý.",
      "Khách hàng chịu trách nhiệm bồi thường thiệt hại nếu làm hư hỏng tài sản của khách sạn.",
    ],
  },
  {
    title: "5. Quy định về an toàn và bảo mật",
    items: [
      "Khách sạn không chịu trách nhiệm cho các tài sản cá nhân bị mất hoặc hư hỏng trong khuôn viên.",
      "Khách hàng cần tuân thủ các quy định an toàn cháy nổ và hướng dẫn của nhân viên khách sạn.",
      "Thông tin cá nhân của khách hàng được bảo mật và chỉ sử dụng cho mục đích đặt phòng hoặc cung cấp dịch vụ.",
    ],
  },
  {
    title: "6. Thay đổi và Hủy bỏ",
    items: [
      "Khách sạn có quyền thay đổi hoặc hủy đặt phòng trong trường hợp bất khả kháng (thiên tai, sự cố kỹ thuật, v.v.).",
    ],
  },
];

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const goToPrev = () => sliderRef.current.slickPrev();
  const goToNext = () => sliderRef.current.slickNext();

  return (
    <div className="terms-and-conditions">
      <section className="hero-slider">
        <Slider ref={sliderRef} {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="slide-item">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
        <div className="fixed-text">
          <h1>Điều kiện & Điều khoản</h1>
          <p>Chính sách và quy định của Khách sạn Bamboo</p>
        </div>
        <button className="custom-prev" onClick={goToPrev}>
          ❮
        </button>
        <button className="custom-next" onClick={goToNext}>
          ❯
        </button>
      </section>

      <section className="terms-content">
        <h2>Điều kiện và Điều khoản</h2>
        <div className="terms-container">
          {termsData.map((term, index) => (
            <div key={index} className="terms-item">
              <h3>{term.title}</h3>
              <ul>
                {term.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
