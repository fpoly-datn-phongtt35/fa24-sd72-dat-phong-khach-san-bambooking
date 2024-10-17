package com.example.datn.mapper;

import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.model.KhachHang;
import org.springframework.stereotype.Component;

@Component
public class KhachHangMapper {
    public KhachHang toKhachHang(KhachHangRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setHo(request.getHo());
        khachHang.setTen(request.getTen());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setDiaChi(request.getDiaChi());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setTrangThai(request.getTrangThai());
        return khachHang;
    }

    public KhachHangResponse toKhachHangResponse(KhachHang khachHang) {
        KhachHangResponse response = new KhachHangResponse();
        response.setId(khachHang.getId());
        response.setHo(khachHang.getHo());
        response.setTen(khachHang.getTen());
        response.setGioiTinh(khachHang.getGioiTinh());
        response.setDiaChi(khachHang.getDiaChi());
        response.setSdt(khachHang.getSdt());
        response.setEmail(khachHang.getEmail());
        response.setNgayTao(khachHang.getNgayTao().toString());
        response.setNgaySua(khachHang.getNgaySua().toString());
        response.setTrangThai(khachHang.getTrangThai());
        return response;
    }
}
