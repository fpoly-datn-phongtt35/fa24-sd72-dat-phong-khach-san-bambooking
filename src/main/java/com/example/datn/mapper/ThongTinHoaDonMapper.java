package com.example.datn.mapper;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.dto.response.ThongTinHoaDonResponse;
import com.example.datn.model.HoaDon;
import com.example.datn.model.ThongTinHoaDon;
import com.example.datn.model.TraPhong;
import org.springframework.stereotype.Component;

@Component
public class ThongTinHoaDonMapper {
    public ThongTinHoaDon toThongTinHoaDon(ThongTinHoaDonRequest request, TraPhong traPhong, HoaDon hoaDon){
        ThongTinHoaDon thongTinHoaDon = new ThongTinHoaDon();
        thongTinHoaDon.setTraPhong(traPhong);
        thongTinHoaDon.setHoaDon(hoaDon);
        thongTinHoaDon.setTienDichVu(request.getTienDichVu());
        thongTinHoaDon.setTienPhong(request.getTienPhong());
        thongTinHoaDon.setTienPhuThu(request.getTienPhuThu());
        return thongTinHoaDon;
    }

    public ThongTinHoaDonResponse toThongTinHoaDonResponse(ThongTinHoaDon thongTinHoaDon){
        ThongTinHoaDonResponse response = new ThongTinHoaDonResponse();
        response.setId(thongTinHoaDon.getId());
        response.setIdTraPhong(thongTinHoaDon.getTraPhong().getId());
        response.setIdHoaDon(thongTinHoaDon.getHoaDon().getId());
        response.setTienDichVu(thongTinHoaDon.getTienDichVu());
        response.setTienPhong(thongTinHoaDon.getTienPhong());
        response.setTienPhuThu(thongTinHoaDon.getTienPhuThu());
        return response;
    }
}
