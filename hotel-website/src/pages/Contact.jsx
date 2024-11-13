import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import '../styles/Contact.css';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    // Navigate to a thank you page or show a success message
    navigate('/thank-you');
  };

  return (
    <div className="contact-page">
      <h1>Liên hệ với chúng tôi</h1>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <div className="info-item">
            <MapPin className="icon" />
            <p>123 Đường ABC, Quận XYZ, Thành phố HCM</p>
          </div>
          <div className="info-item">
            <Phone className="icon" />
            <p>+84 123 456 789</p>
          </div>
          <div className="info-item">
            <Mail className="icon" />
            <p>info@khachsan.com</p>
          </div>
          <div className="booking-phone">
            <h3>Đặt phòng trực tiếp</h3>
            <p>+84 987 654 321</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Gửi tin nhắn cho chúng tôi</h2>
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên của bạn"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Tin nhắn</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Nhập tin nhắn của bạn"
              rows={4}
            />
          </div>
          <button type="submit" className="submit-button">Gửi tin nhắn</button>
        </form>
      </div>
    </div>
  );
}