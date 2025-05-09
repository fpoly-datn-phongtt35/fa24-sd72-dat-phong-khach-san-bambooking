package com.example.datn.service.IMPL;

import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.exception.RoomNotCheckedException;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.TraPhongService;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j(topic = "TRA_PHONG_SERVICE")
public class TraPhongServiceImpl implements TraPhongService {
    PhongRepository phongRepository;
    TraPhongRepository traPhongRepository;
    XepPhongRepository xepPhongRepository;
    KiemTraPhongRepository kiemTraPhongRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    DatPhongRepository datPhongRepository;
    KhachHangCheckinRepository khachHangCheckinRepository;
    private final JavaMailSender mailSender;

    @Override
    public Page<TraPhongResponse> getAllTraPhong(Pageable pageable) {
        return traPhongRepository.findAll(pageable)
                .map(this::convertToTraPhongResponse);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public TraPhong checkOutById(Integer idTraPhong) {
        log.info("================ Start checkOutById ================");
        TraPhong traPhong = traPhongRepository.findById(idTraPhong)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy trả phòng có id: " + idTraPhong));

        // Kiểm tra TraPhong đã trả chưa
        if (traPhong.getTrangThai()) {
            log.warn("Yêu cầu trả phòng cho TraPhong ID {} bị từ chối vì phòng đã được trả trước đó", idTraPhong);
            throw new IllegalStateException("Phòng đã được trả trước đó cho TraPhong ID: " + idTraPhong);
        }

        XepPhong xepPhong = traPhong.getXepPhong();
        if (xepPhong == null) {
            throw new RuntimeException("Xếp phòng đang bị null cho TraPhong có ID: " + idTraPhong);
        }

        // Kiểm tra trạng thái kiểm tra phòng
        Optional<KiemTraPhong> kiemTraPhongOp = kiemTraPhongRepository.findByXepPhongId(xepPhong.getId());
        if (kiemTraPhongOp.isEmpty() || !"Đã kiểm tra".equals(kiemTraPhongOp.get().getTrangThai())) {
            Phong phong = xepPhong.getPhong();
            if (phong == null) {
                throw new EntityNotFountException("Phong bị null cho XepPhong ID: " + xepPhong.getId());
            }
            log.warn("Yêu cầu trả phòng cho XepPhong ID {} bị từ chối do chưa kiểm tra. Trạng thái KTP: {}",
                    xepPhong.getId(),
                    kiemTraPhongOp.isPresent() ? kiemTraPhongOp.get().getTrangThai() : "Không có KTP");
            throw new RoomNotCheckedException(
                    String.format("Phòng %s (XepPhong ID: %d) chưa được kiểm tra. Trạng thái hiện tại: %s",
                            phong.getTenPhong(),
                            xepPhong.getId(),
                            kiemTraPhongOp.isPresent() ? kiemTraPhongOp.get().getTrangThai() : "Không có dữ liệu kiểm tra"));
        }

        // Cập nhật trạng thái XepPhong và TraPhong
        updateXepPhongAndTraPhong(xepPhong, traPhong);

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        if (thongTinDatPhong == null) {
            throw new EntityNotFountException("ThongTinDatPhong bị null cho XepPhong ID: " + xepPhong.getId());
        }

        // Cập nhật trạng thái ThongTinDatPhong
        thongTinDatPhong.setTrangThai("Đã trả phòng");
        thongTinDatPhongRepository.save(thongTinDatPhong);
        log.info("Cập nhật trạng thái ThongTinDatPhong ID {} thành 'Đã trả phòng'", thongTinDatPhong.getId());
        sendMailCheckout(thongTinDatPhong);
        // Kiểm tra trạng thái tất cả ThongTinDatPhong trong DatPhong
        DatPhong datPhong = thongTinDatPhong.getDatPhong();
        if (datPhong == null) {
            throw new EntityNotFountException("DatPhong bị null cho ThongTinDatPhong ID: " + thongTinDatPhong.getId());
        }

        // Lấy danh sách ThongTinDatPhong và kiểm tra trạng thái
        List<ThongTinDatPhong> thongTinDatPhongs = thongTinDatPhongRepository.findByDatPhong_Id(datPhong.getId());
        log.info("Danh sách ThongTinDatPhong cho DatPhong ID {}: {}", datPhong.getId(), thongTinDatPhongs);
        boolean allThongTinDatPhongCheckedOut = thongTinDatPhongs.stream()
                .allMatch(ttdp -> "Đã trả phòng".equals(ttdp.getTrangThai()));
        log.info("Kết quả kiểm tra allThongTinDatPhongCheckedOut cho DatPhong ID {}: {}", datPhong.getId(), allThongTinDatPhongCheckedOut);

        //Nếu tất cả thông tin đặt phòng có trạng thái = Đã trả phòng -> set trạng thái Đặt phòng = Đã trả phòng
        if (allThongTinDatPhongCheckedOut) {
            datPhong.setTrangThai("Đã trả phòng");
            datPhongRepository.save(datPhong);
            log.info("Cập nhật trạng thái DatPhong ID {} thành 'Đã trả phòng' vì tất cả ThongTinDatPhong đã trả", datPhong.getId());
        } else {
            log.info("Chưa trả hết ThongTinDatPhong cho DatPhong ID {}. Trạng thái DatPhong giữ nguyên.", datPhong.getId());
        }

//        try {
//            sendMailCheckout(traPhong.getId());
//            log.info("Đã gửi email đánh giá cho trả phòng có ID: {}", traPhong.getId());
//        } catch (InvalidDataException e) {
//            log.error("Lỗi khi gửi email đánh giá cho trả phòng có ID {}: {}", traPhong.getId(), e.getMessage());
//        }
//        log.info("================ End checkOutById ================");
        return traPhong;
    }

    private void updateXepPhongAndTraPhong(XepPhong xepPhong, TraPhong traPhong) {
        xepPhong.setTrangThai("Đã trả phòng");
        traPhong.setNgayTraThucTe(LocalDateTime.now());
        traPhong.setTrangThai(true);
        Phong phong = xepPhong.getPhong();
        if (phong == null) {
            throw new EntityNotFountException("Phong bị null cho XepPhong ID: " + xepPhong.getId());
        }
        phong.setTinhTrang("Trống");
        phongRepository.save(phong);
        xepPhongRepository.save(xepPhong);
        traPhongRepository.save(traPhong);
    }

    @Override
    public List<TraPhongResponse> checkOutByKey(String key) {
        log.info("================ Start checkOutByKey ===============");
        List<String> trangThaiThongTinDatPhong = new ArrayList<>();
        trangThaiThongTinDatPhong.add("Đang ở");
        trangThaiThongTinDatPhong.add("Đã kiểm tra phòng");
        return xepPhongRepository.findByKey(key, trangThaiThongTinDatPhong).stream()
                .map(xepPhong -> {
                    Optional<TraPhong> existingTraPhong = traPhongRepository.findByXepPhong(xepPhong);
                    TraPhong traPhong;
                    if (existingTraPhong.isPresent()) {
                        traPhong = existingTraPhong.get();
                        if (traPhong.getXepPhong() == null) {
                            log.warn("TraPhong ID {} thiếu XepPhong, gán lại.", traPhong.getId());
                            traPhong.setXepPhong(xepPhong);
                            traPhong = traPhongRepository.save(traPhong);
                        }
                    } else {
                        traPhong = new TraPhong();
                        traPhong.setXepPhong(xepPhong);
                        traPhong.setNgayTraThucTe(LocalDateTime.now());
                        traPhong.setTrangThai(false);
                        traPhong = traPhongRepository.save(traPhong);
                    }

                    KiemTraPhong kiemTraPhong = kiemTraPhongRepository.findByXepPhongId(xepPhong.getId()).orElse(null);
                    return convertToTraPhongResponse(traPhong, xepPhong, kiemTraPhong);
                }).distinct().collect(Collectors.toList());
    }

    @Override
    public List<TraPhong> DSTraPhong() {
        return traPhongRepository.findBytt();
    }

//    @Override
//    public void sendMailCheckout(Integer idTraPhong) {
//        String emailKhachHang = datPhongRepository.findEmailByTraPhongId(idTraPhong);
//        if (emailKhachHang == null || emailKhachHang.isEmpty()) {
//            System.err.println("Không tìm thấy email cho idTraPhong: " + idTraPhong);
//            return; // Thêm return để tránh NullPointerException nếu không tìm thấy email
//        }
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(emailKhachHang);
//        message.setSubject("Chúng tôi rất mong nhận được đánh giá của bạn về kỳ nghỉ tại BamBooking!");
//        message.setText("Chào bạn,\n\nCảm ơn bạn đã lựa chọn BamBooking cho kỳ nghỉ vừa qua." +
//                        " Chúng tôi hy vọng bạn đã có những trải nghiệm tuyệt vời.\n" +
//                        "\nChúng tôi rất mong bạn dành chút thời gian để chia sẻ ý kiến đánh giá về kỳ nghỉ của mình." +
//                        " Phản hồi của bạn sẽ giúp chúng tôi cải thiện dịch vụ và mang đến trải nghiệm tốt hơn cho những" +
//                        " khách hàng tiếp theo.\n\nXin vui lòng nhấp vào liên kết dưới đây để đánh giá:\n" +
//                        "\n[LIÊN KẾT ĐẾN TRANG ĐÁNH GIÁ]\n\nÝ kiến của bạn vô cùng quan trọng đối với chúng tôi.\n" +
//                        "\nTrân trọng,\nĐội ngũ BamBooking\n");
//        try {
//            mailSender.send(message);
//            System.out.println("Email đánh giá đã được gửi đến: " + emailKhachHang);
//        } catch (Exception e) {
//            throw new InvalidDataException("Không thể gửi email đánh giá: " + e.getMessage());
//        }
//
//    }


    @Override
    public void sendMailCheckout(ThongTinDatPhong thongTinDatPhong) {
        Integer idTTDP = thongTinDatPhong.getId();
        List<KhachHangCheckin> ListKHC = khachHangCheckinRepository.findByThongTinDatPhong_Id(idTTDP);


        for (KhachHangCheckin khc : ListKHC) {
            if (khc.getKhachHang() == null || khc.getKhachHang().getEmail() == null || khc.getKhachHang().getId() == null) {
                System.out.println("Bỏ qua khách hàng do thiếu thông tin email hoặc id: " + khc);
                continue;
            }

            String emailKhachHang = khc.getKhachHang().getEmail();
            Integer idKhachHang = khc.getKhachHang().getId();

            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(emailKhachHang);
                helper.setSubject("Chúng tôi rất mong nhận được đánh giá của bạn về kỳ nghỉ tại BamBooking!");

                // Nội dung HTML cho email
                String htmlContent =
                        "<div class='container'>" +
                        "<h2>Chào bạn,</h2>" +
                        "<p>Cảm ơn bạn đã lựa chọn BamBooking cho kỳ nghỉ vừa qua. Chúng tôi hy vọng bạn đã có những trải nghiệm tuyệt vời.</p>" +
                        "<p>Chúng tôi rất mong bạn dành chút thời gian để chia sẻ ý kiến đánh giá về kỳ nghỉ của mình. Phản hồi của bạn sẽ giúp chúng tôi cải thiện dịch vụ và mang đến trải nghiệm tốt hơn cho những khách hàng tiếp theo.</p>" +
                        "<p><a href='http://localhost:3001/create-review/" + idKhachHang + "/" + idTTDP + "' class='button'>Gửi đánh giá của bạn</a></p>" +
                        "<p>Ý kiến của bạn vô cùng quan trọng đối với chúng tôi.</p>" +
                        "<p>Trân trọng,<br>Đội ngũ BamBooking</p>" +
                        "</div>";

                helper.setText(htmlContent, true); // true để chỉ định nội dung là HTML

                mailSender.send(message);
                System.out.println("Email đánh giá đã được gửi đến: " + emailKhachHang);
            } catch (Exception e) {
                System.err.println("Không thể gửi email đến " + emailKhachHang + ": " + e.getMessage());
            }
        }
    }

