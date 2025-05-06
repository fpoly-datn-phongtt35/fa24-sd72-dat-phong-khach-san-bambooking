package com.example.datn.service.IMPL;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.dto.response.XepPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.*;
import com.example.datn.service.XepPhongService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class XepPhongServiceIMPL implements XepPhongService {
    @Autowired
    XepPhongRepository xepPhongRepository;

    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    PhongRepository phongRepository;
    @Autowired
    private KiemTraPhongRepository kiemTraPhongRepository;

    @Autowired
    DatPhongRepository datPhongRepository;

    @Override
    public List<XepPhong> getAll() {
        return xepPhongRepository.findAll();
    }

    @Override
    public XepPhong addXepPhong(XepPhongRequest xepPhongRequest) {
        XepPhong xp = new XepPhong();
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById(xepPhongRequest.getThongTinDatPhong().getId());
        xp.setPhong(xepPhongRequest.getPhong());
        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nhan = xepPhongRequest.getNgayNhanPhong();
        if (nhan.toLocalDate().isEqual(now.toLocalDate()) && now.getHour() >= 14) {
            nhan = now;
        } else {
            nhan = nhan.withHour(14).withMinute(0).withSecond(0).withNano(0);
        }
        LocalDateTime tra = xepPhongRequest.getNgayTraPhong().withHour(12).withMinute(0).withSecond(0).withNano(0);
        xp.setNgayNhanPhong(nhan);
        xp.setNgayTraPhong(tra);
        xp.setTrangThai(xepPhongRequest.getTrangThai());
        ttdp.setTrangThai("Đã xếp");
        thongTinDatPhongRepository.save(ttdp);
        return xepPhongRepository.save(xp);
    }

    @Override
    public XepPhong updateXepPhong(XepPhongRequest xepPhongRequest) {
        if (xepPhongRequest == null || xepPhongRequest.getId() == null || xepPhongRequest.getPhong() == null
                || xepPhongRequest.getPhong().getId() == null || xepPhongRequest.getTrangThai() == null) {
            throw new IllegalArgumentException("Thông tin yêu cầu không hợp lệ.");
        }

        String trangThai = xepPhongRequest.getTrangThai().trim().toLowerCase();
        if (!trangThai.equals("đang ở") && !trangThai.equals("đã xếp")) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + trangThai);
        }

        XepPhong xp = xepPhongRepository.findById(xepPhongRequest.getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy xếp phòng với ID: " + xepPhongRequest.getId()));

        Phong pNew = phongRepository.findById(xepPhongRequest.getPhong().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng với ID: " + xepPhongRequest.getPhong().getId()));

        if (pNew.getTinhTrang().equals("Đang ở") || pNew.getTinhTrang().equals("Đã xếp")) {
            throw new IllegalStateException("Phòng mới đã được sử dụng: " + pNew.getId());
        }

        Phong pOld = xp.getPhong();
        if (pOld == null) {
            throw new IllegalStateException("Xếp phòng không có phòng hiện tại.");
        }

        pOld.setTinhTrang("Trống");
        pNew.setTinhTrang(trangThai.equals("đang ở") ? "Đang ở" : "Đã xếp");
        xp.setPhong(pNew);

        phongRepository.save(pOld);
        phongRepository.save(pNew);
        return xepPhongRepository.save(xp);
    }

    @Override
    public XepPhong getByMaTTDP(String maTTDP) {
        return xepPhongRepository.getByMaTTDP(maTTDP);
    }

    @Override
    public XepPhong checkIn(XepPhongRequest xepPhongRequest) {
        if (xepPhongRequest == null) {
            throw new IllegalArgumentException("XepPhongRequest cannot be null");
        }
        LocalDateTime ngayNhanPhong = xepPhongRequest.getNgayNhanPhong();
        if (ngayNhanPhong == null) {
            throw new IllegalArgumentException("Ngày nhận phòng không được null");
        }
        LocalDateTime ngayTraPhong = xepPhongRequest.getNgayTraPhong();
        if (ngayTraPhong == null) {
            throw new IllegalArgumentException("Ngày trả phòng không được null");
        }

        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDate checkInDate = ngayNhanPhong.toLocalDate();
        LocalDate checkOutDate = ngayTraPhong.toLocalDate();

        // Kiểm tra ngày hiện tại nằm trong khoảng từ ngày nhận phòng đến ngày trả phòng
        LocalDate currentDate = currentDateTime.toLocalDate();
        if (currentDate.isBefore(checkInDate) || currentDate.isAfter(checkOutDate)) {
            throw new IllegalArgumentException(
                    "Chỉ có thể check-in trong khoảng từ ngày nhận phòng (" +
                            checkInDate + ") đến ngày trả phòng (" + checkOutDate + ")");
        }

        LocalDateTime checkInThreshold = checkInDate.atTime(12, 0);
//        if (currentDateTime.isBefore(checkInThreshold)) {
//            throw new IllegalArgumentException(
//                    "Chỉ có thể check-in sau 12:00 PM của ngày nhận phòng (" + checkInDate + ")");
//        }

        try {
            XepPhong xp = xepPhongRepository.findById(xepPhongRequest.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy XepPhong với ID: " + xepPhongRequest.getId()));

            DatPhong dp = datPhongRepository.findByMaDatPhong(
                    xp.getThongTinDatPhong().getDatPhong().getMaDatPhong());
            if (dp == null) {
                throw new RuntimeException("Không tìm thấy đặt phòng");
            }

            ThongTinDatPhong ttdp = xp.getThongTinDatPhong();
            Phong p = xp.getPhong();
            if (ttdp == null || p == null) {
                throw new RuntimeException("Thông tin đặt phòng hoặc phòng không hợp lệ");
            }

            // Cập nhật trạng thái
            dp.setTrangThai("Đã nhận phòng");
            ttdp.setTrangThai("Đang ở");
            p.setTinhTrang("Đang ở");
            xp.setNgayNhanPhong(currentDateTime);
            ngayTraPhong = ngayTraPhong.withHour(12).withMinute(0).withSecond(0).withNano(0); // Đặt giờ trả phòng là 12:00 PM
            xp.setNgayTraPhong(ngayTraPhong);
            xp.setTrangThai("Đang ở");

            datPhongRepository.save(dp);
            return xepPhongRepository.save(xp);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi check-in: " + e.getMessage(), e);
        }
    }

    @Override
    public List<XepPhong> findByKey(String key) {
        List<String> trangThaiThongTinDatPhong = new ArrayList<>();
        trangThaiThongTinDatPhong.add("Đang ở");
        trangThaiThongTinDatPhong.add("Đã kiểm tra phòng");
        return xepPhongRepository.findByKey(key, trangThaiThongTinDatPhong);
    }

    @Override
    public Optional<XepPhong> getXepPhongByThongTinDatPhongId(Integer idThongTinDatPhong) {
        return xepPhongRepository.findByThongTinDatPhong_Id(idThongTinDatPhong);
    }

    @Override
    public XepPhong getById(Integer id) {
        return xepPhongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xếp phòng với id: " + id));
    }

    @Scheduled(fixedRate = 1000) // Chạy mỗi giây
    public void updateThoiGianLuuTru() {
        List<String> tinhTrang = Arrays.asList("Đang ở", "Cần kiểm tra");
        List<String> trangThai = Arrays.asList("Đang ở");
        List<XepPhong> listXP = xepPhongRepository.findByList(tinhTrang, trangThai);
        LocalDateTime now = LocalDateTime.now();
        for (XepPhong xp : listXP) {
            if (xp.getNgayTraPhong() != null && xp.getNgayTraPhong().isBefore(now)) {
                xp.setNgayTraPhong(now);
                xepPhongRepository.save(xp);
            }
        }
    }

    
}
