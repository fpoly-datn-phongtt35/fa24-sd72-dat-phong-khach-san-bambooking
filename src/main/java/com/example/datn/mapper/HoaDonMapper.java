package com.example.datn.mapper;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.model.HoaDon;
import org.springframework.stereotype.Component;

@Component
public class HoaDonMapper {
    public HoaDon toHoaDon(HoaDonRequest request){
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon(request.getMaHoaDon());
        hoaDon.setNhanVien(request.getNhanVien());
        hoaDon.setDatPhong(request.getDatPhong());
        hoaDon.setTongTien(request.getTongTien());
        hoaDon.setNgayTao(request.getNgayTao());
        hoaDon.setTrangThai(request.getTrangThai());
        return hoaDon;
    }

    public HoaDonResponse toHoaDonResponse(HoaDon hoaDon){
        HoaDonResponse response = new HoaDonResponse();
        response.setId(hoaDon.getId());
        response.setMaHoaDon(hoaDon.getMaHoaDon());

        String hoTenNhanVien = hoaDon.getNhanVien().getHo() + " " + hoaDon.getNhanVien().getTen();
        response.setHoTenNhanVien(hoTenNhanVien);

        response.setMaDatPhong(hoaDon.getDatPhong().getMaDatPhong());
        response.setTongTien(hoaDon.getTongTien());
        response.setNgayTao(hoaDon.getNgayTao());
        response.setTrangThai(hoaDon.getTrangThai());
        return response;
    }
}
