package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThanhToanRequest {
    Integer idNhanVien;
    Integer idHoaDon;
    Double tienThanhToan;
    Double tienThua;
    Boolean phuongThucThanhToan;
    String maVietQR;
    Boolean trangThai;
}
