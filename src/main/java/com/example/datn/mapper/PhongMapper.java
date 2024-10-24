package com.example.datn.mapper;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.Phong;
import com.example.datn.model.LoaiPhong;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PhongMapper {

    public Phong toPhong(PhongRequest request) {
        Phong phong = new Phong();
        phong.setMaPhong(request.getMaPhong());
        phong.setTenPhong(request.getTenPhong());
        phong.setTinhTrang(request.getTinhTrang());
        phong.setTrangThai(request.getTrangThai());

        if (request.getIdLoaiPhong() != null){
            LoaiPhong loaiPhong = new LoaiPhong();
            loaiPhong.setId(request.getIdLoaiPhong());
            phong.setLoaiPhong(loaiPhong);
        }

        return phong;
    }

    public PhongResponse toPhongResponse(Phong phong) {
        PhongResponse response = new PhongResponse();
        response.setId(phong.getId());
        response.setLoaiPhong(phong.getLoaiPhong());
        response.setMaPhong(phong.getMaPhong());
        response.setTenPhong(phong.getTenPhong());
        response.setTinhTrang(phong.getTinhTrang());
        response.setTrangThai(phong.getTrangThai());

        String duongDanAnhDauTien = phong.getHinhAnhs().stream()
                .filter(ha -> "hoat dong".equals(ha.getTrangThai())) // Lọc theo trạng thái hoạt động
                .map(HinhAnh::getDuongDan)
                .findFirst()
                .orElse(null);

        response.setDuongDanAnh(duongDanAnhDauTien);
        return response;
    }
}
