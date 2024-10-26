package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonResponse {
    Integer id;
    String maHoaDon;
    LocalDate ngayTraPhong;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
}
