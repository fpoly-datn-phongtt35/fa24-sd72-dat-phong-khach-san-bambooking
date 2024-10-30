package com.example.datn.dto.request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonRequest {
    Integer idTraPhong;
    Integer idHoaDon;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
}
