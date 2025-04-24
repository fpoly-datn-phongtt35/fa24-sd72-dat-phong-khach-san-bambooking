package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.*;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.EmailService;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.utilities.UniqueDatPhongCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private EmailService emailService;
    @Autowired
    private HoaDonRepository hoaDonRepository;

    public HotelWebsiteServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(false);

        KhachHang savedKhachHang = khachHangRepository.save(khachHang);
        return savedKhachHang;
    }

    @Override
    public DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        DatPhongResponse datPhongResponse = new DatPhongResponse();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setGhiChu("");
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setNgayDat(LocalDate.now());
        datPhong.setTrangThai("Pending");
        DatPhong dp = datPhongRepository.save(datPhong);
        datPhongResponse.setId(dp.getId());
        datPhongResponse.setMaDatPhong(dp.getMaDatPhong());
        datPhongResponse.setKhachHang(dp.getKhachHang());
        datPhongResponse.setTongTien(dp.getTongTien());
        datPhongResponse.setNgayDat(dp.getNgayDat());
        datPhongResponse.setGhiChu(dp.getGhiChu());
        datPhongResponse.setTrangThai(dp.getTrangThai());
        return datPhongResponse;
    }

    @Override
    public ThongTinDatPhong add(TTDPRequest request) {
        ThongTinDatPhong ttdp = new ThongTinDatPhong();
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        UniqueDatPhongCode code = new UniqueDatPhongCode();

        // Tính số đêm và tiền phòng
        long soDem = ChronoUnit.DAYS.between(request.getNgayNhanPhong(), request.getNgayTraPhong());
        Double tienPhong = soDem * lp.getDonGia();

        // Kiểm tra số người và tính tiền phụ thu nếu có
        long soNguoiToiDa = lp.getSoKhachToiDa();
        long soNguoi = request.getSoNguoi();
        Double tienPhuThu = 0.0;
        if (soNguoi > soNguoiToiDa) {
            tienPhuThu += (soNguoi - soNguoiToiDa) * lp.getDonGiaPhuThu();
        }

        // Cập nhật thông tin đặt phòng
        DatPhong dp = request.getDatPhong();
        dp.setTongTien(dp.getTongTien() + tienPhong + tienPhuThu);

        // Thiết lập các thông tin cho ThongTinDatPhong
        ttdp.setDatPhong(dp);
        ttdp.setLoaiPhong(lp);
        ttdp.setMaThongTinDatPhong(code.generateUniqueCodeTTDP(thongTinDatPhongRepository.findAll()));
        ttdp.setGiaDat(lp.getDonGia());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());

        // Lưu thông tin đặt phòng và thông tin chi tiết
        datPhongRepository.save(dp);
        ThongTinDatPhong savedTTDP = thongTinDatPhongRepository.save(ttdp);

        // Gửi email chúc mừng
        Double finalTienPhuThu = tienPhuThu;
        new Thread(() -> {
            try {
                String loaiPhong = savedTTDP.getLoaiPhong().getTenLoaiPhong();
                Double giaDat = savedTTDP.getGiaDat();
                String maThongTinDatPhong = savedTTDP.getMaThongTinDatPhong();
                LocalDateTime ngayNhanPhong = savedTTDP.getNgayNhanPhong().atStartOfDay();
                LocalDateTime ngayTraPhong = savedTTDP.getNgayTraPhong().atStartOfDay();
                String fullName = savedTTDP.getDatPhong().getKhachHang().getHo() + " " + savedTTDP.getDatPhong().getKhachHang().getTen();
                LocalDateTime ngayDatPhong = savedTTDP.getDatPhong().getNgayDat().atStartOfDay();

                // Thông tin thêm
                Double tongTien = dp.getTongTien();

                emailService.sendThankYouEmail(
                        savedTTDP.getDatPhong().getKhachHang().getEmail(),
                        fullName,
                        loaiPhong,
                        giaDat,
                        ngayNhanPhong,
                        ngayTraPhong,
                        ngayDatPhong,
                        maThongTinDatPhong,
                        soDem,
                        finalTienPhuThu,
                        tongTien
                );
            } catch (Exception e) {
                System.err.println("Lỗi khi gửi email: " + e.getMessage());
            }
        }).start();

        return savedTTDP;
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
                        "<p>Ngoài ra, chúng tôi rất mong nhận được ý kiến đánh giá từ bạn về trải nghiệm tại BamBooking. " +
                        "Phản hồi của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ và mang đến những trải nghiệm tốt hơn cho bạn cũng như các khách hàng khác trong tương lai.</p>" +
                        "<p><a href=\"[Link]\">Gửi phản hồi</a></p>" + // Thay [Link] bằng URL thật nếu có
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
    public void guiEmailXacNhandp(DatPhongRequest datPhongRequest) {
        try {
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(datPhongRequest.getId());
            ThongTinDatPhong firstThongTin = ListTTDP.get(0);
            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Integer iddp = datPhongRequest.getId();
            String hoTen = datPhongRequest.getKhachHang().getHo() + " " + datPhongRequest.getKhachHang().getTen();
            String sdt = datPhongRequest.getKhachHang().getSdt();
            String email = datPhongRequest.getKhachHang().getEmail();
            Integer soNguoi = datPhongRequest.getSoNguoi();
            Double tongTien = datPhongRequest.getTongTien();
            LocalDate ngayNhanPhong = firstThongTin.getNgayNhanPhong();
            LocalDate ngayTraPhong = firstThongTin.getNgayTraPhong();

            Map<String, Long> loaiPhongCount = ListTTDP.stream()
                    .collect(Collectors.groupingBy(
                            thongTin -> thongTin.getLoaiPhong().getTenLoaiPhong(),
                            Collectors.counting()
                    ));

            String loaiPhong = loaiPhongCount.entrySet().stream()
                    .map(entry -> entry.getValue() + " " + entry.getKey())
                    .collect(Collectors.joining(", "));

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
                            <tr style="background-color: #f8f8f8;">
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Loại phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                            <tr style="background-color: #f8f8f8;">
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ngày nhận phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ngày trả phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                        </table>
                        <p style="text-align: center;">
                            <a href="http://localhost:3001/confirm-booking/%s" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xác nhận Đặt Phòng</a>
                        </p>
                        <p>Chúng tôi rất mong nhận được ý kiến đánh giá từ bạn để cải thiện chất lượng dịch vụ. Vui lòng gửi phản hồi tại đây:</p>
                        <p style="text-align: center;">
                            <a href="[Link]" style="display: inline-block; padding: 10px 20px; background-color: #2ecc71; color: #fff; text-decoration: none; border-radius: 5px;">Gửi Phản Hồi</a>
                        </p>
                        <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                        <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                    </div>
                    """.formatted(hoTen, hoTen, sdt, email, soNguoi, String.format("%,.0f", tongTien), loaiPhong, ngayNhanPhong, ngayTraPhong, iddp);

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
            System.out.println(iddp);
            List<ThongTinDatPhong> ListTTDP = thongTinDatPhongRepository.findByIDDatPhong(iddp);
            ThongTinDatPhong firstThongTin = ListTTDP.get(0);
            DatPhongResponse datPhong = datPhongRepository.findByIdDatPhong(iddp);
            // Tạo MimeMessage để hỗ trợ HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String hoTen = datPhong.getKhachHang().getHo() + " " + datPhong.getKhachHang().getTen();
            String sdt = datPhong.getKhachHang().getSdt();
            String email = datPhong.getKhachHang().getEmail();
            Integer soNguoi = datPhong.getSoNguoi();
            Double tongTien = datPhong.getTongTien();
            LocalDate ngayNhanPhong = firstThongTin.getNgayNhanPhong();
            LocalDate ngayTraPhong = firstThongTin.getNgayTraPhong();

            Map<String, Long> loaiPhongCount = ListTTDP.stream()
                    .collect(Collectors.groupingBy(
                            thongTin -> thongTin.getLoaiPhong().getTenLoaiPhong(),
                            Collectors.counting()
                    ));

            String loaiPhong = loaiPhongCount.entrySet().stream()
                    .map(entry -> entry.getValue() + " " + entry.getKey())
                    .collect(Collectors.joining(", "));

            helper.setTo(email);
            helper.setSubject("Thông báo đơn Đặt Phòng đã được xác nhận- BamBooking");

            // Nội dung HTML với CSS inline để định dạng
            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
                        <h2 style="color: #2c3e50;">Đặt Phòng Đã Được Xác Nhận Thành Công</h2>
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
                            <tr style="background-color: #f8f8f8;">
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s VND</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Loại phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                            <tr style="background-color: #f8f8f8;">
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ngày nhận phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ngày trả phòng</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                            </tr>
                        </table>
                        <p style="text-align: center;">
                            <a href="http://localhost:3001/lich-su-dat-phong/%s" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Xem lịch sử đặt phòng</a>
                        </p>
                        <p>Chúng tôi rất mong nhận được ý kiến đánh giá từ bạn để cải thiện chất lượng dịch vụ. Vui lòng gửi phản hồi tại đây:</p>
                        <p style="text-align: center;">
                            <a href="[Link]" style="display: inline-block; padding: 10px 20px; background-color: #2ecc71; color: #fff; text-decoration: none; border-radius: 5px;">Gửi Phản Hồi</a>
                        </p>
                        <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email <a href="mailto:support@bambooking.com">support@bambooking.com</a> hoặc hotline <strong>0123-456-789</strong>.</p>
                        <p style="margin-top: 20px;">Trân trọng,<br><strong>Đội ngũ BamBooking</strong></p>
                    </div>
                    """.formatted(hoTen, hoTen, sdt, email, soNguoi, String.format("%,.0f", tongTien), loaiPhong, ngayNhanPhong, ngayTraPhong, email);

            helper.setText(htmlContent, true); // true để cho phép HTML

            // Gửi email
            mailSender.send(message);
            System.out.println("Email thông báo đã được gửi đến: " + email);

        } catch (MessagingException e) {
            throw new InvalidDataException("Không thể gửi email xác nhận đặt phòng: " + e.getMessage());
        }
    }


}
