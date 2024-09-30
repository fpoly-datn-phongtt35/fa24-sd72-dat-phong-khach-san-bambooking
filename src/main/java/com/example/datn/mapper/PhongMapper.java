package com.example.datn.mapper;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.model.Phong;
import com.example.datn.model.LoaiPhong;
import org.springframework.stereotype.Component;

@Component
public class PhongMapper {

    public Phong toPhong(PhongRequest request) {
        Phong phong = new Phong();
        phong.setMaPhong(request.getMaPhong());
        phong.setTenPhong(request.getTenPhong());
        phong.setGiaPhong(request.getGiaPhong());
        phong.setTinhTrang(request.getTinhTrang());
        phong.setTrangThai(request.getTrangThai());

        LoaiPhong loaiPhong = new LoaiPhong();
        loaiPhong.setId(request.getIdLoaiPhong());
        phong.setLoaiPhong(loaiPhong);

        return phong;
    }

    public PhongResponse toPhongResponse(Phong phong) {
        PhongResponse response = new PhongResponse();
        response.setId(phong.getId());
        response.setLoaiPhong(phong.getLoaiPhong());
        response.setMaPhong(phong.getMaPhong());
        response.setTenPhong(phong.getTenPhong());
        response.setGiaPhong(phong.getGiaPhong());
        response.setTinhTrang(phong.getTinhTrang());
        response.setTrangThai(phong.getTrangThai());
        return response;
    }
}
