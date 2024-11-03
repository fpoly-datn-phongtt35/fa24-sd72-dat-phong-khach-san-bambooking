import React from 'react';
import '../styles/Footer.css'; // Import CSS cho Footer nếu cần

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Bam Booking. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | 
          <a href="/terms-of-service"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
