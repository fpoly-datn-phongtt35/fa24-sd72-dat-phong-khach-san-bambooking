package com.example.datn.mapper;

import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Component
public class HoaDonMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public HoaDonResponse toHoaDonResponse(HoaDon hoaDon) {
        HoaDonResponse response = new HoaDonResponse();
        response.setId(hoaDon.getId());
        response.setMaHoaDon(hoaDon.getMaHoaDon());
        response.setTenDangNhap(hoaDon.getTenDangNhap());
        response.setTenNhanVien(hoaDon.getTenNhanVien());
        response.setMaDatPhong(Optional.ofNullable(hoaDon.getDatPhong()).map(DatPhong::getMaDatPhong).orElse("Không có thông tin đặt phòng"));
        response.setTenKhachHang(Optional.ofNullable(hoaDon.getDatPhong()).map(DatPhong::getFullNameKhachHang).orElse("Không có thông tin khách hàng"));
        response.setTongTien(hoaDon.getTongTien());
        response.setNgayTao(Optional.ofNullable(hoaDon.getNgayTao()).map(date -> date.format(FORMATTER)).orElse(null));
        response.setTrangThai(hoaDon.getTrangThai());

        return response;
    }
}
