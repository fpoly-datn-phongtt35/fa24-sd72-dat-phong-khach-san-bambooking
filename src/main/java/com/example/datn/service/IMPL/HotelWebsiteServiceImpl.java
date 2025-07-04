package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.EmailService;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.utilities.UniqueDatPhongCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Slf4j
@Service
public class HotelWebsiteServiceImpl implements HotelWebsiteService {
    private final JavaMailSender mailSender;
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DatPhongRepository datPhongRepository;

    @Autowired
    private ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @Autowired
    DatCocThanhToanRepository datCocThanhToanRepository;

    @Autowired
    XepPhongRepository xepPhongRepository;


    @Autowired
    private EmailService emailService;
    @Autowired
    private HoaDonRepository hoaDonRepository;

    public HotelWebsiteServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public List<DatPhong> getDPbyTenDangNhap(String tenDangNhap, String keyword, LocalDate ngayNhanPhong, LocalDate ngayTraPhong) {
        return thongTinDatPhongRepository.getDPbyTenDangNhap(tenDangNhap, keyword, ngayNhanPhong, ngayTraPhong);
    }

    @Override
    public List<HoaDon> getHDByidDatPhong(Integer idDatPhong) {
        return hoaDonRepository.getHDByidDatPhong(idDatPhong);
    }


