package com.example.datn.service.IMPL;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.dto.response.XepPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.*;
import com.example.datn.service.XepPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById((xepPhongRequest.getThongTinDatPhong().getId()));
        xp.setPhong(xepPhongRequest.getPhong());
        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
        LocalDateTime nhan = xepPhongRequest.getNgayNhanPhong().withHour(14).withMinute(0).withSecond(0).withNano(0);
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
        XepPhong xp = new XepPhong();
//        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById((xepPhongRequest.getThongTinDatPhong().getId()));
//        Phong p = phongRepository.getPhongById(xepPhongRequest.getPhong().getId());
//        xp.setId(xepPhongRequest.getId());
//        xp.setPhong(xepPhongRequest.getPhong());
//        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
//        xp.setNgayNhanPhong(xepPhongRequest.getNgayNhanPhong());
//        xp.setNgayTraPhong(xepPhongRequest.getNgayTraPhong());
//        xp.setTrangThai(xepPhongRequest.getTrangThai());
//        ttdp.setTrangThai("Da xep");
//        thongTinDatPhongRepository.save(ttdp);
//        p.setTinhTrang("occupied");
//        phongRepository.save(p);
        return xepPhongRepository.save(xp);
    }

    @Override
    public XepPhong getByMaTTDP(String maTTDP) {
        return xepPhongRepository.getByMaTTDP(maTTDP);
    }

    @Override
    public XepPhong checkIn(XepPhongRequest xepPhongRequest) {
        System.out.println(xepPhongRequest.getNgayNhanPhong());
        if (xepPhongRequest == null) {
            throw new IllegalArgumentException("XepPhongRequest cannot be null");
        }
        LocalDateTime ngayNhanPhong = xepPhongRequest.getNgayNhanPhong();
        if (ngayNhanPhong == null) {
            throw new IllegalArgumentException("Ngày nhận phòng không được null");
        }

        LocalDate currentDate = LocalDate.now();
        LocalDate checkInDate = ngayNhanPhong.toLocalDate();
        if (!checkInDate.equals(currentDate)) {
            throw new IllegalArgumentException("Chỉ có thể check-in trong ngày hiện tại");
        }

        try {
            XepPhong xp = xepPhongRepository.findById(xepPhongRequest.getId())
                    .orElseGet(() -> this.addXepPhong(xepPhongRequest));
            if (xp == null) {
                throw new RuntimeException("Không thể tạo mới XepPhong");
            }
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
            dp.setTrangThai("Đã nhận phòng");
            ttdp.setTrangThai("Đang ở");
            p.setTinhTrang("Đang ở");
            xp.setNgayNhanPhong(LocalDateTime.now());
            xp.setNgayTraPhong(xepPhongRequest.getNgayTraPhong());
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
}
