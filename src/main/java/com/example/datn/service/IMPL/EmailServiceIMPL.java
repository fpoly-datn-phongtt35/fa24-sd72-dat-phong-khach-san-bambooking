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
    public void sendThankYouEmail(String email,
                                  String fullName,
                                  String loaiPhong,
                                  Double giaDat,
                                  LocalDateTime ngayNhanPhong,
                                  LocalDateTime ngayTraPhong,
                                  LocalDateTime ngayDatPhong,
                                  String maThongTinDatPhong,
                                  long soDem,
                                  Double tienPhuThu,
                                  Double tongTien,
                                  Double tienDatCoc) {
        try {
            // Định dạng ngày tháng chỉ hiển thị ngày
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            // Tạo nội dung email
            String emailContent = "Xin chào " + fullName + ",\n\n"
                    + "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Thông tin đặt phòng của bạn như sau:\n\n"
                    + "Loại phòng: " + loaiPhong + "\n"
                    + "Giá mỗi đêm: " + String.format("%.2f", giaDat) + " VND\n"
                    + "Số đêm: " + soDem + "\n"
                    + "Tiền phụ thu (nếu có): " + String.format("%.2f", tienPhuThu) + " VND\n"
                    + "Tổng tiền: " + String.format("%.2f", tongTien) + " VND\n"
                    + "Tiền đặt cọc: " + String.format("%.2f", tienDatCoc) + " VND\n"
                    + "Mã đặt phòng: " + maThongTinDatPhong + "\n\n"
                    + "Ngày đặt phòng: " + ngayDatPhong.format(dateFormatter) + "\n"
                    + "Ngày nhận phòng: " + ngayNhanPhong.format(dateFormatter) + "\n"
                    + "Ngày trả phòng: " + ngayTraPhong.format(dateFormatter) + "\n\n"
                    + "Chúng tôi rất mong được phục vụ bạn trong thời gian tới.\n\n"
                    + "Trân trọng,\n"
                    + "Khách sạn Bam";

            // Tạo đối tượng email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Cảm ơn bạn đã đặt phòng tại khách sạn của chúng tôi!");
            message.setText(emailContent);

            // Gửi email
            mailSender.send(message);
        } catch (Exception e) {
            // Log lỗi gửi email nếu có
            System.err.println("Lỗi khi gửi email chúc mừng: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
