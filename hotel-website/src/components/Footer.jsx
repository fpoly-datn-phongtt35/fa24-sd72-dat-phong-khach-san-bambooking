import React from "react";
import "../styles/Footer.css";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-left">
          <h2 className="hotel-name">Bamboo Hotel</h2>
          <p className="hotel-address">
            Lô 29.07-08, FLC Lux City Sầm Sơn, Thanh Hóa
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
          </ul>
        </div>

        <div className="footer-section footer-right">
          <p>Theo dõi chúng tôi:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/bambooking" aria-label="Facebook">
              <Facebook />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/bambooking"
              aria-label="Instagram"
            >
              <Instagram />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
