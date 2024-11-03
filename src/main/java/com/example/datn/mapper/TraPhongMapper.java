package com.example.datn.mapper;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.model.TraPhong;
import com.example.datn.model.XepPhong;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class TraPhongMapper {
    public TraPhong toTraPhong(TraPhongRequest request, XepPhong xepPhong) {
        TraPhong traPhong = new TraPhong();
        traPhong.setXepPhong(xepPhong);
        traPhong.setNgayTraThucTe(LocalDate.now());
        traPhong.setTrangThai(request.getTrangThai());
        return traPhong;
    }

    public TraPhongResponse toTraPhongResponse(TraPhong traPhong) {
        TraPhongResponse response = new TraPhongResponse();
        response.setId(traPhong.getId());
        response.setIdXepPhong(traPhong.getXepPhong().getId());
        response.setNgayTraThucTe(traPhong.getNgayTraThucTe());
        response.setTrangThai(traPhong.getTrangThai());
        return response;
    }
}
