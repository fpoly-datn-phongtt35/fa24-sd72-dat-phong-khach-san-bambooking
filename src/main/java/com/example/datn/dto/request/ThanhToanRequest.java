package com.example.datn.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThanhToanRequest {
    @NotNull(message = "ID nhân viên không được trống")
    Integer idNhanVien;
    @NotNull(message = "ID hóa đơn không được trống")
    Integer idHoaDon;
    @NotNull(message = "Tiền thanh toán không được trống")
    @Positive(message = "Tiền thanh toán phải là số dương")
    Double tienThanhToan;
    Double tienThua;
    Boolean phuongThucThanhToan;
    String maVietQR;
    Boolean trangThai;
}
