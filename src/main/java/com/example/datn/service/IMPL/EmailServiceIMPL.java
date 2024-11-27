package com.example.datn.service.IMPL;

import com.example.datn.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceIMPL implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendThankYouEmail(String email, String fullName, String roomType, Double price, LocalDateTime checkInDate, LocalDateTime checkOutDate) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Cảm ơn bạn đã đặt phòng tại khách sạn của chúng tôi!");
            message.setText("Xin chào " + fullName + ",\n\n"
                    + "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. "
                    + "Thông tin phòng của bạn như sau:\n"
                    + "Loại phòng: " + roomType + "\n"
                    + "Giá phòng: " + price + " VND\n"
                    + "Ngày nhận phòng: " + checkInDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "\n"
                    + "Ngày trả phòng: " + checkOutDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "\n\n"
                    + "Chúng tôi rất mong được phục vụ bạn trong thời gian tới.\n\n"
                    + "Trân trọng,\n"
                    + "Khách sạn Bam");

            mailSender.send(message);
        } catch (Exception e) {
            // Log lỗi gửi email nếu có
            System.err.println("Lỗi khi gửi email chúc mừng: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
