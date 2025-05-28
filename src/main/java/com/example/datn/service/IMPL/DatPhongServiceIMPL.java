package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.DatCocThanhToan;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.*;
import com.example.datn.service.DatPhongService;
import com.example.datn.utilities.UniqueDatPhongCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;


@Service
@Slf4j
public class DatPhongServiceIMPL implements DatPhongService {
    private final JavaMailSender mailSender;
    @Autowired
    DatPhongRepository datPhongRepository;

    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    XepPhongRepository xepPhongRepository;

    @Autowired
    DatCocThanhToanRepository datCocThanhToanRepository;

    public DatPhongServiceIMPL(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable) {
        return datPhongRepository.DatPhongTheoTrangThai(tt, pageable);
    }

    @Override
    public List<DatPhong> getAll() {
        return datPhongRepository.findAll();
    }

    @Override
    public DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        DatPhongResponse datPhongResponse = new DatPhongResponse();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setSoPhong(datPhongRequest.getSoPhong());
        datPhong.setSoNguoi(datPhongRequest.getSoNguoi());
        datPhong.setSoTre(datPhongRequest.getSoTre());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setNgayDat(LocalDateTime.now());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        DatPhong dp = datPhongRepository.save(datPhong);


        datPhongResponse.setId(dp.getId());
        datPhongResponse.setMaDatPhong(dp.getMaDatPhong());
        datPhongResponse.setSoPhong(dp.getSoPhong());
        datPhongResponse.setSoNguoi(dp.getSoNguoi());
        datPhongResponse.setSoTre(dp.getSoTre());
        datPhongResponse.setKhachHang(dp.getKhachHang());
        datPhongResponse.setTongTien(dp.getTongTien());
        datPhongResponse.setNgayDat(dp.getNgayDat());
        datPhongResponse.setGhiChu(dp.getGhiChu());
        datPhongResponse.setTrangThai(dp.getTrangThai());
        return datPhongResponse;
    }

    @Override
    public DatPhongResponse detailDatPhong(Integer id) {
        return datPhongRepository.findByIdDatPhong(id);
    }

    @Override
    public Page<DatPhongResponse> searchDatPhong(String keyword, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return datPhongRepository.searchDatPhong(keyword, startDate, endDate, pageable);
    }


    @Override
    public DatPhong updateDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = datPhongRepository.findByMaDatPhong(datPhongRequest.getMaDatPhong());
        datPhong.setSoNguoi(datPhongRequest.getSoNguoi());
        datPhong.setSoTre(datPhongRequest.getSoTre());
        datPhong.setSoPhong(datPhongRequest.getSoPhong());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public DatPhong findByMaDatPhong(String maDatPhong) {
        return datPhongRepository.findByMaDatPhong(maDatPhong);
    }