    @Override
    public void tracuuLichSuDP(String keyword) {
        try {
            List<KhachHang> khachHangList = khachHangRepository.getKHbySDTorEmail(keyword);

            if (khachHangList == null || khachHangList.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy khách hàng nào với keyword: " + keyword);
            }

            // Trích xuất danh sách email từ danh sách KhachHang
            List<String> emailList = khachHangList.stream()
                    .map(KhachHang::getEmail)
                    .filter(email -> email != null && !email.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            // Kiểm tra nếu không có email hợp lệ
            if (emailList.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy email hợp lệ nào với keyword: " + keyword);
            }

            for (String email : emailList) {
                // Tạo MimeMessage để hỗ trợ HTML
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(email); // Gửi đến tất cả email trong danh sách
                helper.setSubject("Tra cứu lịch sử đặt phòng");

                // Nội dung HTML với liên kết ẩn
                String htmlContent = "<p>Chào bạn,</p>" +
                        "<p>Cảm ơn bạn đã lựa chọn BamBooking cho kỳ nghỉ vừa qua. " +
                        "Chúng tôi hy vọng bạn có những trải nghiệm tuyệt vời.</p>" +
                        "<p>Theo yêu cầu tra cứu lịch sử đặt phòng của bạn, bạn có thể xem chi tiết các thông tin đặt phòng bằng cách nhấp vào liên kết dưới đây:</p>" +
                        "<p><a href=\"http://localhost:3001/lich-su-dat-phong/" + email + "\">Xem chi tiết lịch sử đặt phòng</a></p>" +
                        "<p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href=\"mailto:support@bambooking.com\">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>\n" +
                        "<p style=\"margin-top: 20px;\">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>"+
                        "<p>Trân trọng,<br>Đội ngũ BamBooking</p>";

                helper.setText(htmlContent, true); // true để cho phép HTML

                // Gửi email
                mailSender.send(message);
                System.out.println("Email tra cứu lịch sử đặt phòng đã được gửi đến: " + String.join(", ", emailList));
            }

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận tra cứu đặt phòng: " + e.getMessage());
        }
    }


    @Override
    public List<DatPhong> getLichSuDPbyEmail(String email) {
        return datPhongRepository.getLichSuDPbyEmail(email);
    }

    @Override
    public void guiEmailXacNhandp(Integer idDatPhong) {
        try {
            DatPhongResponse datPhong = datPhongRepository.findByIdDatPhong(idDatPhong);
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(datPhong.getId());

            // Kiểm tra nếu ListTTDP rỗng
            if (ListTTDP.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy thông tin đặt phòng cho ID: " + idDatPhong);
            }

            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Integer iddp = datPhong.getId();
            Integer idKhachHang = datPhong.getKhachHang().getId();
            String hoTen = datPhong.getKhachHang().getHo() + " " + datPhong.getKhachHang().getTen();
            String sdt = datPhong.getKhachHang().getSdt();
            String email = datPhong.getKhachHang().getEmail();
            Integer soNguoi = datPhong.getSoNguoi();
            Integer treEm = datPhong.getSoTre();
            Double tongTien = datPhong.getTongTien();

            // Tạo chuỗi HTML cho danh sách chi tiết các phòng
            StringBuilder chiTietPhong = new StringBuilder();
            for (ThongTinDatPhong thongTin : ListTTDP) {
                chiTietPhong.append(String.format(
                        "<tr style=\"background-color: #f8f8f8;\">" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "</tr>",
                        thongTin.getLoaiPhong().getTenLoaiPhong(),
                        thongTin.getNgayNhanPhong(),
                        thongTin.getNgayTraPhong()
                ));
            }

            helper.setTo(email);
            helper.setSubject("Xác Nhận Đặt Phòng - BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #2c3e50;">Xác Nhận Đặt Phòng</h2>
                    <p>Chào <strong>%s</strong>,</p>
                    <p>Chúng tôi xin chân thành cảm ơn bạn đã lựa chọn <strong>BamBooking</strong> cho kỳ nghỉ của mình. Theo yêu cầu đặt phòng của bạn, chúng tôi muốn xác nhận lại các thông tin của bạn như sau:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Họ và tên</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số điện thoại</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số người lớn</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số trẻ em</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                        </tr>
                    </table>
                    <h3>Chi tiết các phòng đã đặt</h3>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #3498db; color: #fff;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Loại phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày nhận phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày trả phòng</th>
                        </tr>
                        %s
                    </table>
                    
                    <p>Nếu bạn thấy thông tin cá nhân chưa chính xác, vui lòng nhấn nút "Sửa Thông Tin Khách Hàng" để cập nhật.</p>
                    <p style="text-align: center;">
                        <a href="http://localhost:3001/update-kh/%s/%s" style="display: inline-block; padding: 10px 20px; background-color: #e67e22; color: #fff; text-decoration: none; border-radius: 5px;">Sửa thông Tin Khách Hàng</a>
                    </p>
                    <p hideous="true">Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                    <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                </div>
                """.formatted(
                    hoTen,
                    hoTen,
                    sdt,
                    email,
                    soNguoi,
                    treEm,
                    String.format("%,.0f", tongTien),
                    chiTietPhong.toString(),
                    iddp,
                    idKhachHang,
                    iddp
            );

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email xác nhận đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận đặt phòng: " + e.getMessage());
        }
    }


    @Override
    public boolean xacNhanDP(Integer iddp) {
        DatPhong datPhong = datPhongRepository.findByIDDPandTT(iddp, "Chưa xác nhận");
        if (!(datPhong == null)) {
            datPhong.setTrangThai("Đã xác nhận");
            datPhongRepository.save(datPhong);
            return true;
        }

        return false;
    }


    @Override
    public void emailDatPhongThanhCong(Integer iddp) {
        try {
            DatPhongResponse datPhong = datPhongRepository.findByIdDatPhong(iddp);
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(iddp);

            // Kiểm tra nếu ListTTDP rỗng
            if (ListTTDP.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy thông tin đặt phòng cho ID: " + iddp);
            }

            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String hoTen = datPhong.getKhachHang().getHo() + " " + datPhong.getKhachHang().getTen();
            String sdt = datPhong.getKhachHang().getSdt();
            String email = datPhong.getKhachHang().getEmail();
            Integer soNguoi = datPhong.getSoNguoi();
            Integer treEm = datPhong.getSoTre();
            Double tongTien = datPhong.getTongTien();

            // Tạo chuỗi HTML cho danh sách chi tiết các phòng
            StringBuilder chiTietPhong = new StringBuilder();
            for (ThongTinDatPhong thongTin : ListTTDP) {
                chiTietPhong.append(String.format(
                        "<tr style=\"background-color: #f8f8f8;\">" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "</tr>",
                        thongTin.getLoaiPhong().getTenLoaiPhong(),
                        thongTin.getNgayNhanPhong(),
                        thongTin.getNgayTraPhong()
                ));
            }

            helper.setTo(email);
            helper.setSubject("Đặt phòng thành công - BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #2c3e50;">Đặt Phòng Thành Công</h2>
                    <p>Chào <strong>%s</strong>,</p>
                    <p>Chúng tôi rất vui thông báo rằng đơn đặt phòng của bạn tại <strong>BamBooking</strong> đã được xác nhận thành công. Dưới đây là chi tiết đặt phòng của bạn:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Họ và tên</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số điện thoại</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số người</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số trẻ em</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                        </tr>
                    </table>
                    <h3>Chi tiết các phòng đã đặt</h3>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #3498db; color: #fff;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Loại phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày nhận phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày trả phòng</th>
                        </tr>
                        %s
                    </table>
                    <p style="text-align: center;">
                        <a href="http://localhost:3001/lich-su-dat-phong/%s" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xem lịch sử đặt phòng</a>
                    </p>
                    <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                    <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                </div>
                """.formatted(
                    hoTen,
                    hoTen,
                    sdt,
                    email,
                    soNguoi,
                    treEm,
                    String.format("%,.0f", tongTien),
                    chiTietPhong.toString(),
                    email
            );

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email thông báo đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận đặt phòng: " + e.getMessage());
        }
    }




    @Override
    public KhachHang updateKhachHang(KhachHangDatPhongRequest request) {
        KhachHang khachHang = khachHangRepository.getReferenceById(request.getId());
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgaySua(LocalDateTime.now());
        return khachHangRepository.save(khachHang);
    }




    @Override
    public void guiEmailXacNhandpsauUDKhachHang(Integer iddp) {
        try {
            DatPhongResponse datPhong = datPhongRepository.findByIdDatPhong(iddp);
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(iddp);

            // Kiểm tra nếu ListTTDP rỗng
            if (ListTTDP.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy thông tin đặt phòng cho ID: " + iddp);
            }

            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Integer idKhachHang = datPhong.getKhachHang().getId();
            String hoTen = datPhong.getKhachHang().getHo() + " " + datPhong.getKhachHang().getTen();
            String sdt = datPhong.getKhachHang().getSdt();
            String email = datPhong.getKhachHang().getEmail();
            Integer soNguoi = datPhong.getSoNguoi();
            Integer treEm = datPhong.getSoTre();
            Double tongTien = datPhong.getTongTien();

            // Tạo chuỗi HTML cho danh sách chi tiết các phòng
            StringBuilder chiTietPhong = new StringBuilder();
            for (ThongTinDatPhong thongTin : ListTTDP) {
                chiTietPhong.append(String.format(
                        "<tr style=\"background-color: #f8f8f8;\">" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "</tr>",
                        thongTin.getLoaiPhong().getTenLoaiPhong(),
                        thongTin.getNgayNhanPhong(),
                        thongTin.getNgayTraPhong()
                ));
            }

            helper.setTo(email);
            helper.setSubject("Xác Nhận Đặt Phòng - BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #2c3e50;">Xác Nhận Đặt Phòng</h2>
                    <p>Chào <strong>%s</strong>,</p>
                    <p>Chúng tôi xin chân thành cảm ơn bạn đã lựa chọn <strong>BamBooking</strong> cho kỳ nghỉ của mình. Theo yêu cầu đặt phòng của bạn, chúng tôi muốn xác nhận lại các thông tin của bạn như sau:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Họ và tên</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số điện thoại</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số người</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số trẻ em</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                        </tr>
                    </table>
                    <h3>Chi tiết các phòng đã đặt</h3>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #3498db; color: #fff;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Loại phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày nhận phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày trả phòng</th>
                        </tr>
                        %s
                    </table>
                    
                    <p>Nếu bạn thấy thông tin cá nhân chưa chính xác, vui lòng nhấn nút "Sửa Thông Tin Khách Hàng" để cập nhật.</p>
                    <p style="text-align: center;">
                        <a href="http://localhost:3001/update-kh/%s/%s" style="display: inline-block; padding: 10px 20px; background-color: #e67e22; color: #fff; text-decoration: none; border-radius: 5px;">Sửa thông Tin Khách Hàng</a>
                    </p>
                    <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                    <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                </div>
                """.formatted(
                    hoTen,
                    hoTen,
                    sdt,
                    email,
                    soNguoi,
                    treEm,
                    String.format("%,.0f", tongTien),
                    chiTietPhong.toString(),
                    iddp,
                    idKhachHang,
                    iddp
            );

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email xác nhận đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận đặt phòng: " + e.getMessage());
        }
    }


    @Override
    public boolean dsTTDPcothehuy(Integer iddp) {
        List<String> trangThaiList = Arrays.asList("Chưa xếp","Đã xếp");
        List<String> trangThaiList2 = Arrays.asList("Đang ở","Đã trả phòng");
        List<ThongTinDatPhong> thongTinDatPhong = thongTinDatPhongRepository.findByIDDatPhongandTT(iddp,trangThaiList);
        List<ThongTinDatPhong> thongTinDatPhong2 = thongTinDatPhongRepository.findByIDDatPhongandTT(iddp,trangThaiList2);
        if (thongTinDatPhong.isEmpty()) {
            return false;
        }else if(!thongTinDatPhong2.isEmpty()){
            return false;
        }else
            return true;

    }

    @Override
    public void huyDPandTTDP(Integer iddp) {
        DatPhong dp = datPhongRepository.findById(iddp).get();



        LocalDateTime ngayDatPhong = dp.getNgayDat();


        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByMaDatPhong(dp.getMaDatPhong());


        LocalDateTime ngayNhanPhong = ttdps.get(0).getNgayNhanPhong();


        String trangThaiThanhToan = ttdps.get(0).getTrangThaiThanhToan();
        String ghiChuHoanTien;


            // Hủy trên web
            DatCocThanhToan dctt = datCocThanhToanRepository.findByDatPhongIdAndTrangThai(dp.getId(), "PAID")
                    .orElseThrow(() -> new EntityNotFountException("Không tìm thấy bản ghi thanh toán với trạng thái PAID cho đặt phòng có id: " + dp.getId()));

            String loaiThanhToan = dctt.getLoaiThanhToan();
            double tienThanhToan = dctt.getTienThanhToan();
            double tienHoan = 0.0;

            LocalDateTime now = LocalDateTime.now();
            if (ChronoUnit.HOURS.between(ngayDatPhong, now) <= 3) {
                tienHoan = tienThanhToan;
                ghiChuHoanTien = String.format("Hủy qua web trong vòng 3 giờ kể từ lúc đặt (%s), hoàn 100%% tiền thanh toán: %.2f VND",
                        ngayDatPhong, tienHoan);
            } else {
                long dayToCheckIn = ChronoUnit.DAYS.between(LocalDate.now(), ngayNhanPhong.toLocalDate());
                if ("Đặt cọc".equalsIgnoreCase(loaiThanhToan)) {
                    if (dayToCheckIn >= 7) {
                        tienHoan = tienThanhToan;
                        ghiChuHoanTien = String.format("Hủy qua web từ 7 ngày trở lên trước ngày nhận phòng (%s), hoàn 100%% tiền cọc: %.2f VND",
                                ngayNhanPhong.toLocalDate(), tienHoan);
                    } else if (dayToCheckIn >= 3) {
                        tienHoan = tienThanhToan * 0.5;
                        ghiChuHoanTien = String.format("Hủy qua web từ 3-6 ngày trước ngày nhận phòng (%s), hoàn 50%% tiền cọc: %.2f VND",
                                ngayNhanPhong.toLocalDate(), tienHoan);
                    } else {
                        ghiChuHoanTien = String.format("Hủy qua web dưới 3 ngày trước ngày nhận phòng (%s) hoặc No-show, không hoàn tiền cọc",
                                ngayNhanPhong.toLocalDate());
                    }
                } else if ("Thanh toán trước".equalsIgnoreCase(loaiThanhToan)) {
                    if (dayToCheckIn >= 7) {
                        tienHoan = tienThanhToan;
                        ghiChuHoanTien = String.format("Hủy qua web từ 7 ngày trở lên trước ngày nhận phòng (%s), hoàn 100%% tiền thanh toán: %.2f VND",
                                ngayNhanPhong.toLocalDate(), tienHoan);
                    } else if (dayToCheckIn >= 3) {
                        tienHoan = tienThanhToan * 0.5;
                        ghiChuHoanTien = String.format("Hủy qua web từ 3-6 ngày trước ngày nhận phòng (%s), hoàn 50%% tiền thanh toán: %.2f VND",
                                ngayNhanPhong.toLocalDate(), tienHoan);
                    } else {
                        ghiChuHoanTien = String.format("Hủy qua web dưới 3 ngày trước ngày nhận phòng (%s) hoặc No-show, không hoàn tiền",
                                ngayNhanPhong.toLocalDate());
                    }
                } else {
                    throw new InvalidDataException("Loại thanh toán không hợp lệ: " + loaiThanhToan);
                }
            }

            dp.setGhiChu(ghiChuHoanTien);
            dp.setTrangThai("Đã hủy");
            datPhongRepository.save(dp);

            dctt.setTrangThai("CANCELLED");
            datCocThanhToanRepository.save(dctt);

            for (ThongTinDatPhong ttdp : ttdps) {
                ttdp.setGhiChu(ghiChuHoanTien);
                ttdp.setTrangThai("Đã hủy");
                thongTinDatPhongRepository.save(ttdp);

                XepPhong xp = xepPhongRepository.getByMaTTDP(ttdp.getMaThongTinDatPhong());
                if (xp != null) {
                    xp.setTrangThai("Đã hủy");
                    xepPhongRepository.save(xp);
                }
            }

            try {
                sendCancellationEmail(dp, tienHoan);
            } catch (MessagingException e) {
                log.error("Lỗi khi gửi email thông báo hủy đặt phòng mã: {}", iddp, e);
            }

    }

    @Override
    public void huyTTDP(Integer idTTDP) {
        ThongTinDatPhong thongTinDatPhong = thongTinDatPhongRepository.getTTDPById(idTTDP);
        thongTinDatPhong.setTrangThai("Đã hủy");
        thongTinDatPhongRepository.save(thongTinDatPhong);

        DatPhong dp = datPhongRepository.findByMaDatPhong(thongTinDatPhong.getDatPhong().getMaDatPhong());
        List<ThongTinDatPhong> allTtdp = thongTinDatPhongRepository.findByIDDatPhong(thongTinDatPhong.getDatPhong().getId());
        boolean allCancelled = allTtdp.stream().allMatch(item -> "Đã hủy".equals(item.getTrangThai()));

        // Nếu tất cả TTDP đều ở trạng thái "Da huy", cập nhật trạng thái DatPhong
        if (allCancelled) {
            dp.setTrangThai("Đã hủy");
            datPhongRepository.save(dp);
        }
    }

    @Override
    public void guiEmailXacNhanHuyDP(Integer iddp) {
        try {
            DatPhongResponse datPhong = datPhongRepository.findByIdDatPhong(iddp);
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(iddp);

            // Kiểm tra nếu ListTTDP rỗng
            if (ListTTDP.isEmpty()) {
                throw new InvalidDataException("Không tìm thấy thông tin đặt phòng cho ID: " + iddp);
            }

            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Integer idKhachHang = datPhong.getKhachHang().getId();
            String hoTen = datPhong.getKhachHang().getHo() + " " + datPhong.getKhachHang().getTen();
            String sdt = datPhong.getKhachHang().getSdt();
            String email = datPhong.getKhachHang().getEmail();
            Integer soNguoi = datPhong.getSoNguoi();
            Integer treEm = datPhong.getSoTre();
            Double tongTien = datPhong.getTongTien();

            // Tạo chuỗi HTML cho danh sách chi tiết các phòng
            StringBuilder chiTietPhong = new StringBuilder();
            for (ThongTinDatPhong thongTin : ListTTDP) {
                chiTietPhong.append(String.format(
                        "<tr style=\"background-color: #f8f8f8;\">" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                                "</tr>",
                        thongTin.getLoaiPhong().getTenLoaiPhong(),
                        thongTin.getNgayNhanPhong(),
                        thongTin.getNgayTraPhong()
                ));
            }

            helper.setTo(email);
            helper.setSubject("Xác Nhận Hủy Đặt Phòng - BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #2c3e50;">Xác Nhận Hủy Đặt Phòng</h2>
                    <p>Chào <strong>%s</strong>,</p>
                    <p>Theo yêu cầu hủy đặt phòng của bạn, chúng tôi muốn xác nhận lại thông tin đơn đặt phòng muốn hủy của bạn như sau:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Họ và tên</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số điện thoại</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số người</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số trẻ em</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                        </tr>
                    </table>
                    <h3>Chi tiết các phòng đã đặt</h3>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #3498db; color: #fff;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Loại phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày nhận phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày trả phòng</th>
                        </tr>
                        %s
                    </table>
                    <p style="text-align: center;">
                        <a href="http://localhost:3001/cancel-dat-phong/%s" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xác Nhận Hủy Đặt Phòng</a>
                    </p>
                    <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                    <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                </div>
                """.formatted(
                    hoTen,
                    hoTen,
                    sdt,
                    email,
                    soNguoi,
                    treEm,
                    String.format("%,.0f", tongTien),
                    chiTietPhong.toString(),
                    iddp
            );

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email xác nhận hủy đặt phòng đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận hủy đặt phòng: " + e.getMessage());
        }
    }


    @Override
    public void guiEmailXacNhanHuyTTDP(Integer idTTDP) {
        try {
            ThongTinDatPhong thongTinDatPhong = thongTinDatPhongRepository.findById(idTTDP)
                    .orElseThrow(() -> new InvalidDataException("Không tìm thấy thông tin đặt phòng cho ID: " + idTTDP));

            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Integer idKhachHang = thongTinDatPhong.getDatPhong().getKhachHang().getId();
            String hoTen = thongTinDatPhong.getDatPhong().getKhachHang().getHo() + " " + thongTinDatPhong.getDatPhong().getKhachHang().getTen();
            String sdt = thongTinDatPhong.getDatPhong().getKhachHang().getSdt();
            String email = thongTinDatPhong.getDatPhong().getKhachHang().getEmail();
            Integer soNguoi = thongTinDatPhong.getSoNguoi();
            Integer treEm = thongTinDatPhong.getSoTre();
            Double giaDat = thongTinDatPhong.getGiaDat();
            String loaiPhong = thongTinDatPhong.getLoaiPhong().getTenLoaiPhong();
            LocalDateTime ngayNhanPhong = thongTinDatPhong.getNgayNhanPhong();
            LocalDateTime ngayTraPhong = thongTinDatPhong.getNgayTraPhong();

            // Tạo chuỗi HTML cho chi tiết thông tin đặt phòng
            String chiTietPhong = String.format(
                    "<tr style=\"background-color: #f8f8f8;\">" +
                            "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                            "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                            "<td style=\"padding: 10px; border: 1px solid #ddd;\">%s</td>" +
                            "</tr>",
                    loaiPhong,
                    ngayNhanPhong,
                    ngayTraPhong
            );

            helper.setTo(email);
            helper.setSubject("Xác Nhận Hủy Thông Tin Đặt Phòng - BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #2c3e50;">Xác Nhận Hủy Thông Tin Đặt Phòng</h2>
                    <p>Chào <strong>%s</strong>,</p>
                    <p>Theo yêu cầu hủy thông tin đặt phòng của bạn, chúng tôi muốn xác nhận lại thông tin đơn đặt phòng muốn hủy của bạn như sau:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Họ và tên</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số điện thoại</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số người</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số trẻ em</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%d</td>
                        </tr>
                        <tr style="background-color: #f8f8f8;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                        </tr>
                    </table>
                    <h3>Chi tiết thông tin đặt phòng đã hủy</h3>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #3498db; color: #fff;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Loại phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày nhận phòng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Ngày trả phòng</th>
                        </tr>
                        %s
                    </table>
                    <p style="text-align: center;">
                        <a href="http://localhost:3001/cancel-ttdp/%s" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xác Nhận Hủy Đặt Phòng</a>
                    </p>
                    <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                    <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                </div>
                """.formatted(
                    hoTen,
                    hoTen,
                    sdt,
                    email,
                    soNguoi,
                    treEm,
                    String.format("%,.0f", giaDat),
                    chiTietPhong,
                    idTTDP
            );

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email xác nhận hủy đặt phòng đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận hủy đặt phòng: " + e.getMessage());
        }
    }

    public DatPhong getByIDDatPhong(Integer id){
        return datPhongRepository.findById(id).get();
    }
    private void sendCancellationEmail(DatPhong dp, double tienHoan) throws MessagingException {
        if (dp.getKhachHang() == null || dp.getKhachHang().getEmail() == null) {
            log.warn("Không thể gửi email cho đặt phòng mã {} vì email khách hàng không hợp lệ.", dp.getMaDatPhong());
            return;
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(dp.getKhachHang().getEmail());
        helper.setSubject("Thông báo hủy đặt phòng");
        helper.setText(
                "Kính gửi " + dp.getFullNameKhachHang() + ",\n\n" +
                        "Đặt phòng của bạn với mã " + dp.getMaDatPhong() + " đã được hủy.\n" +
                        "Số tiền hoàn: " + String.format("%.2f", tienHoan) + " VND.\n" +
                        "Chi tiết: " + dp.getGhiChu() + ".\n" +
                        "Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ thêm.\n\n" +
                        "Trân trọng,\nĐội ngũ khách sạn", true
        );

        mailSender.send(mimeMessage);
    }



}
