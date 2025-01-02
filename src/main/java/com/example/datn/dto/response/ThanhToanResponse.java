package com.example.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThanhToanResponse {
    Integer id;
    Integer idNhanVien;
    String tenNhanVien;
    String maHoaDon;
    String ngayThanhToan;
    Double tongTien;
    Double tienThanhToan;
    Double tienThua;
    String phuongThucThanhToan;
    String trangThai;
}
