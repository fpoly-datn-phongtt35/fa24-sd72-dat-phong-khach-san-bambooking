package com.example.datn.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateThongTinHoaDonRequest {
    @NotNull(message = "idHoaDon không được phép trống!")
    private Integer idHoaDon;
    @NotNull(message = "idThongTinHoaDon không được phép trống!")
    private Integer idThongTinHoaDon;
    private Double tienKhauTru;
}
