import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDanhGia } from '../services/DanhGia';
import '../styles/Information.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Information() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const amenitiesSliderRef = useRef(null);
  const reviewsSliderRef = useRef(null); // Thêm ref cho slider đánh giá
  
  const [reviews, setReviews] = useState([]); // State để lưu danh sách đánh giá

  // Gọi API để lấy danh sách đánh giá khi component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllDanhGia();
        setReviews(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };
    fetchReviews();
  }, []);

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

  const amenitiesSliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    adaptiveHeight: true,
  };

  // Cấu hình cho slider đánh giá
  const reviewsSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    adaptiveHeight: true,
  };

  const images = [
    'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/21/1170122/296817374_1015897554.jpg',
    'http://khachsanbamboo.com/uploads/plugin/custom_img/2020-06-02/1591108860-2125635346-custom.jpg',
    'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/21/1170122/296817374_1015897554.jpg',
    'http://khachsanbamboo.com/uploads/plugin/introduce/28/1584364392-1976447380-nha-hang-h-i-s-n-bi-n.jpg',
  ];

  const amenities = [
    {
      image: 'http://khachsanbamboo.com/uploads/plugin/introduce/30/1591120273-199453929-b-b-i-vo-c-c.jpg',
      text: 'Hồ bơi vô cực',
    },
    {
      image: 'http://khachsanbamboo.com/uploads/plugin/introduce/28/1584364392-1976447380-nha-hang-h-i-s-n-bi-n.jpg',
      text: 'Nhà hàng sang trọng',
    },
    {
      image: 'http://khachsanbamboo.com/uploads/plugin/introduce/31/1587633796-1674813772-drinks-amp-cafe.jpg',
      text: 'Drinks & Café',
    },
    {
      image: 'https://levelfyc.com/wp-content/uploads/2025/01/phong-gym-dep-2.jpg',
      text: 'Phòng gym cao cấp',
    },
    {
      image: 'https://premierresidencesphuquoc.com/wp-content/uploads/sites/169/2023/10/Spa_11-min.jpg',
      text: 'Spa & Chăm sóc sức khỏe',
    },
    {
      image: 'https://pondo.vn/wp-content/uploads/2023/11/z4841841849634_09e648d3efaaf5daf4fbec1dfa1947f2.jpg',
      text: 'Dịch vụ đưa đón cao cấp',
    },
  ];

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToAmenitiesPrev = () => {
    amenitiesSliderRef.current.slickPrev();
  };

  const goToAmenitiesNext = () => {
    amenitiesSliderRef.current.slickNext();
  };

  return (
    <div className="information">
      <section className="hero-slider">
        <Slider ref={sliderRef} {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="slide-item">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
        <div className="fixed-text">
          <h1>Giới thiệu Khách sạn</h1>
          <p>Trải nghiệm nghỉ dưỡng tuyệt vời giữa lòng thiên nhiên</p>
        </div>
        <button className="custom-prev" onClick={goToPrev}>
          ❮
        </button>
        <button className="custom-next" onClick={goToNext}>
          ❯
        </button>
      </section>

      <section className="description">
        <h2>Về chúng tôi</h2>
        <div className="description-content">
          <div className="description-left">
            <p>
              Nằm ngay sát bãi biển Sầm Sơn thơ mộng, nước biển trong xanh, cát trắng mịn màng trải dài bất tận,
              gió biển mát lạnh, không khí trong lành tự nhiên, Bamboo Hotel là một cái tên nổi bật thuộc Quần
              thể du lịch nghỉ dưỡng FLC Lux City Sầm Sơn ‘Thành phố không ngủ’ chạy dọc bờ biển với gần 70 tiện
              ích đi kèm như sân Gofl đẳng cấp quốc tế, công viên, bãi đỗ xe, phòng gym, spa, shopping, bến du thuyền
              đẳng cấp 5* đầu tiên tại Việt Nam và bể bơi nước mặn 5000 m2.
            </p>
            <p>
              Bamboo Hotel gồm 22 phòng nghỉ được thiết kế thanh lịch hiện đại, nội thất tiêu chuẩn, tiện nghi hoàn hảo
              và cũng là khách sạn duy nhất hiện nay tại Sầm Sơn được thiết kế bể bơi vô cực phá vỡ mọi giới hạn về tầm
              nhìn nằm ngay trên tầng thượng khách sạn, mang đến cho Quý khách cảm giác thư thái, dễ chịu. Bamboo Hotel
              chắc chắn là điểm dừng chân lý tưởng để thư giãn và khơi dậy mọi giác quan của bạn.
            </p>
          </div>

          <div className="description-right">
            <h3 className="description-right-tittle">Chứng chỉ & Đánh giá</h3>
            <ul>
              <li>Chứng nhận 5 sao từ Hiệp hội Du lịch Việt Nam (2023)</li>
              <li>Đánh giá 4.8/5 từ khách hàng</li>
              <li>Giải thưởng "Khách sạn thân thiện với môi trường" (2022)</li>
              <li>Chứng nhận an toàn vệ sinh từ Bộ Y tế</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hotel-rooms">
        <h2>Phòng Khách Sạn</h2>
        <p>
          Khách sạn gồm 22 phòng nghỉ, được thiết kế theo tiêu chuẩn cao cấp và tiện nghi hiện đại. Đặc biệt, phòng Deluxe, Superior có ban công thoáng
          mát, tầm nhìn bao quát biển Sầm Sơn trong lành, xanh bất ngần tầm mắt.
        </p>
        <div className="rooms-grid">
          <div className="room-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UV9aWuwYJZBXVfosPOanURgq0m8JESqRIA&s"
              alt="Phòng Đơn"
            />
            <h3>Phòng Đơn</h3>
          </div>
          <div className="room-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UV9aWuwYJZBXVfosPOanURgq0m8JESqRIA&s"
              alt="Phòng Đôi"
            />
            <h3>Phòng Đôi</h3>
          </div>
          <div className="room-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UV9aWuwYJZBXVfosPOanURgq0m8JESqRIA&s"
              alt="Phòng Gia Đình"
            />
            <h3>Phòng Gia Đình</h3>
          </div>
        </div>
      </section>

      <section className="amenities">
        <h2>Tiện ích nổi bật</h2>
        <div className="amenities-slider">
          <Slider ref={amenitiesSliderRef} {...amenitiesSliderSettings}>
            {amenities.map((amenity, index) => (
              <div key={index} className="amenity-slide">
                <img src={amenity.image} alt={amenity.text} />
                <p>{amenity.text}</p>
              </div>
            ))}
          </Slider>
          <button className="amenities-prev" onClick={goToAmenitiesPrev}>
            ❮
          </button>
          <button className="amenities-next" onClick={goToAmenitiesNext}>
            ❯
          </button>
        </div>
      </section>

      <section className="reviews">
        <h2>Đánh giá từ khách hàng</h2>
        <div className="reviews-slider">
          <Slider ref={reviewsSliderRef} {...reviewsSliderSettings}>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-slide">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[...Array(review.stars)].map((_, i) => (
                          <span key={i} className="review-stars">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">
                      {review.nhanXet}
                    </p>
                    <p className="reviewer-name">
                      {review.khachHang.ho + " " + review.khachHang.ten || "Khách hàng"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="review-slide">
                <p className="review-comment">
                  Chưa có đánh giá nào cho khách sạn này.
                </p>
              </div>
            )}
          </Slider>
          
        </div>
      </section>
    </div>
  );
}