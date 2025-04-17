package com.example.datn.service.IMPL;

import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.exception.RoomNotCheckedException;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.TraPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
    TraPhongRepository traPhongRepository;
    XepPhongRepository xepPhongRepository;
    KiemTraPhongRepository kiemTraPhongRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    DatPhongRepository datPhongRepository;
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

        XepPhong xepPhong = traPhong.getXepPhong();
        String maDatPhong = xepPhong.getThongTinDatPhong().getDatPhong().getMaDatPhong();

        List<Object[]> unverifiedRooms = kiemTraPhongRepository.findUnverifiedRooms(maDatPhong);
        if (!unverifiedRooms.isEmpty()) {
            List<String> roomNames = unverifiedRooms.stream()
                    .map(room -> String.valueOf(room[1])).toList();
            throw new RoomNotCheckedException("Danh sách phòng chưa kiểm tra: "
                                              + roomNames + ", nhân viên vui lòng kiểm tra phòng trước khi trả phòng!");
        }

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        DatPhong datPhong = thongTinDatPhong.getDatPhong();

        thongTinDatPhong.setTrangThai("Đã trả phòng");
        datPhong.setTrangThai("Đã trả phòng");
        xepPhong.setTrangThai("Đã trả phòng");

        thongTinDatPhongRepository.save(thongTinDatPhong);
        datPhongRepository.save(datPhong);
        xepPhongRepository.save(xepPhong);
        traPhong.setTrangThai(true);
        TraPhong savedTraPhong = traPhongRepository.save(traPhong);
        try {
            sendMailCheckout(savedTraPhong.getId());
            log.info("Đã gửi email đánh giá cho trả phòng có ID: {}", savedTraPhong.getId());
        } catch (InvalidDataException e) {
            log.error("Lỗi khi gửi email đánh giá cho trả phòng có ID {}: {}", savedTraPhong.getId(), e.getMessage());
            // Quyết định xem bạn có muốn re-throw exception này hay chỉ log lỗi
            // Nếu việc gửi email không quan trọng bằng việc trả phòng, bạn có thể chỉ log lỗi.
            // Nếu việc gửi email là một phần quan trọng của quy trình, bạn có thể re-throw.
            // Ví dụ: throw new RuntimeException("Lỗi trong quá trình gửi email đánh giá.", e);
        }

        log.info("================ End checkOutById ================");
        return savedTraPhong;

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
                })
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<TraPhong> DSTraPhong() {
        return traPhongRepository.findAll();
    }

    @Override
    public void sendMailCheckout(Integer idTraPhong) {
        String emailKhachHang = datPhongRepository.findEmailByTraPhongId(idTraPhong);
        if (emailKhachHang == null || emailKhachHang.isEmpty()) {
            System.err.println("Không tìm thấy email cho idTraPhong: " + idTraPhong);
            return; // Thêm return để tránh NullPointerException nếu không tìm thấy email
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailKhachHang);
        message.setSubject("Chúng tôi rất mong nhận được đánh giá của bạn về kỳ nghỉ tại BamBooking!");
        message.setText("Chào bạn,\n\nCảm ơn bạn đã lựa chọn BamBooking cho kỳ nghỉ vừa qua." +
                " Chúng tôi hy vọng bạn đã có những trải nghiệm tuyệt vời.\n" +
                "\nChúng tôi rất mong bạn dành chút thời gian để chia sẻ ý kiến đánh giá về kỳ nghỉ của mình." +
                " Phản hồi của bạn sẽ giúp chúng tôi cải thiện dịch vụ và mang đến trải nghiệm tốt hơn cho những" +
                " khách hàng tiếp theo.\n\nXin vui lòng nhấp vào liên kết dưới đây để đánh giá:\n" +
                "\n[LIÊN KẾT ĐẾN TRANG ĐÁNH GIÁ]\n\nÝ kiến của bạn vô cùng quan trọng đối với chúng tôi.\n" +
                "\nTrân trọng,\nĐội ngũ BamBooking\n");
        try {
            mailSender.send(message);
            System.out.println("Email đánh giá đã được gửi đến: " + emailKhachHang);
        } catch (Exception e) {
            throw new InvalidDataException("Không thể gửi email đánh giá: " + e.getMessage());
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
        LocalDate ngayNhan = thongTinDatPhong.getNgayNhanPhong();

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