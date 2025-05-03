import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-left">
          <h2 className="hotel-name">BamBooking</h2>
          <p className="hotel-address">
            13 Trịnh Văn Bô, Phương Canh, Nam Từ Liêm, TP Hà Nội
          </p>
        </div>

        <div className="footer-section footer-center">
          <ul className="footer-links">
            <li>
              <a href="/privacy">Privacy Center</a>
            </li>
            <li>
              <a href="/accessibility">Website Accessibility</a>
            </li>
            <li>
              <a href="/terms-and-conditions">Điều kiện & Điều khoản</a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-right">
          <p>Theo dõi chúng tôi:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/td.sunnn/" aria-label="Facebook">
              <Facebook />
              <span>Facebook</span>
            </a>
            <a aria-label="Instagram">
              <Instagram />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
