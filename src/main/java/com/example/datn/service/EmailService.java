package com.example.datn.service;

import java.time.LocalDateTime;

public interface EmailService {
    void sendThankYouEmail(String email, String fullName, String roomType, Double price, LocalDateTime checkInDate, LocalDateTime checkOutDate);
}
