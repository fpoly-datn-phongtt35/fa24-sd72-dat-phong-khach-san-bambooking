package com.example.datn.dto.request;

import com.example.datn.model.DichVuSuDung;
import com.example.datn.model.HoaDon;
import com.example.datn.model.TraPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonRequest {
    TraPhong traPhong;
    HoaDon hoaDon;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
}