    // Gộp logic convert thành một phương thức duy nhất
    private TraPhongResponse convertToTraPhongResponse(TraPhong traPhong) {
        return convertToTraPhongResponse(traPhong, traPhong.getXepPhong(), null);
    }

    private TraPhongResponse convertToTraPhongResponse(TraPhong traPhong, XepPhong xepPhong, KiemTraPhong kiemTraPhong) {
        if (xepPhong == null) {
            throw new RuntimeException("XepPhong bị null cho TraPhong ID: " + traPhong.getId());
        }

        // Lấy KiemTraPhong nếu chưa có (cho trường hợp gọi từ checkOutByKey)
        KiemTraPhong ktp = (kiemTraPhong != null) ? kiemTraPhong : kiemTraPhongRepository.findByXepPhongId(xepPhong.getId()).orElse(null);
        String trangThaiKTP = (ktp != null) ? ktp.getTrangThai() : "Chưa kiểm tra";
        LocalDateTime thoiGianKTP = (ktp != null) ? ktp.getThoiGianKiemTra() : null;

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        String tenPhong = xepPhong.getPhong().getTenPhong();
        LocalDateTime ngayNhan = thongTinDatPhong.getNgayNhanPhong();

        return new TraPhongResponse(
                traPhong.getId(),
                xepPhong.getId(),
                traPhong.getNgayTraThucTe(),
                traPhong.getTrangThai(),
                tenPhong,
                ngayNhan,
                trangThaiKTP,
                thoiGianKTP
        );
    }
}