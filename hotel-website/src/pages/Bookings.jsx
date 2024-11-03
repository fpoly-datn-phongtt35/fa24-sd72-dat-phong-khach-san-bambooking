// pages/Bookings.jsx
import React, { useState } from 'react';
import '../styles/Bookings.css'; // Nếu cần thêm CSS riêng cho Bookings

const mockBookings = [
  { id: 1, room: 'Deluxe Room', date: '2024-10-30', status: 'Confirmed' },
  { id: 2, room: 'Standard Room', date: '2024-11-05', status: 'Pending' },
];

export default function Bookings() {
  const [bookings, setBookings] = useState(mockBookings);

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <div className="booking-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h2>{booking.room}</h2>
              <p>Date: {booking.date}</p>
              <p>Status: {booking.status}</p>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
  );
}
