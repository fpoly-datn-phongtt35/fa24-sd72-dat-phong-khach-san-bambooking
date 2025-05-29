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
    title: "1. Chính sách phụ thu",
    items: [
      "Trả phòng muộn trong vòng 60 phút đầu tiên: Không tính phụ thu.",
      "Trả muộn từ 61–240 phút (1–4 tiếng): Phụ thu 30% giá phòng.",
      "Trả muộn từ 241–720 phút (4–12 tiếng): Phụ thu 50% giá phòng.",
      "Trả muộn quá 720 phút (>12 tiếng): Không tính phụ thu nhưng tính thêm 1 đêm lưu trú.",
      "Phụ thu khi vượt quá số khách tối đa: Tính theo số khách vượt × đơn giá phụ thu từng loại phòng.",
      "Trẻ dưới 12 tuổi không tính phụ thu.",
      "Đơn giá phụ thu: Phòng đơn 100.000 VNĐ/người, phòng đôi 150.000 VNĐ/người, phòng gia đình 250.000 VNĐ/người.",
      "Phụ thu thiếu/hỏng vật tư: Tính theo đơn giá vật tư × số lượng thiếu hoặc hỏng. Có thể kèm ảnh minh chứng.",
      "Phụ thu phát sinh do sử dụng dịch vụ thêm hoặc vi phạm quy định sẽ được ghi nhận và cộng vào hóa đơn.",
    ],
  },
  {
    title: "2. Chính sách hủy phòng",
    items: [
      "Hủy từ 7 ngày trở lên trước ngày nhận phòng: Hoàn 100% tiền cọc.",
      "Hủy từ 3–6 ngày trước ngày nhận phòng: Hoàn 50% tiền cọc.",
      "Hủy dưới 3 ngày: Không hoàn tiền cọc.",
      "Không thông báo và không đến nhận phòng (no-show): Không hoàn tiền cọc.",
      "Hủy trong vòng 3 giờ kể từ lúc đặt phòng: Hoàn 100% số tiền đã thanh toán.",
      "Trường hợp đặc biệt có lý do chính đáng (thiên tai, dịch bệnh, tai nạn...) có thể được hoàn tiền hoặc chuyển cọc sang lần đặt khác.",
      "Hoàn tiền qua tiền mặt tại khách sạn hoặc chuyển khoản (khách chịu phí nếu có).",
    ],
  },
  {
    title: "3. Chính sách đổi phòng",
    items: [
      "Khách có thể yêu cầu đổi phòng trước khi nhận phòng.",
      "Việc đổi phòng phụ thuộc vào tình trạng phòng trống tại thời điểm yêu cầu.",
    ],
  },
  {
    title: "4. Quy định khách sạn",
    items: [
      "Nhận phòng từ 14:00, trả phòng trước 12:00.",
      "Khách có trách nhiệm bảo quản vật tư, thiết bị trong phòng. Hư hỏng/mất mát sẽ bị tính phí theo giá niêm yết.",
      "Không hút thuốc trong phòng. Vi phạm sẽ bị phạt 300.000 VNĐ phí vệ sinh.",
      "Không gây ồn ào sau 22:00.",
      "Tự bảo quản tài sản cá nhân. Khách sạn không chịu trách nhiệm nếu mất mát/hư hỏng.",
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
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto"
              />
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