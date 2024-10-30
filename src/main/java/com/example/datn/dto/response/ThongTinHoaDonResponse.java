package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonResponse {
    Integer id;
    Integer idTraPhong;
    Integer idHoaDon;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
}
