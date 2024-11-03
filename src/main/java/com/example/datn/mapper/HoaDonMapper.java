package com.example.datn.mapper;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class HoaDonMapper {
    public static HoaDon toHoaDon(HoaDonRequest request, NhanVien nhanVien, DatPhong datPhong) {
        HoaDon hoaDon = new HoaDon();
        //Set mã hóa đơn tự sinh 6 ký tự (impl)
        hoaDon.setNhanVien(nhanVien);
        hoaDon.setDatPhong(datPhong);
        hoaDon.setTongTien(0.0);
        hoaDon.setNgayTao(LocalDate.now());
        hoaDon.setTrangThai("Chưa thanh toán");
        return hoaDon;
    }

    public HoaDonResponse toHoaDonResponse(HoaDon hoaDon) {
        HoaDonResponse response = new HoaDonResponse();
        response.setId(hoaDon.getId());
        response.setIdHoaDon(hoaDon.getId());
        response.setMaHoaDon(hoaDon.getMaHoaDon());
        response.setHoTenNhanVien(hoaDon.getHoTenNhanVien());
        response.setMaDatPhong(hoaDon.getDatPhong() != null ? hoaDon.getDatPhong().getMaDatPhong() : "Không có thông tin");
        response.setTongTien(hoaDon.getTongTien());
        response.setNgayTao(hoaDon.getNgayTao());
        response.setTrangThai(hoaDon.getTrangThai());
        return response;
    }
}
