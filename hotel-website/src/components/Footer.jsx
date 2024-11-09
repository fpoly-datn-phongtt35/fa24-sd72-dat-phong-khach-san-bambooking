import React from 'react';
import '../styles/Footer.css';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/privacy">Privacy Center</a>
          <a href="/accessibility">Website Accessibility</a>
        </div>
        <h2 className="hotel-name">Bam Booking</h2>
        <p className="hotel-address">123 Đường ABC, Quận XYZ, Thành phố HCM, Việt Nam 700000</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/bambooking" aria-label="Facebook">
            <Facebook />
          </a>
          <a href="https://www.instagram.com/bambooking" aria-label="Instagram">
            <Instagram />
          </a>
        </div>
      </div>
    </footer>
  );
}