//    @Override
//    public Double sumTotalAmountByIDDatPhong(Integer idDP) {
//        Double tongTien = 0.0;
//        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByDatPhongId(idDP);
//        for (ThongTinDatPhong ttdp : ttdps) {
//            LocalDate ngayNhanPhong = ttdp.getNgayNhanPhong();
//            LocalDate ngayTraPhong = ttdp.getNgayTraPhong();
//            Double giaDat = ttdp.getGiaDat();
//
//            if (ngayNhanPhong != null && ngayTraPhong != null && giaDat != null) {
//                long days = java.time.temporal.ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraPhong);
//                if (days == 0) {
//                    days = 1;
//                }
//                tongTien += days * giaDat;
//            }
//        }
//        return tongTien;
//    }

    @Override
    public Page<DatPhongResponse> findAll(String keyword, Pageable pageable) {
        return datPhongRepository.findAll(keyword, pageable);
    }

    @Override
    public Page<DatPhong> getCanceledDatPhong(String maDatPhong, Pageable pageable) {
        return datPhongRepository.findByTrangThaiAndMaDatPhongContainingIgnoreCase("Đã hủy", maDatPhong, pageable);
    }

    public DatPhong addDatPhongNgay(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setNgayDat(datPhongRequest.getNgayDat());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public Page<DatPhong> DSDatPhong(Pageable pageable) {
        return datPhongRepository.DSDatPhong(pageable);
    }

    @Override
    public void xoaDatPhong(Integer iddp) {
        DatPhong dp = datPhongRepository.findById(iddp).get();
        dp.setTrangThai("Đã hủy");
        datPhongRepository.save(dp);
    }

    public Page<DatPhongResponse> findDatPhongToCheckin(
            String key, int page, int size,
            LocalDateTime ngayNhanPhong,
            LocalDateTime ngayTraPhong) {
        Pageable pageable = PageRequest.of(page, size);
        List<String> trangThai = Arrays.asList("Đã xác nhận");
        List<String> trangThaiTTDP = Arrays.asList("Đã xếp","Chưa xếp");
        return datPhongRepository.DatPhongTheoTrangThai(trangThai, trangThaiTTDP, key, ngayNhanPhong, ngayTraPhong, pageable
        );
    }

    public Page<DatPhongResponse> findDatPhong(String key, LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Pageable pageable) {
        List<String> trangThaiTTDP = Arrays.asList("Đang đặt phòng", "Đang ở", "Chưa xếp", "Đã xếp", "Đã trả phòng", "Đã kiểm tra phòng");
        List<String> trangThai = Arrays.asList("Đang đặt phòng", "Chưa xác nhận", "Đã xác nhận", "Đã nhận phòng", "Đã trả phòng", "Đã thanh toán");
        return datPhongRepository.findDatPhong(trangThai, trangThaiTTDP, key, ngayNhanPhong, ngayTraPhong, pageable);
    }

//    public void updateTrangThaiDatPhong() {
//        LocalDateTime now = LocalDateTime.now();
//
//        for (DatPhong dp : datPhongs) {
//            List<String> trangThaiTTDPs = Arrays.asList("Chua xep", "Da xep", "Dang o");
//            List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByDatPhongId(dp.getId(),trangThaiTTDPs);
//            for(ThongTinDatPhong ttdp : ttdps) {
//                String status = "";
//                if(ttdp.getTrangThai().equalsIgnoreCase("Chua xep")){
//                    status = "Cần xếp phòng";
//                }
//            }
//
//            String currentTrangThai = dp.getTrangThai();
//            String newTrangThai = currentTrangThai;
//
//            // Logic cập nhật trạng thái
//            if ("Chua xep".equals(currentTrangThai)) {
//                if (now.isAfter(dp.getNgayNhanPhong())) {
//                    newTrangThai = "Dang o"; // Nếu đã qua giờ nhận phòng
//                }
//            } else if ("Dang o".equals(currentTrangThai)) {
//                if (now.isAfter(dp.getNgayTraPhong())) {
//                    newTrangThai = "Da tra phong"; // Nếu đã qua giờ trả phòng
//                }
//            }
//
//            // Nếu trạng thái thay đổi, cập nhật và gửi thông báo
//            if (!newTrangThai.equals(currentTrangThai)) {
//                dp.setTrangThai(newTrangThai);
//                datPhongRepository.save(dp);
//                sendTrangThaiUpdate(dp); // Gửi thông báo qua WebSocket
//            }
//        }
//    }

    public DatPhong huyDatPhong(String maDatPhong) {
        DatPhong dp = datPhongRepository.findByMaDatPhong(maDatPhong);
        if (dp == null) {
            throw new InvalidDataException("Không tìm thấy đặt phòng với mã: " + maDatPhong);
        }

        LocalDateTime ngayDatPhong = dp.getNgayDat();
        if (ngayDatPhong == null) {
            throw new InvalidDataException("Ngày đặt phòng không hợp lệ cho mã: " + maDatPhong);
        }

        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByMaDatPhong(maDatPhong);
        if (ttdps.isEmpty()) {
            throw new InvalidDataException("Không tìm thấy thông tin đặt phòng cho mã: " + maDatPhong);
        }

        LocalDateTime ngayNhanPhong = ttdps.get(0).getNgayNhanPhong();
        if (ngayNhanPhong == null) {
            throw new InvalidDataException("Ngày nhận phòng không hợp lệ cho mã: " + maDatPhong);
        }

        String trangThaiThanhToan = ttdps.get(0).getTrangThaiThanhToan();
        String ghiChuHoanTien;

        if ("Chưa thanh toán".equals(trangThaiThanhToan)) {
            dp.setTrangThai("Đã hủy");
            datPhongRepository.save(dp);
            for (ThongTinDatPhong ttdp : ttdps) {
                ttdp.setTrangThai("Đã hủy");
                thongTinDatPhongRepository.save(ttdp);

                XepPhong xp = xepPhongRepository.getByMaTTDP(ttdp.getMaThongTinDatPhong());
                if (xp != null) {
                    xp.setTrangThai("Đã hủy");
                    xepPhongRepository.save(xp);
                }
            }
        } else {
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
                log.error("Lỗi khi gửi email thông báo hủy đặt phòng mã: {}", maDatPhong, e);
            }
        }

        return datPhongRepository.findByMaDatPhong(maDatPhong);
    }

    @Scheduled(fixedRate = 1000)
    public void checkDatPhongConfirmed() {
        Logger logger = LoggerFactory.getLogger(DatPhongServiceIMPL.class);
        List<String> trangThai = Arrays.asList("Đang đặt phòng");
        LocalDateTime now = LocalDateTime.now();
        List<DatPhong> listDP = datPhongRepository.findDatPhongByTrangThais(trangThai);

        for (DatPhong dp : listDP) {
            logger.debug("Kiểm tra đặt phòng ID: {}", dp.getId());
            LocalDateTime ngayDat = dp.getNgayDat();
            if (ngayDat != null) {
                if (ngayDat.plusHours(2).isBefore(now)) {
                    dp.setGhiChu("Hủy do không xác nhận trong vòng 2 tiếng");
                    dp.setTrangThai("Đã hủy");
                    datPhongRepository.save(dp);

                    List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByMaDatPhong(dp.getMaDatPhong());
                    for (ThongTinDatPhong ttdp : ttdps) {
                        ttdp.setGhiChu("Hủy do không xác nhận trong vòng 2 tiếng");
                        ttdp.setTrangThai("Đã hủy");
                        thongTinDatPhongRepository.save(ttdp);
                    }
                    logger.info("Đã hủy đặt phòng mã: {} do không xác nhận trong 2 tiếng", dp.getMaDatPhong());
                    try {
                        sendCancellationEmail(dp, 0.0);
                    } catch (MessagingException e) {
                        logger.error("Lỗi khi gửi email thông báo hủy đặt phòng mã: {}", dp.getMaDatPhong(), e);
                    }
                }
            }
        }
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