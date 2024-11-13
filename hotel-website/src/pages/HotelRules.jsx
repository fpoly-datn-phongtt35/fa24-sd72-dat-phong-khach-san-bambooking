import React from 'react';
import '../styles/HotelRules.css';

export default function HotelRules() {
  return (
    <div className="hotel-rules">
      <h1>Quy định của Khách sạn</h1>
      <section className="rule-section">
        <h2>Quy định chung</h2>
        <ul>
          <li>Giờ nhận phòng: 14:00</li>
          <li>Giờ trả phòng: 12:00</li>
          <li>Không hút thuốc trong phòng</li>
          <li>Không mang vật nuôi vào khách sạn (trừ động vật hỗ trợ)</li>
        </ul>
      </section>
      <section className="rule-section">
        <h2>Quy định về thanh toán</h2>
        <ul>
          <li>Đặt cọc 50% giá trị đặt phòng khi đặt phòng</li>
          <li>Thanh toán đầy đủ khi nhận phòng</li>
          <li>Chấp nhận thanh toán bằng tiền mặt, thẻ tín dụng, và chuyển khoản ngân hàng</li>
        </ul>
      </section>
      <section className="rule-section">
        <h2>Chính sách hủy phòng</h2>
        <ul>
          <li>Hủy phòng miễn phí trước 7 ngày so với ngày nhận phòng</li>
          <li>Hủy phòng trong vòng 3-7 ngày: phí 50% giá trị đặt phòng</li>
          <li>Hủy phòng trong vòng 3 ngày: phí 100% giá trị đặt phòng</li>
        </ul>
      </section>
      <section className="rule-section">
        <h2>Quy định về sử dụng tiện nghi</h2>
        <ul>
          <li>Bể bơi mở cửa từ 6:00 đến 22:00</li>
          <li>Phòng gym mở cửa 24/7</li>
          <li>Spa cần đặt lịch trước ít nhất 2 giờ</li>
        </ul>
      </section>
      <p className="disclaimer">
        Khách sạn có quyền thay đổi các quy định mà không cần báo trước. Vui lòng liên hệ với lễ tân để biết thêm chi tiết.
      </p>
    </div>
  );
}